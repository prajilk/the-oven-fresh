import { redirect } from 'next/navigation';
import BottomNav from '@/components/delivery/bottom-nav';
import Navbar from '@/components/delivery/navbar';
import ErrorComponent from '@/components/error';
import connectDB from '@/config/mongoose';
import { getCurrentUser } from '@/lib/auth';
import Store from '@/models/storeModel';

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  if (user.role === 'manager') {
    return (
      <ErrorComponent
        code={403}
        key={'Forbidden'}
        message="You are not authorized to access this page"
      />
    );
  }

  await connectDB();
  const store = await Store.findById(user.storeId);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Navbar store={store.location || 'Not Found'} />
      {children}
      <BottomNav />
    </div>
  );
}
