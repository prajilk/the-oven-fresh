import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const RoleSelect = ({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Select name="role" onValueChange={setValue} value={value}>
      <SelectTrigger className="col-span-3 text-primary">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent className="z-[1560]">
        <SelectItem value="manager">MANAGER</SelectItem>
        <SelectItem value="delivery">DELIVERY</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
