'use client';

import { useDispatch, useSelector } from 'react-redux';
import getQueryClient from '@/lib/query-utils/get-query-client';
import { getYearsUpToCurrent } from '@/lib/utils';
import type { RootState } from '@/store';
import { setYear } from '@/store/slices/select-year-slice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const YearSelect = () => {
  const yearFilter = useSelector((state: RootState) => state.selectYear);
  const dispatch = useDispatch();
  const queryClient = getQueryClient();

  async function onValueChange(year: string) {
    dispatch(setYear(year));
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['revenue'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['profit-details'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['expense'],
      }),
    ]);
  }

  return (
    <Select onValueChange={onValueChange} value={yearFilter}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Year Filter" />
      </SelectTrigger>
      <SelectContent>
        {getYearsUpToCurrent().map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelect;
