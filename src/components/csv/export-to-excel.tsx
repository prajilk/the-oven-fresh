'use client';

import { Button } from '@heroui/button';
import { Workbook } from 'exceljs';
import { Table } from 'lucide-react';
import { toast } from 'sonner';

type MyComponentProps<T extends Record<string, string | number | string[]>> = {
  filename: string;
  data: T[];
};

const ExportToExcel = <T extends Record<string, string | number | string[]>>({
  filename,
  data,
}: MyComponentProps<T>) => {
  // Function to export data to Excel
  const exportToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Check if data is not empty
    if (data.length > 0) {
      // Dynamically generate columns based on the keys of the first object in the data array
      const columns = Object.keys(data[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1), // Use the key as the header
        key, // The key will also be used to map the data
        width: 20, // Column width (can be adjusted)
      }));

      // Define columns for the worksheet
      worksheet.columns = columns;

      // Make header bold
      worksheet.getRow(1).font = { bold: true };

      // Add rows to the worksheet
      worksheet.addRows(data);

      // Write the workbook to a buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Trigger file download
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } else {
      toast.error('No data available to export.');
    }
  };

  return (
    <Button
      className="min-w-fit bg-white shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:bg-gray-100"
      onPress={exportToExcel}
      radius="sm"
      size="sm"
      startContent={<Table className="size-4" />}
      variant="solid"
    >
      <span className="hidden sm:inline">Export to Excel</span>
    </Button>
  );
};

export default ExportToExcel;
