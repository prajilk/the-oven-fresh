import { FormControl } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type OrderTypeSelectProps = {
  value: string;
  onValueChange: (value: 'pickup' | 'delivery') => void;
};

const OrderTypeSelect = ({ value, onValueChange }: OrderTypeSelectProps) => {
  return (
    <Select
      defaultValue="pickup" // Watch the selected value
      onValueChange={onValueChange} // Call the onValueChange function when the value changes
      value={value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="order type" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="pickup">Pickup</SelectItem>
        <SelectItem value="delivery">Delivery</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OrderTypeSelect;
