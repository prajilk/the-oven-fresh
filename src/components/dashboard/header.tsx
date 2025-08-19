import Stack from '@mui/material/Stack';
import { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';
import NavbarBreadcrumbs from './navbar-breadcrumbs';
import StoreDisplay from './store-display';
// import { Badge } from "@heroui/badge";

export default function Header() {
  return (
    <Stack
      className="bg-primary"
      direction="row"
      spacing={2}
      // className="bg-primary sticky top-0 z-50"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        p: 1.5,
      }}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        {/* <button className="px-1 flex items-center">
                    <Badge
                        color="danger"
                        content=""
                        placement="top-right"
                        shape="circle"
                        classNames={{
                            badge: "border-none min-h-2 min-w-2 w-2.5 h-2.5",
                        }}
                    >
                        <NotificationsRoundedIcon className="text-primary-foreground" />
                    </Badge>
                </button> */}
        <Suspense
          fallback={
            <>
              <Skeleton className="h-9 w-[131px] rounded-xl bg-primary-foreground/40" />
              <Skeleton className="h-[42px] w-48 rounded-xl bg-primary-foreground/40" />
            </>
          }
        >
          <StoreDisplay />
        </Suspense>
      </Stack>
    </Stack>
  );
}
