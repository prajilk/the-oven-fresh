import { Button } from '@heroui/button';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const DateFilter = ({
  date,
  onSelect,
  footer,
}: {
  date: Date;
  onSelect: (date: Date) => void;
  footer?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-9 rounded-md border border-dashed bg-white shadow-sm"
          size="sm"
          startContent={<Filter className="h-4 w-4" />}
          variant="bordered"
        >
          Filter by date
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          defaultMonth={date}
          footer={
            <span className="text-muted-foreground text-xs">
              {`${footer} ${format(date || new Date(), 'yyyy-MM-dd')}`}
            </span>
          }
          initialFocus
          mode="single"
          onSelect={(date) => onSelect(date as Date)}
          required
          selected={date || new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
