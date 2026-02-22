import { getSession } from '@/lib/auth';
import { ThemeSelectorButton } from './ThemeSelectorButton';

export async function ThemeSelectorWrapper({ currentTheme }: { currentTheme: string }) {
  const session = await getSession();
  if (!session) return null;

  return <ThemeSelectorButton currentTheme={currentTheme} />;
}
