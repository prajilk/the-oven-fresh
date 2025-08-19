'use client';

import KitchenIcon from '@mui/icons-material/Kitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDiningRounded';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

// import { AddOrderDrawer } from "@/components/drawer/delivery/add-order-drawer";

const BottomNav = () => {
  const pathname = usePathname();
  const path = pathname.split('/').at(-1);

  return (
    <div className="fixed right-0 bottom-6 left-0 z-20 flex items-center justify-center gap-1.5">
      <div className="flex items-center rounded-full border border-border bg-background p-1 shadow-lg">
        <Button
          asChild
          className={cn(
            'flex items-center gap-2 rounded-full px-6 py-2',
            path === 'tiffin' && 'bg-primary-foreground'
          )}
          variant="ghost"
        >
          <Link href={'/delivery/tiffin'}>
            <KitchenIcon className="size-5 text-primary" />
            <span>Tiffin</span>
          </Link>
        </Button>
        <div className="mx-1 h-8 w-px bg-border" />
        <Button
          asChild
          className={cn(
            'flex items-center gap-2 rounded-full px-6 py-2',
            path === 'catering' && 'bg-primary-foreground'
          )}
          variant="ghost"
        >
          <Link href={'/delivery/catering'}>
            <TakeoutDiningIcon className="size-5 text-primary" />
            <span>Catering</span>
          </Link>
        </Button>
      </div>
      {/* <AddOrderDrawer /> */}
    </div>
  );
};

export default BottomNav;
