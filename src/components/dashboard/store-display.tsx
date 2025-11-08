import { MapPin } from 'lucide-react';
import connectDB from '@/config/mongoose';
import { getCurrentUser } from '@/lib/auth';
import Store from '@/models/storeModel';
import { NavUser } from '../nav/user';
import StoreSelect from '../select/store-select';
import { Show } from '../show';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const StoreDisplay = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  await connectDB();
  const allStores = await Store.find();
  const store = allStores.find((store) => store.id === user.storeId.toString());

  return (
    <>
      <div className="flex items-center gap-2">
        <Show>
          <Show.When isTrue={user.role !== 'admin'}>
            <Badge
              className="h-8 gap-1.5 rounded-lg px-3 font-light text-primary-foreground text-sm"
              variant="outline"
            >
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{store.location}</span>
            </Badge>
          </Show.When>
          <Show.When isTrue={user.role === 'admin'}>
            <StoreSelect
              stores={allStores.map((store) => ({
                id: store._id.toString(),
                location: store.location,
              }))}
            />
          </Show.When>
        </Show>
      </div>
      <NavUser
        triggerClassname="flex flex-row text-primary gap-2 bg-primary-foreground rounded-xl p-1 pe-3"
        user={{
          avatar: '',
          name: user.displayUsername || '--',
          username: user.username || '--',
        }}
      >
        <Avatar className="h-8 w-8 rounded-xl text-primary">
          <AvatarImage alt={user.username || user.name} src={''} />
          <AvatarFallback className="rounded-xl bg-primary text-primary-foreground uppercase">
            {user.username?.[0] || user.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-xs capitalize">
            Welcome {user.role}
          </span>
          <span className="truncate font-semibold capitalize">
            {user.displayUsername}
          </span>
        </div>
      </NavUser>
    </>
  );
};

export default StoreDisplay;
