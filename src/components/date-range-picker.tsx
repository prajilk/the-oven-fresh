'use client';

import { Button } from '@heroui/button';
import { useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button as ShadButton } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DatePickerWithRange({
  className,
  orderType,
  printType,
  label,
  disabled = false,
}: React.HTMLAttributes<HTMLDivElement> & {
  orderType: 'tiffin' | 'catering';
  printType: 'summary' | 'sticker';
  label: string;
  disabled?: boolean;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const isMobile = useMediaQuery('(max-width:640px)');

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="bg-white shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:bg-gray-100"
            disabled={disabled}
            radius="sm"
            size="sm"
            startContent={<Printer className="size-4" />}
            variant="solid"
          >
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            defaultMonth={date?.from}
            initialFocus
            mode="range"
            numberOfMonths={isMobile ? 1 : 2}
            onSelect={setDate}
            selected={date}
          />
          <div className="flex justify-end gap-3 px-4 py-3 pt-0">
            <ShadButton size="sm" variant={'ghost'}>
              Cancel
            </ShadButton>
            <Link
              href={`/${printType}/${orderType}?from=${format(
                date?.from || new Date(),
                'yyyy-MM-dd'
              )}&to=${format(
                date?.to || date?.from || new Date(),
                'yyyy-MM-dd'
              )}`}
              target="_blank"
            >
              <ShadButton size="sm">Print</ShadButton>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
