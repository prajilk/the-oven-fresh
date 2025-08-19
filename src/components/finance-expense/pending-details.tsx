'use client';

import { usePendingDetails } from '@/api-hooks/admin/get-pending-details';
import PendingPaymentsTable from '../data-table/pending-payments-table';

const PendingDetails = () => {
  const { data: pendingDetails, isPending } = usePendingDetails();
  return (
    <div className="mt-7 space-y-6 rounded-lg border bg-white p-6 shadow-md">
      <div className="space-y-2">
        <h1 className="font-semibold text-lg leading-none tracking-tight">
          Pending Payments Details
        </h1>
        <p className="text-muted-foreground text-sm">
          All pending payments by store and service
        </p>
      </div>
      <PendingPaymentsTable data={pendingDetails || []} isPending={isPending} />
    </div>
  );
};

export default PendingDetails;
