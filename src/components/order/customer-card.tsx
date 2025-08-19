import { Phone, UserRound } from 'lucide-react';
import EditCustomerDialog from '../dialog/edit-customer-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CustomerCard = ({
  orderId,
  customerName,
  customerPhone,
  orderType,
  note,
}: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderType: 'catering' | 'tiffin';
  note: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Customer Details
        </CardTitle>
        <EditCustomerDialog
          nameAtOrder={customerName}
          note={note}
          orderId={orderId}
          orderType={orderType}
          phoneAtOrder={customerPhone.replace(/\s/g, '')}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="font-semibold">{customerName}</div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            {customerPhone}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Note:</span>
            <p>{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
