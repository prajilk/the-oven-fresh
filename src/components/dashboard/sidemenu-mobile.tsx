import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { MapPin } from 'lucide-react';
import type * as React from 'react';
import StoreSelect from '../select/store-select';
import { Show } from '../show';
import SignOutButton from '../sign-out-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge as ShadBadge } from '../ui/badge';
import MenuContent from './menu-content';

type SideMenuMobileProps = {
  open: boolean | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  role: string;
  active: { id: string; location: string };
  stores: { id: string; location: string }[];
};

export default function SideMenuMobile({
  open,
  setOpen,
  username,
  role,
  active,
  stores,
}: SideMenuMobileProps) {
  return (
    <Drawer
      anchor="right"
      onClose={() => setOpen(false)}
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: '#f8f1e9',
        },
      }}
    >
      <Stack
        sx={{
          width: '80dvw',
          height: '100%',
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, pb: 0, gap: 1, alignItems: 'center' }}
        >
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar>
              <AvatarImage alt={username} src="/static/images/avatar/7.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground capitalize">
                {username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
              <h6 className="text-lg text-primary capitalize">{username}</h6>
              <p className="text-primary/70 text-xs">
                &#040;
                <span>{role}</span>
                &#041;
              </p>
            </div>
          </Stack>
          {/* <Badge
                        color="danger"
                        content=""
                        placement="top-right"
                        shape="circle"
                    >
                        <NotificationsRoundedIcon color="primary" />
                    </Badge> */}
        </Stack>
        <div className="mb-2 flex items-center gap-2 px-6">
          <Show>
            <Show.When isTrue={role !== 'admin'}>
              <ShadBadge
                className="h-8 gap-1.5 rounded-lg px-3 font-light text-primary text-sm"
                variant="outline"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="capitalize">{active.location}</span>
              </ShadBadge>
            </Show.When>
            <Show.When isTrue={role === 'admin'}>
              <StoreSelect stores={stores} />
            </Show.When>
          </Show>
        </div>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent setOpen={setOpen} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <SignOutButton />
        </Stack>
      </Stack>
    </Drawer>
  );
}
