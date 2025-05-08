import Link from 'next/link';
import { Kanban } from 'lucide-react';
import { UserProfile } from '@/components/auth/UserProfile';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Kanban className="h-7 w-7" />
          <span className="text-2xl font-bold">TaskZen</span>
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
