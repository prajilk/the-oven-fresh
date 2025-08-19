'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';

const ErrorComponent = ({
  message,
  code,
  title,
}: {
  message: string;
  code?: number;
  title?: string;
}) => {
  const router = useRouter();
  async function handleLogin() {
    await authClient.signOut();
    router.push('/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-full bg-destructive/10 p-4">
            <AlertCircle
              aria-hidden="true"
              className="h-12 w-12 text-destructive"
            />
          </div>
          <h1 className="font-bold text-4xl tracking-tighter">{code || 500}</h1>
          <h2 className="font-semibold text-2xl text-muted-foreground">
            {title || 'Something went wrong'}
          </h2>
        </div>

        <div className="space-y-4">
          <h1 className="font-bold">- {message} -</h1>
          <p className="text-muted-foreground">
            Oops! The server cannot process this request due to invalid syntax
            or missing parameters.
          </p>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Here are some helpful links:
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button
                onClick={() => window.location.reload()}
                variant={'outline'}
              >
                Refresh
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
            <Button onClick={handleLogin} variant={'link'}>
              Log in
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorComponent;
