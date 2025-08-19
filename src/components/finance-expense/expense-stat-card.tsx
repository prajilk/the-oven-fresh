import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpenseStatCard = ({
  title,
  total,
  items,
}: {
  title: string;
  total: number;
  items: number;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-bold text-2xl">${total || 0}</div>
        <p className="mt-1 text-muted-foreground text-xs">
          {items} items purchased
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseStatCard;
