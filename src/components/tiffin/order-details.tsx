'use client';

import { Button as HeroButton } from '@heroui/button';
import { format } from 'date-fns';
import {
  BadgeCheck,
  Clock,
  Package2,
  Pencil,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { sentOrderToWhatsappAction } from '@/actions/sent-order-to-whatsapp-action';
import { updateDayOrderStatusAction } from '@/actions/update-day-order-status-action';
import { updateOrderStatusAction } from '@/actions/update-order-status-action';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type DayStatus,
  ORDER_STATUSES,
  type OrderStatus,
} from '@/lib/types/order-status';
import type { TiffinDocumentPopulate } from '@/models/types/tiffin';
import EditTiffinOrderDialog from '../dialog/edit-tiffin-order-dialog';
import OrderSettlementDialog from '../dialog/order-settlement-dialog';
import Whatsapp from '../icons/whatsapp';
import AddressCard from '../order/address-card';
import CustomerCard from '../order/customer-card';
import PaymentCard from '../order/payment-card';
import StoreCard from '../order/store-card';
import { Button } from '../ui/button';
import LoadingButton from '../ui/loading-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4" />;
    case 'ONGOING':
      return <Truck className="h-4 w-4" />;
    case 'DELIVERED':
      return <BadgeCheck className="h-4 w-4" />;
    case 'CANCELLED':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'ONGOING':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export default function TiffinOrderDetails({
  orderData,
}: {
  orderData: TiffinDocumentPopulate;
}) {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(orderData?.status);
  const [showSettlementDialog, setShowSettlementDialog] = useState(false);
  const [editDayStatus, setEditDayStatus] = useState(false);
  const [dayStatusChange, setDayStatusChange] = useState<DayStatus[]>([]);

  const updateOrderStatus = (newStatus: OrderStatus, settlement = false) => {
    const promise = async () => {
      const result = await updateOrderStatusAction(
        orderData._id.toString(),
        newStatus as OrderStatus,
        'tiffin',
        settlement
      );

      if (result.success) {
        return result; // resolves
      }
      throw result; // rejects
    };

    toast.promise(promise(), {
      loading: 'Updating order status...',
      success: () => {
        setLoading(false);
        setShowSettlementDialog(false);
        return `Order status has been updated to ${newStatus}`;
      },
      error: () => {
        setLoading(false);
        setShowSettlementDialog(false);
        return 'Failed to update order status.';
      },
    });
  };

  const saveDayStatus = () => {
    const promise = async () => {
      const result = await updateDayOrderStatusAction(
        orderData._id.toString(),
        dayStatusChange
      );

      if (result.success) {
        return result; // resolves
      }
      throw result; // rejects
    };

    toast.promise(promise(), {
      loading: 'Updating order status...',
      success: () => {
        setLoading(false);
        setEditDayStatus(false);
        return 'Order status has been updated';
      },
      error: () => {
        setLoading(false);
        setEditDayStatus(false);
        return 'Failed to update order status.';
      },
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    setLoading(true);

    if (newStatus === 'DELIVERED') {
      setShowSettlementDialog(true);
      return;
    }

    updateOrderStatus(newStatus as OrderStatus);
  };

  function handleDayStatusChange(_id: string, status: OrderStatus) {
    setDayStatusChange((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === _id);
      if (existingIndex !== -1) {
        // Update the existing item
        prev[existingIndex].status = status;
        return [...prev];
      }
      // If the item doesn't exist, create a new one with the existing meal values
      return [...prev, { _id, status }];
    });
  }

  const handleSentToWhatsapp = useCallback(async () => {
    try {
      setLoading(true);
      await sentOrderToWhatsappAction(orderData._id.toString(), 'tiffin');
      toast.success('Order sent to Whatsapp.');
    } catch {
      toast.error('Failed to send order to Whatsapp.');
    } finally {
      setLoading(false);
    }
  }, [orderData?._id]);

  useEffect(() => {
    setLoading(false);
    setOrderStatus(orderData?.status);
  }, [orderData?.status]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Order {orderData.orderId}</h1>
          <div className="text-muted-foreground text-sm">
            Created on {format(orderData?.createdAt, "MMM d, yyyy 'at' h:mm a")}{' '}
            <Badge>Tiffin</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LoadingButton
            className="mr-2 flex items-center gap-2 border-green-200 text-green-500 hover:bg-green-100 hover:text-green-500"
            isLoading={loading}
            onClick={handleSentToWhatsapp}
            size={'sm'}
            variant="outline"
          >
            <Whatsapp /> Sent to Whatsapp
          </LoadingButton>
          <Badge
            className={`flex w-fit items-center gap-1 ${getStatusColor(
              orderData?.status
            )}`}
          >
            {getStatusIcon(orderData?.status)}
            {orderData?.status}
          </Badge>
          <Select onValueChange={handleStatusUpdate} value={orderStatus}>
            <SelectTrigger className="h-8 w-[180px] text-xs" disabled={loading}>
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 gap-y-6 md:grid-cols-2">
        <CustomerCard
          customerName={orderData.customerName}
          customerPhone={orderData.customerPhone}
          note={orderData.note}
          orderId={orderData._id.toString()}
          orderType="tiffin"
        />

        <AddressCard
          address={orderData.address}
          customerId={orderData.customer._id.toString()}
          endDate={orderData.endDate}
          numberOfWeeks={orderData.numberOfWeeks}
          orderId={orderData._id.toString()}
          orderType="tiffin"
          startDate={orderData.startDate}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Order Details
              </CardTitle>
              <div className="flex items-center gap-3">
                <EditTiffinOrderDialog
                  advancePaid={orderData.advancePaid}
                  numberOfWeeks={orderData.numberOfWeeks}
                  orderId={orderData._id.toString()}
                  startDate={orderData.startDate}
                  tax={orderData.tax}
                  type={orderData.order_type}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  Order Type:{' '}
                  <span className="font-semibold capitalize">
                    {orderData.order_type}
                  </span>
                </div>
                <div>
                  Number of weeks:{' '}
                  <span className="font-semibold capitalize">
                    {orderData.numberOfWeeks}
                  </span>
                </div>
                <div>
                  Order extended:{' '}
                  <span className="font-semibold capitalize">
                    {orderData.extended ? 'Yes' : 'No'}
                  </span>
                </div>
                {orderData.extendedFrom.length > 0 && (
                  <div>
                    Order extended from:{' '}
                    <span className="font-semibold capitalize">
                      {orderData.extendedFrom.map((item) => (
                        <b key={item}>
                          {item}
                          {', '}
                        </b>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <StoreCard store={orderData.store} />
        </div>

        <PaymentCard
          advancePaid={orderData.advancePaid}
          deliveryCharge={0}
          discount={orderData.discount}
          fullyPaid={orderData.fullyPaid}
          orderId={orderData._id.toString()}
          orderType="tiffin"
          paymentMethod={orderData.paymentMethod}
          pendingBalance={orderData.pendingBalance}
          tax={orderData.tax}
          totalPrice={orderData.totalPrice}
        />

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Order Summary
            </CardTitle>
            <div className="flex items-center gap-3">
              <HeroButton
                isIconOnly
                onPress={() => setEditDayStatus((prev) => !prev)}
                radius="full"
                size="sm"
                variant="flat"
              >
                {editDayStatus ? <X size={15} /> : <Pencil size={15} />}
              </HeroButton>
            </div>
          </CardHeader>
          <CardContent className="scrollbar-thin overflow-x-scroll">
            <Table className="min-w-[550px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Update status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData?.individualStatus.map((status) => (
                  <TableRow key={status._id}>
                    <TableCell>
                      {format(new Date(status.date), 'EEEE, MMMM do, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`gap-1 ${getStatusColor(status.status)}`}
                      >
                        {getStatusIcon(status.status)}
                        {status.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[150px] text-right">
                      <Select
                        defaultValue={status.status}
                        disabled={!editDayStatus}
                        onValueChange={(value: OrderStatus) =>
                          handleDayStatusChange(status._id, value)
                        }
                      >
                        <SelectTrigger
                          className="ms-auto w-[150px]"
                          id="status"
                        >
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="ONGOING">ONGOING</SelectItem>
                          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                disabled={!editDayStatus}
                onClick={() => setEditDayStatus(false)}
                size={'sm'}
                variant={'ghost'}
              >
                Cancel
              </Button>
              <Button
                disabled={!editDayStatus || loading}
                onClick={saveDayStatus}
                size={'sm'}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <OrderSettlementDialog
        open={showSettlementDialog}
        setOpen={setShowSettlementDialog}
        updateOrderStatus={updateOrderStatus}
      />
    </div>
  );
}
