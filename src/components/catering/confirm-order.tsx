import { format } from 'date-fns';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CateringDocumentPopulate } from '@/models/types/catering';

// This would be replaced with your actual logo URL
const COMPANY_LOGO = '/logo.webp';

export default function OrderConfirmation({
  order,
}: {
  order: CateringDocumentPopulate;
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.itemId._id}>
                  <TableCell className="pr-10">
                    <div className="flex items-center gap-3">
                      <Image
                        alt={item.itemId.name}
                        className="rounded-md"
                        height={40}
                        src={item.itemId.image || '/placeholder.svg'}
                        width={40}
                      />
                      <span className="whitespace-nowrap">
                        {item.itemId.name}{' '}
                        {item.itemId.variant ? `(${item.itemId.variant})` : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] capitalize">
                    {item.size}{' '}
                    {item.itemId[
                      `${item.size}ServingSize` as 'smallServingSize'
                    ]
                      ? `(${
                          item.itemId[
                            `${item.size}ServingSize` as 'smallServingSize'
                          ]
                        })`
                      : ''}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${item.priceAtOrder.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(item.quantity * item.priceAtOrder).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              <span className="font-semibold">Delivery Date:</span>{' '}
              {format(new Date(order.deliveryDate), 'MMMM d, yyyy')}
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
