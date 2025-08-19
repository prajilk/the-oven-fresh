import type React from 'react';
import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { calculateEndDate } from '@/lib/utils';
import type { ZodTiffinSchema } from '@/lib/zod-schema/schema';
import { FormControl } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const TiffinWeeksSelect = ({
  form,
  setEndDateText,
}: {
  form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
  setEndDateText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // Watch the form state to reset the Select component
  useEffect(() => {
    if (!form.formState.isDirty) {
      form.setValue('number_of_weeks', '2');
    }
  }, [form, form.formState.isDirty, form.setValue]);

  return (
    <Select
      onValueChange={(val) => {
        form.setValue('number_of_weeks', val);
        calculateEndDate(
          form.getValues('number_of_weeks'),
          form,
          setEndDateText
        );
      }} // Watch the selected value
      value={form.watch('number_of_weeks')}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="No. Of weeks" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="2">2 weeks</SelectItem>
        <SelectItem value="3">3 weeks</SelectItem>
        <SelectItem value="4">4 weeks</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TiffinWeeksSelect;
