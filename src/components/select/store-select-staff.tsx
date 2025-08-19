import type { StoreDocument } from '@/models/types/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const StoreSelectStaff = ({
  stores,
  value,
  setValue,
}: {
  stores: StoreDocument[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Select name="store" onValueChange={setValue} value={value}>
      <SelectTrigger className="col-span-3 text-primary">
        <SelectValue placeholder="Store" />
      </SelectTrigger>
      <SelectContent className="z-[1560]">
        {stores?.map((store) => (
          <SelectItem key={store._id} value={store._id}>
            {store.location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StoreSelectStaff;
