const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

let scheduled = false;

export function startBackupScheduler() {
  if (scheduled) return;
  scheduled = true;

  // Wait 60 seconds for server to fully start
  setTimeout(() => {
    console.log('[Backup Scheduler] Starting daily backup scheduler');
    runBackup();
    setInterval(runBackup, BACKUP_INTERVAL);
  }, 60_000);
}

async function runBackup() {
  const secret = process.env.BACKUP_SECRET;
  if (!secret) {
    console.log('[Backup Scheduler] BACKUP_SECRET not set, skipping');
    return;
  }

  // Use Railway's public domain if available, otherwise localhost
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  const url = domain
    ? `https://${domain}/api/backup`
    : `http://localhost:${process.env.PORT || 3000}/api/backup`;

  try {
    console.log(`[Backup Scheduler] Triggering backup at ${new Date().toISOString()}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    if (data.success) {
      console.log(`[Backup Scheduler] ✓ Backup complete: ${data.backup} (${data.sizeKB}KB)`);
    } else {
      console.error('[Backup Scheduler] ✗ Backup failed:', data);
    }
  } catch (err) {
    console.error('[Backup Scheduler] Error:', err);
  }
}
