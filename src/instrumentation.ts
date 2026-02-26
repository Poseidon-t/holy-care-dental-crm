export async function register() {
  // Only run backup scheduler in Node.js runtime (not Edge, not during build)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startBackupScheduler } = await import('./lib/backup-scheduler');
    startBackupScheduler();
  }
}
