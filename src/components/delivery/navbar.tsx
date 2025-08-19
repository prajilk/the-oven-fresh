import { MapPin } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import ErrorComponent from '../error';
import { NavUser } from '../nav/user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Navbar = async ({ store }: { store: string }) => {
  const user = await getCurrentUser();
  if (!user || user.role === 'manager') {
    return (
      <ErrorComponent
        code={403}
        key={'Forbidden'}
        message="You are not authorized to access this page"
      />
    );
  }
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-gray-900 text-xl dark:text-white">
            Delivery App
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-primary/20 px-2 py-1">
              <MapPin className="size-3 text-primary" />
              <span className="text-xs">{store}</span>
            </div>
            <NavUser
              triggerClassname="outline-none rounded-full"
              user={{
                avatar: '',
                name: user.displayUsername || 'Delivery Boy',
                username: user.username || '--',
              }}
            >
              <Avatar>
                <AvatarImage
                  alt={user.username || user.name}
                  src="/placeholder.svg?height=40&width=40"
                />
                <AvatarFallback className="uppercase">
                  {user.username?.[0] || user.name[0]}
                </AvatarFallback>
              </Avatar>
            </NavUser>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
