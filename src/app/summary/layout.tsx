import type { ReactNode } from 'react';
import ErrorComponent from '@/components/error';
import { getCurrentUser } from '@/lib/auth';

const SummaryLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <ErrorComponent
        code={403}
        message="You are not authorized to access this page."
        title="Forbidden"
      />
    );
  }
  return (
    <>
      {/* Main content */}
      {children}
    </>
  );
};

export default SummaryLayout;
