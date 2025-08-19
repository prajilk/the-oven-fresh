'use client';

import type React from 'react';
import AppTheme from '@/components/shared-theme/app-theme';

const MuiThemeProvider = ({
  children,
  props,
}: {
  children: React.ReactNode;
  props: { disableCustomTheme?: boolean };
}) => {
  return <AppTheme {...props}>{children}</AppTheme>;
};

export default MuiThemeProvider;
