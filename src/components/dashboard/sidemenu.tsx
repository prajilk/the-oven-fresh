'use client';

import Box from '@mui/material/Box';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import MenuContent from './menu-content';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
      variant="permanent"
    >
      <div className="flex justify-start bg-primary-foreground py-3 ps-4">
        <Image alt="logo" height={100} src={'/logo.webp'} width={100} />
      </div>
      <Box
        className="bg-primary-foreground"
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
    </Drawer>
  );
}
