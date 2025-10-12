import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import type * as React from 'react';
import AppNavbar from '@/components/dashboard/app-navbar';
import SideMenu from '@/components/dashboard/sidemenu';
import ErrorComponent from '@/components/error';
import connectDB from '@/config/mongoose';
import { getCurrentUser } from '@/lib/auth';
import Store from '@/models/storeModel';
import MuiThemeProvider from '@/providers/mui-theme-provider';

export default async function DashboardLayout({
  children,
  disableCustomTheme,
}: {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}) {
  const user = await getCurrentUser();

  if (!user || user.role === 'delivery') {
    return (
      <ErrorComponent
        code={403}
        message="You are not authorized to access this page."
        title="Forbidden"
      />
    );
  }

  await connectDB();
  const allStores = await Store.find();
  const store = allStores.find((store) => store.id === user.storeId.toString());

  return (
    <MuiThemeProvider props={{ disableCustomTheme }}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar
          active={{
            id: store._id.toString(),
            location: store.location,
          }}
          role={user.role}
          stores={allStores.map((store) => ({
            id: store._id.toString(),
            location: store.location,
          }))}
          username={user.username || ''}
        />
        {/* Main content */}
        {children}
      </Box>
    </MuiThemeProvider>
  );
}
