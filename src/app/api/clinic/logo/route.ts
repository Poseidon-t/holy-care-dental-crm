import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use PNG, JPG, or WebP.' }, { status: 400 });
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 2MB.' }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', session.clinicId);
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const filename = `logo.${ext}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Update clinic logo_url in database
    const logoUrl = `/uploads/${session.clinicId}/${filename}`;
    await execute(
      'UPDATE clinics SET logo_url = $1, updated_at = NOW() WHERE id = $2',
      [logoUrl, session.clinicId]
    );

    return NextResponse.json({ success: true, logo_url: logoUrl });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
