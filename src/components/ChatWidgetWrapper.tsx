'use client';

import { usePathname } from 'next/navigation';
import { ChatWidget } from './ChatWidget';

const ADMIN_ROUTES = ['/dashboard', '/login'];

export function ChatWidgetWrapper() {
  const pathname = usePathname();
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  if (isAdminRoute) return null;
  return <ChatWidget />;
}
