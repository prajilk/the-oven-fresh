'use client'; // Error boundaries must be Client Components

import ErrorComponent from '@/components/error';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  statusCode?: number;
}) {
  return <ErrorComponent message={error.message} />;
}
