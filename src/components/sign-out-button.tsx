'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';

const SignOutButton = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  async function handleSignOut() {
    try {
      await authClient.signOut();
      toast.success('Signed out successfully.');
      router.push('/');
    } catch {
      toast.error('Something went wrong');
    }
  }

  return (
    <Button className={className} color="primary" onClick={handleSignOut}>
      {children ? children : 'Sign out'}
    </Button>
  );
};

export default SignOutButton;
