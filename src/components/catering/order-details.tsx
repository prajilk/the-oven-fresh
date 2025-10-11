'use client';

import { Button } from '@heroui/button';
import { format } from 'date-fns';
import {
  BadgeCheck,
  Clock,
  ImageIcon,
  Minus,
  Package2,
  Pencil,
  Plus,
  Trash2,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { sentOrderToWhatsappAction } from '@/actions/sent-order-to-whatsapp-action';
import { updateOrderItemsAction } from '@/actions/update-order-items-action';
import { updateOrderStatusAction } from '@/actions/update-order-status-action';
import { Badge } from '@/components/ui/badge';
import { Button as ShadButton } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/types/order-status';
import { appendBracket, cn } from '@/lib/utils';
import type {
  CateringDocument,
  CateringDocumentPopulate,
} from '@/models/types/catering';
import AddCustomItemDirectDialog from '../dialog/add-custom-item-direct';
import OrderSettlementDialog from '../dialog/order-settlement-dialog';
import { AddItemDrawer } from '../drawer/catering/add-item-drawer';
import Whatsapp from '../icons/whatsapp';
import AddressCard from '../order/address-card';
import CustomerCard from '../order/customer-card';
import PaymentCard from '../order/payment-card';
import StoreCard from '../order/store-card';
import SizeSelect from '../select/size-select';
import { Show } from '../show';
import { Input } from '../ui/input';
import LoadingButton from '../ui/loading-button';

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

export default function CateringOrderDetails({
  orderData,
}: {
  orderData: CateringDocumentPopulate;
}) {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(orderData?.status);
  const [editItems, setEditItems] = useState(false);
  const [editCustomItems, setEditCustomItems] = useState(false);
  const [orderItems, setOrderItems] = useState(orderData?.items);
  const [customItems, setCustomItems] = useState(orderData?.customItems);
  const [showSettlementDialog, setShowSettlementDialog] = useState(false);

  const updateOrderStatus = (newStatus: OrderStatus, settlement = false) => {
    const promise = async () => {
      const result = await updateOrderStatusAction(
        orderData._id.toString(),
        newStatus as OrderStatus,
        'catering',
        settlement
      );
      if (result.success) {
        return result;
      }
      throw result;
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

  const handleStatusUpdate = (newStatus: string) => {
    setLoading(true);
    setOrderStatus(newStatus as OrderStatus);

    if (newStatus === 'DELIVERED') {
      setShowSettlementDialog(true);
      return;
    }

    updateOrderStatus(newStatus as OrderStatus);
  };

  function decreaseQuantity(itemId: string, size: string) {
    setOrderItems((prev) =>
      prev.map((i) =>
        i.itemId._id === itemId && i.size === size
          ? {
              ...i,
              quantity: i.quantity - 1 <= 1 ? 1 : i.quantity - 1,
            }
          : i
      )
    );
  }

  function increaseQuantity(itemId: string, size: string) {
    setOrderItems((prev) =>
      prev.map((i) =>
        i.itemId._id === itemId && i.size === size
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      )
    );
  }

  function cancelEdit() {
    setEditItems(false);
    setOrderItems(orderData?.items);
  }

  function cancelCustomEdit() {
    setEditCustomItems(false);
    setCustomItems(orderData?.customItems);
  }

  function removeItem(itemId: string, size: string) {
    setOrderItems((prev) =>
      prev.filter((i) => !(i.itemId._id === itemId && i.size === size))
    );
  }

  function removeCustomItem(name: string) {
    setCustomItems((prev) => prev.filter((i) => !(i.name === name)));
  }

  function saveOrderItems(itemType: 'items' | 'customItems') {
    let updatedItem:
      | CateringDocument['items']
      | CateringDocument['customItems'];
    if (itemType === 'items') {
      setEditItems(false);
      updatedItem = orderItems.map((item) => ({
        itemId: item.itemId._id,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        size: item.size,
      }));
    } else {
      setEditCustomItems(false);
      updatedItem = customItems.map((item) => ({
        name: item.name,
        size: item.size,
        priceAtOrder: item.priceAtOrder,
      }));
    }

    const subtotal =
      orderItems.reduce(
        (acc, item) => acc + item.priceAtOrder * item.quantity,
        0
      ) + customItems.reduce((acc, item) => acc + item.priceAtOrder, 0);

    const promise = async () => {
      const result = await updateOrderItemsAction(
        orderData._id.toString(),
        itemType,
        updatedItem,
        orderData.advancePaid,
        orderData.tax,
        orderData.deliveryCharge,
        subtotal,
        orderData.discount
      );
      if (result.success) {
        return result;
      }
      throw result;
    };

    toast.promise(promise(), {
      loading: 'Updating order items...',
      success: () => {
        setLoading(false);
        return 'Order items updated successfully.';
      },
      error: () => {
        setLoading(false);
        return 'Failed to update order items.';
      },
    });
  }

  function handleCustomItemUpdate(
    check: string,
    key: string,
    value: string | number
  ) {
    setCustomItems((prev) =>
      prev.map((i) => {
        // @ts-expect-error: item._id is a string
        return i._id === check ? { ...i, [key]: value } : i;
      })
    );
  }

  const handleSentToWhatsapp = useCallback(async () => {
    try {
      setLoading(true);
      await sentOrderToWhatsappAction(orderData._id.toString(), 'catering');
      toast.success('Order sent to Whatsapp.');
    } catch {
      toast.error('Failed to send order to Whatsapp.');
    } finally {
      setLoading(false);
    }
  }, [orderData?._id]);

  const existingItems = useMemo(() => {
    return orderItems.map((item) => item.itemId._id as string);
  }, [orderItems]);

  useEffect(() => {
    setOrderItems(orderData?.items);
  }, [orderData]);
  // }, [orderData, orderData?.status]);

  useEffect(() => {
    setLoading(false);
    setOrderStatus(orderData?.status);
  }, [orderData?.status]);
  // }, [showSettlementDialog, orderData?.status]);

  useEffect(() => {
    if (customItems.length === 0) {
      setEditCustomItems(false);
    }
  }, [customItems]);

  return (
    <div className="px-2.5 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Order {orderData.orderId}</h1>
          <div className="text-muted-foreground text-sm">
            Created on {format(orderData?.createdAt, "MMM d, yyyy 'at' h:mm a")}{' '}
            <Badge>Catering</Badge>
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
          orderType="catering"
        />

        <AddressCard
          address={orderData.address}
          customerId={orderData.customer._id.toString()}
          deliveryDate={orderData.deliveryDate}
          order_type={orderData.order_type}
          orderId={orderData._id.toString()}
          orderType="catering"
        />

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Order Items
            </CardTitle>
            <div className="flex items-center gap-3">
              <AddItemDrawer
                existingItems={existingItems}
                orderId={orderData._id.toString()}
              />
              <Button
                isIconOnly
                onPress={() => setEditItems(true)}
                radius="full"
                size="sm"
                variant="flat"
              >
                <Pencil size={15} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="scrollbar-thin overflow-x-scroll">
            <Table className="min-w-[550px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">Size</TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Price at Order
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Current Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.itemId._id + item.size}>
                    <TableCell className="min-w-64 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Image
                          alt={item.itemId.name}
                          className="rounded-lg"
                          height={48}
                          src={item.itemId?.image || '/placeholder.svg'}
                          width={48}
                        />
                        <div className="font-medium">
                          {appendBracket(item.itemId.name, item.itemId.variant)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className={cn(
                            'size-7 items-center justify-center rounded-md border',
                            editItems ? 'flex' : 'hidden'
                          )}
                          disabled={!editItems}
                          onClick={() =>
                            decreaseQuantity(item.itemId._id, item.size)
                          }
                          type="button"
                        >
                          <Minus className="size-3" />
                        </button>
                        {item?.quantity}
                        <button
                          className={cn(
                            'size-7 items-center justify-center rounded-md border',
                            editItems ? 'flex' : 'hidden'
                          )}
                          disabled={!editItems}
                          onClick={() =>
                            increaseQuantity(item.itemId._id, item.size)
                          }
                          type="button"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right capitalize">
                      <Show>
                        <Show.When isTrue={editItems}>
                          <SizeSelect
                            defaultSize={item.size}
                            itemId={item.itemId._id}
                            menu={item.itemId}
                            setOrderItems={setOrderItems}
                          />
                        </Show.When>
                        <Show.Else>
                          {appendBracket(
                            item?.size,
                            item.itemId[`${item?.size as 'small'}ServingSize`]
                          )}
                        </Show.Else>
                      </Show>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item?.priceAtOrder.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.itemId[`${item?.size}Price` as 'smallPrice']}
                      {item.itemId[`${item?.size}Price` as 'smallPrice'] !==
                        item?.priceAtOrder && (
                        <Badge className="ml-2" variant="outline">
                          {item.itemId[`${item?.size}Price` as 'smallPrice'] ||
                          item?.priceAtOrder < 0
                            ? 'Increased'
                            : 'Decreased'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ShadButton
                        disabled={!editItems}
                        onClick={() => removeItem(item.itemId._id, item.size)}
                        size="icon"
                        variant="ghost"
                      >
                        <Trash2 size={16} />
                      </ShadButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex items-center justify-end gap-2">
              <ShadButton
                disabled={!editItems}
                onClick={cancelEdit}
                size={'sm'}
                variant={'ghost'}
              >
                Cancel
              </ShadButton>
              <ShadButton
                disabled={!editItems || loading}
                onClick={() => saveOrderItems('items')}
                size={'sm'}
              >
                Save
              </ShadButton>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Custom Order Items
            </CardTitle>
            <div className="flex items-center gap-3">
              <AddCustomItemDirectDialog
                enableSaveButton={setEditCustomItems}
                setCustomItems={setCustomItems}
              >
                <Button isIconOnly radius="full" size="sm" variant="flat">
                  <Plus size={15} />
                </Button>
              </AddCustomItemDirectDialog>
              <Button
                isIconOnly
                onPress={() => setEditCustomItems(true)}
                radius="full"
                size="sm"
                variant="flat"
              >
                <Pencil size={15} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="scrollbar-thin overflow-x-scroll">
            <Show>
              <Show.When isTrue={customItems?.length === 0}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <span>No custom items added yet.</span>
                  <AddCustomItemDirectDialog
                    enableSaveButton={setEditCustomItems}
                    setCustomItems={setCustomItems}
                  >
                    <ShadButton className="flex items-center gap-2" size={'sm'}>
                      <Plus />
                      Add custom items
                    </ShadButton>
                  </AddCustomItemDirectDialog>
                </div>
              </Show.When>
              <Show.Else>
                <Table className="min-w-[550px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Size</TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Price at Order
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customItems?.map((item) => (
                      // @ts-expect-error: item._id is a string
                      <TableRow key={item._id}>
                        <TableCell className="min-w-64 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
                              <ImageIcon size={15} />
                            </div>
                            <Show>
                              <Show.When isTrue={editCustomItems}>
                                <Input
                                  className="w-36"
                                  onChange={(e) => {
                                    handleCustomItemUpdate(
                                      // @ts-expect-error: item._id is a string
                                      item._id,
                                      'name',
                                      e.target.value
                                    );
                                  }}
                                  placeholder="Item name"
                                  value={item.name}
                                />
                              </Show.When>
                              <Show.Else>
                                <div className="font-medium">{item.name}</div>
                              </Show.Else>
                            </Show>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right capitalize">
                          <Show>
                            <Show.When isTrue={editCustomItems}>
                              <Input
                                className="ms-auto w-20"
                                onChange={(e) => {
                                  handleCustomItemUpdate(
                                    // @ts-expect-error: item._id is a string
                                    item._id,
                                    'size',
                                    e.target.value
                                  );
                                }}
                                placeholder="Size"
                                value={item.size}
                              />
                            </Show.When>
                            <Show.Else>{item?.size}</Show.Else>
                          </Show>
                        </TableCell>
                        <TableCell className="text-right">
                          <Show>
                            <Show.When isTrue={editCustomItems}>
                              <Input
                                className="ms-auto w-16"
                                min="0"
                                onChange={(e) => {
                                  handleCustomItemUpdate(
                                    // @ts-expect-error: item._id is a string
                                    item._id,
                                    'priceAtOrder',
                                    Number(e.target.value)
                                  );
                                }}
                                placeholder="Price"
                                step="0.01"
                                type="number"
                                value={item.priceAtOrder}
                              />
                            </Show.When>
                            <Show.Else>
                              ${item?.priceAtOrder.toFixed(2)}
                            </Show.Else>
                          </Show>
                        </TableCell>
                        <TableCell className="text-right">
                          <ShadButton
                            disabled={!editCustomItems}
                            onClick={() => removeCustomItem(item.name)}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 size={16} />
                          </ShadButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Show.Else>
            </Show>
            <div className="mt-3 flex items-center justify-end gap-2">
              <ShadButton
                disabled={!editCustomItems}
                onClick={cancelCustomEdit}
                size={'sm'}
                variant={'ghost'}
              >
                Cancel
              </ShadButton>
              <ShadButton
                disabled={!editCustomItems || loading}
                onClick={() => saveOrderItems('customItems')}
                size={'sm'}
              >
                Save
              </ShadButton>
            </div>
          </CardContent>
        </Card>

        <StoreCard store={orderData.store} />

        <PaymentCard
          advancePaid={orderData.advancePaid}
          deliveryCharge={orderData.deliveryCharge}
          discount={orderData.discount || 0}
          fullyPaid={orderData.fullyPaid}
          orderId={orderData._id.toString()}
          orderType="catering"
          paymentMethod={orderData.paymentMethod}
          pendingBalance={orderData.pendingBalance}
          tax={orderData.tax}
          totalPrice={orderData.totalPrice}
        />
      </div>
      <OrderSettlementDialog
        open={showSettlementDialog}
        setOpen={setShowSettlementDialog}
        updateOrderStatus={updateOrderStatus}
      />
    </div>
  );
}
