'use client';
import { LoginForm } from '@/components/auth/LoginForm';
import { Kanban } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
          <Kanban className="h-10 w-10" />
          <h1 className="text-4xl font-bold">TaskZen</h1>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
