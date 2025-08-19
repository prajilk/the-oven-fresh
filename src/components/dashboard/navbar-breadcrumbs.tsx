'use client';

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Show } from '../show';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const role = session?.user.role || '';

  // const currentPath = pathname.split("/").at(-1);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={
        <NavigateNextRoundedIcon className="text-white" fontSize="small" />
      }
    >
      {pathname
        .split('/')
        .filter((path) => !!path)
        .map((path) => (
          <Typography
            className="last:!font-medium text-white capitalize"
            key={path}
            variant="body1"
          >
            <Show>
              <Show.When isTrue={role === 'manager' && path === 'dashboard'}>
                Manager {path}
              </Show.When>
              <Show.When isTrue={role === 'admin' && path === 'dashboard'}>
                Admin {path}
              </Show.When>
              <Show.Else>{path}</Show.Else>
            </Show>
          </Typography>
        ))}
    </StyledBreadcrumbs>
  );
}
