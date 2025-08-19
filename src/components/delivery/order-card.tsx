import { Chip } from '@heroui/chip';
import { format } from 'date-fns';
import { BadgeCheck, Camera, Check, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from 'react';
import type {
  ScheduledCateringDelivery,
  ScheduledTiffinDelivery,
} from '@/lib/types/scheduled-order';
import { ConfirmDeliveryDrawer } from '../drawer/delivery/confirm-delivery-drawer';
import OrderItemsDrawer from '../drawer/delivery/order-items-drawer';
import { Show } from '../show';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';
import Upload from '../upload/upload';

const OrderCard = ({
  order,
  orderType,
}: {
  order:
    | ScheduledTiffinDelivery['orders'][0]
    | ScheduledCateringDelivery['orders'][0];
  orderType: 'tiffins' | 'caterings';
}) => {
  const [resource, setResource] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >();

  return (
    <Card className="mx-auto w-full max-w-md" key={order._id}>
      <CardHeader className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">{order.orderId}</p>
          <Badge
            className="ml-auto"
            variant={order.status === 'DELIVERED' ? 'outline' : 'secondary'}
          >
            {order.status === 'DELIVERED' ? 'Delivered' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-3 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{order.customerName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted-foreground text-sm">
              {format(new Date(order.date), 'PPP')}
            </p>
          </div>
          <Show>
            <Show.When isTrue={orderType === 'caterings'}>
              <OrderItemsDrawer
                customItems={
                  (order as unknown as ScheduledCateringDelivery['orders'][0])
                    .customItems || []
                }
                items={
                  (order as unknown as ScheduledCateringDelivery['orders'][0])
                    .items || []
                }
                orderId={order.orderId}
              />
            </Show.When>
          </Show>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm">{order.address.address}</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Payment Status</p>
            <p className="font-medium">
              {order.fullyPaid ? 'Paid' : `Collect $${order.pendingBalance}`}
            </p>
          </div>
          <Show>
            <Show.When
              isTrue={order.status !== 'DELIVERED' && orderType === 'tiffins'}
            >
              <div className="flex gap-2">
                <Button
                  className={`rounded-full ${
                    resource !== undefined
                      ? 'border-green-200 bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600'
                      : ''
                  }`}
                  size="icon"
                  variant="outline"
                >
                  {resource !== undefined ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Upload
                      extraOptions={{
                        cropping: true,
                        multiple: false,
                        showSkipCropButton: false,
                        croppingAspectRatio: 1.5,
                      }}
                      folder={`${orderType}/${order.orderId}`}
                      setResource={setResource}
                      sources={['camera']}
                    >
                      <Camera className="h-4 w-4" />
                    </Upload>
                  )}
                </Button>
              </div>
            </Show.When>
          </Show>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 px-3 pt-0">
        <Show>
          <Show.When isTrue={order.status === 'DELIVERED'}>
            <Chip
              className="max-w-full flex-1"
              classNames={{
                content: 'flex items-center gap-1',
              }}
              color="success"
              size="lg"
              variant="light"
            >
              <BadgeCheck className="mr-1 h-4 w-4" />
              Delivered
            </Chip>
          </Show.When>
          <Show.Else>
            <ConfirmDeliveryDrawer
              disabled={orderType === 'tiffins' ? !resource : false}
              orderId={order._id}
              orderType={orderType}
              pendingBalance={order.pendingBalance}
              resource={resource}
              statusId={
                (order as unknown as ScheduledTiffinDelivery['orders'][0])
                  .statusId
              }
            />
          </Show.Else>
        </Show>
        <Button asChild size="icon" variant="outline">
          <Link href={`tel:${order.customerPhone}`} target="_blank">
            <Phone className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="icon" variant="outline">
          <Link
            href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`}
            target="_blank"
          >
            <MapPin className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
