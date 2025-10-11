import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import type { CateringDocumentPopulate } from '@/models/types/catering';
import EditAddressDialog from '../dialog/edit-address-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const AddressCard = ({
  address,
  deliveryDate,
  startDate,
  endDate,
  orderId,
  customerId,
  orderType,
  numberOfWeeks,
  order_type,
}: {
  address: CateringDocumentPopulate['address'];
  deliveryDate?: Date;
  startDate?: Date;
  endDate?: Date;
  orderId: string;
  customerId: string;
  orderType: 'catering' | 'tiffin';
  numberOfWeeks?: number;
  order_type?: 'pickup' | 'delivery';
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
        <EditAddressDialog
          address={address}
          customerId={customerId}
          deliveryDate={deliveryDate}
          endDate={endDate}
          numberOfWeeks={numberOfWeeks}
          orderId={orderId}
          orderType={orderType}
          startDate={startDate}
          type={order_type}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div>{address ? address.address : 'No address provided!'}</div>
          <div className="text-muted-foreground text-sm">
            {address?.lat && address?.lng && `Coordinates: ${address?.lat}, ${address?.lng}`}
          </div>
          {orderType === 'catering' && deliveryDate ? (
            <>
              <div className="text-muted-foreground text-sm">
                Delivery Date: {format(deliveryDate, 'MMMM d, yyyy h:mm a')}
              </div>
              <div className="text-muted-foreground text-sm">
                Order Type: <span className="capitalize">{order_type}</span>
              </div>
            </>
          ) : (
            startDate &&
            endDate && (
              <>
                <div>Start Date: {format(startDate, 'MMMM d, yyyy')}</div>
                <div>End Date: {format(endDate, 'MMMM d, yyyy')}</div>
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
