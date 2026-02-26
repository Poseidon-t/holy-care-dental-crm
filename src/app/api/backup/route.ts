import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import os from 'os';

const GITHUB_REPO = 'Poseidon-t/holy-care-backups';
const GITHUB_TOKEN = process.env.GITHUB_BACKUP_TOKEN;
const BACKUP_SECRET = process.env.BACKUP_SECRET;

export async function POST(request: NextRequest) {
  // Verify secret token
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!BACKUP_SECRET || token !== BACKUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_BACKUP_TOKEN not configured' }, { status: 500 });
  }

  try {
    const db = getDb();

    // Use SQLite's safe backup API — creates a consistent snapshot
    const tmpDir = os.tmpdir();
    const backupPath = path.join(tmpDir, `holycare-backup-${Date.now()}.db`);
    db.backup(backupPath);

    // Read the backup file
    const backupData = fs.readFileSync(backupPath);
    const base64Data = backupData.toString('base64');

    // Clean up temp file
    fs.unlinkSync(backupPath);

    // Generate filename with timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // 2026-02-26
    const timeStr = now.toISOString().split('T')[1].replace(/[:.]/g, '-').slice(0, 8); // 14-30-00
    const fileName = `backups/holycare-${dateStr}-${timeStr}.db`;

    // Check if file already exists (to get its SHA for update)
    let existingSha: string | undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
      );
      if (checkRes.ok) {
        const existing = await checkRes.json();
        existingSha = existing.sha;
      }
    } catch {
      // File doesn't exist, that's fine
    }

    // Upload to GitHub
    const uploadBody: Record<string, string> = {
      message: `Backup ${dateStr} ${timeStr.replace(/-/g, ':')}`,
      content: base64Data,
    };
    if (existingSha) {
      uploadBody.sha = existingSha;
    }

    const uploadRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadBody),
      }
    );

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text();
      console.error('GitHub upload failed:', uploadRes.status, errBody);
      return NextResponse.json(
        { error: 'Failed to upload backup to GitHub', details: errBody },
        { status: 500 }
      );
    }

    // Also keep a "latest" copy for easy restore
    await uploadLatestCopy(base64Data);

    // Clean up old backups (keep last 30)
    await cleanupOldBackups();

    const sizeKB = Math.round(backupData.length / 1024);

    return NextResponse.json({
      success: true,
      backup: fileName,
      sizeKB,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function uploadLatestCopy(base64Data: string) {
  try {
    // Get existing latest.db SHA
    let sha: string | undefined;
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/latest.db`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }

    const body: Record<string, string> = {
      message: `Update latest backup - ${new Date().toISOString()}`,
      content: base64Data,
    };
    if (sha) body.sha = sha;

    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/latest.db`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
  } catch (error) {
    console.error('Failed to update latest.db:', error);
  }
}

async function cleanupOldBackups() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/backups`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
    );

    if (!res.ok) return;

    const files = await res.json() as Array<{ name: string; sha: string }>;
    if (!Array.isArray(files) || files.length <= 30) return;

    // Sort by name (which includes date), remove oldest
    const sorted = files.sort((a, b) => a.name.localeCompare(b.name));
    const toDelete = sorted.slice(0, files.length - 30);

    for (const file of toDelete) {
      await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/backups/${file.name}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Remove old backup ${file.name}`,
            sha: file.sha,
          }),
        }
      );
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
