import Image from 'next/image';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/forms/auth-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';

export default async function Home() {
  const user = await getCurrentUser();

  if (user?.role === 'delivery') {
    redirect('/delivery');
  } else if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white sm:bg-gray-100 lg:py-10">
      <Card className="relative h-screen w-full max-w-sm rounded-none border-none pt-24 shadow-none sm:h-auto sm:rounded-2xl sm:border-solid sm:p-3 sm:pt-3 sm:shadow">
        <CardHeader className="text-primary">
          <div className="sm:-top-16 -translate-x-1/2 absolute top-0 left-1/2 my-5">
            <Image alt="Logo" height={80} src={'/logo.webp'} width={80} />
          </div>
          <CardTitle className="text-lg">Welcome back!</CardTitle>
          <CardDescription className="text-primary text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
