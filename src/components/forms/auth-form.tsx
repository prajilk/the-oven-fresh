'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { authClient } from '@/lib/auth-client';
import { ZodAuthSchema } from '@/lib/zod-schema/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LoadingButton from '../ui/loading-button';

const AuthForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [signInLoading, setSignInIsLoading] = useState(false);
  const router = useRouter();
  const callback = useSearchParams();

  const form = useForm<z.infer<typeof ZodAuthSchema>>({
    resolver: zodResolver(ZodAuthSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function handleSignIn(data: z.infer<typeof ZodAuthSchema>) {
    setError(null);
    setSignInIsLoading(true);

    try {
      const signInResponse = await authClient.signIn.username({
        username: data.username,
        password: data.password,
        callbackURL: callback.get('callbackUrl') || undefined,
      });

      if (signInResponse?.error) {
        form.reset();
        throw new Error('Invalid credentials.');
      }

      // @ts-expect-error: Ignore
      const userRole = signInResponse.data.user.role;

      toast.success('Signed in successfully. redirecting...');

      // Redirect based on role
      if (userRole === 'delivery') {
        router.replace('/delivery');
      } else {
        router.replace(callback.get('callbackUrl') ?? '/dashboard');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSignInIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mb-4 sm:mb-7">
              <Label className="text-primary" htmlFor="username">
                Username
              </Label>
              <FormControl className="space-y-2">
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label className="text-primary" htmlFor="password">
                Password
              </Label>
              <FormControl className="space-y-2">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error ? (
          <span className="my-3 block h-5 text-center font-medium text-destructive text-xs sm:my-5 dark:text-red-500">
            {error}
          </span>
        ) : (
          <span className="my-3 block h-5 sm:my-5" />
        )}
        <LoadingButton
          className="mb-5 w-full rounded-full py-5"
          disabled={signInLoading}
          isLoading={signInLoading}
          type="submit"
        >
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
};

export default AuthForm;
