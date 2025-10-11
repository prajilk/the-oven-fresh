import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const RevenueStatCard = ({
  title,
  data,
}: {
  title: string;
  data?: {
    total: number;
    tiffin: number;
    catering: number;
  } | null;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-bold text-2xl">
          ${Number(data?.total).toFixed(2) || 0}
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs">Tiffin</span>
            <span className="font-semibold text-xs">
              ${Number(data?.tiffin).toFixed(2) || 0}
            </span>
          </div>
          <div className="h-10 w-px bg-muted-foreground/30" />
          <div className="flex flex-col gap-1">
            <span className="text-xs">Catering</span>
            <span className="font-semibold text-xs">
              ${Number(data?.catering).toFixed(2) || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueStatCard;
