import { format } from 'date-fns';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TiffinDocumentPopulate } from '@/models/types/tiffin';

// This would be replaced with your actual logo URL
const COMPANY_LOGO = '/logo.webp';

export default function OrderConfirmation({
  order,
}: {
  order: TiffinDocumentPopulate;
}) {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-8 flex flex-col items-center justify-center md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Image
            alt="Company Logo"
            className="rounded-full"
            height={64}
            src={COMPANY_LOGO}
            width={64}
          />
          <h1 className="font-bold text-2xl">The Oven Fresh</h1>
        </div>
        <div className="text-center md:text-right">
          <p className="font-semibold">Order ID: {order.orderId}</p>
          <p className="text-muted-foreground text-sm">
            Store: {order.store.name}
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customerName}</p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {order.customerPhone}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4" />
              {order.address.address}
            </p>
            <p className="mt-2 text-muted-foreground text-sm">
              Lat: {order.address.lat}, Lng: {order.address.lng}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              Order Type:{' '}
              <span className="font-semibold capitalize">
                {order.order_type}
              </span>
            </div>
            <div>
              Number of weeks:{' '}
              <span className="font-semibold capitalize">
                {order.numberOfWeeks}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>${(order.totalPrice - order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-green-600">
              <span>Advance Paid:</span>
              <span>${order.advancePaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 font-semibold text-red-600">
              <span>Pending Balance:</span>
              <span>${order.pendingBalance.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between py-1">
              <span>Payment Method:</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <span className="font-semibold">Start Date:</span>{' '}
              {format(new Date(order.startDate), 'MMMM d, yyyy')}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{' '}
              {format(new Date(order.endDate), 'MMMM d, yyyy')}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Note:</span>
            </p>
            <p className="mt-1 text-muted-foreground">{order.note}</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-muted-foreground text-sm">
        <p>Thank you for your order!</p>
        <p>{order.store.name}</p>
        <p>{order.store.phone}</p>
        <p>{order.store.address}</p>
      </div>
    </div>
  );
}
