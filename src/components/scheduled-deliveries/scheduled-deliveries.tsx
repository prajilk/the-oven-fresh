'use client';

import { Divider, Typography } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useScheduledDeliveries } from '@/api-hooks/scheduled/get-deliveries';
import type { UserDocument } from '@/models/types/user';
import type { RootState } from '@/store';
import DeliveryBoySelect from '../select/delivery-boy-select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import OrderCard from './order-card';

const ScheduledDeliveries = ({
  staffs,
}: {
  staffs: Pick<UserDocument, '_id' | 'username' | 'zone'>[];
}) => {
  const store = useSelector((state: RootState) => state.selectStore);
  const { data, isPending } = useScheduledDeliveries(store);

  if (isPending) {
    return (
      <div className="flex h-32 flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Typography component="h2" sx={{ mb: 2 }} variant="h6">
        Scheduled Deliveries for Today
      </Typography>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="text-lg">Trip 1</CardTitle>
            </div>
            <DeliveryBoySelect
              defaultValue={staffs.find((staff) => staff.zone === 1)?._id}
              staffs={staffs}
              zone={1}
            />
          </CardHeader>
          <div className="px-4 pb-4">
            <Divider />
          </div>
          <CardContent className="px-4 pb-4">
            <div className="mb-3 flex flex-col">
              <h1 className="font-medium text-lg">Tiffins</h1>
              <span className="text-xs">
                Total Deliveries: {data?.tiffins.zone1.length}
              </span>
            </div>
            {data?.tiffins.zone1.map((order) => (
              <OrderCard
                address={order.address.address}
                key={order._id}
                mid={order._id}
                orderId={order.orderId}
                orderType="tiffin"
                status={order.status}
              />
            ))}
            <div className="my-5" />
            <div className="mb-3 flex flex-col">
              <h1 className="font-medium text-lg">Caterings</h1>
              <span className="text-xs">
                Total Deliveries: {data?.caterings.zone1.length}
              </span>
            </div>
            {data?.caterings.zone1.map((order) => (
              <OrderCard
                address={order.address.address}
                key={order._id}
                mid={order._id}
                orderId={order.orderId}
                orderType="catering"
                status={order.status}
              />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="text-lg">Trip 2</CardTitle>
            </div>
            <DeliveryBoySelect
              defaultValue={staffs.find((staff) => staff.zone === 2)?._id}
              staffs={staffs}
              zone={2}
            />
          </CardHeader>
          <div className="px-4 pb-4">
            <Divider />
          </div>
          <CardContent className="px-4 pb-4">
            <div className="mb-3 flex flex-col">
              <h1 className="font-medium text-lg">Tiffins</h1>
              <span className="text-xs">
                Total Deliveries: {data?.tiffins.zone2.length}
              </span>
            </div>
            {data?.tiffins.zone2.map((order) => (
              <OrderCard
                address={order.address.address}
                key={order._id}
                mid={order._id}
                orderId={order.orderId}
                orderType="tiffin"
                status={order.status}
              />
            ))}
            <div className="my-5" />
            <div className="mb-3 flex flex-col">
              <h1 className="font-medium text-lg">Caterings</h1>
              <span className="text-xs">
                Total Deliveries: {data?.caterings.zone2.length}
              </span>
            </div>
            {data?.caterings.zone2.map((order) => (
              <OrderCard
                address={order.address.address}
                key={order._id}
                mid={order._id}
                orderId={order.orderId}
                orderType="catering"
                status={order.status}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ScheduledDeliveries;
