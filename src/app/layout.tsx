import type { Metadata } from 'next';
import './globals.css';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/query-provider';
import ReduxProvider from '@/store/provider';
import theme from '../theme';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'The Oven Fresh',
  description: 'Your Favorite South Indian Restaurant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} antialiased`}>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <QueryProvider>
              <ThemeProvider theme={theme}>
                <HeroUIProvider>{children}</HeroUIProvider>
              </ThemeProvider>
            </QueryProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
        <Toaster className="z-[1560]" position="top-right" richColors />
      </body>
    </html>
  );
}
