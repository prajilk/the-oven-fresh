import { useSelector } from 'react-redux';
import { getMonthsUpToCurrent } from '@/lib/utils';
import type { RootState } from '@/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type MonthSelectProps = {
  monthFilter: string;
  setMonthFilter: React.Dispatch<React.SetStateAction<string>>;
  removeAllMonth?: boolean;
};

const MonthSelect = ({
  monthFilter,
  setMonthFilter,
  removeAllMonth = false,
}: MonthSelectProps) => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  return (
    <Select onValueChange={setMonthFilter} value={monthFilter}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Month Filter" />
      </SelectTrigger>
      <SelectContent>
        {getMonthsUpToCurrent(removeAllMonth, Number(yearFilter)).map(
          (month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.name}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default MonthSelect;
