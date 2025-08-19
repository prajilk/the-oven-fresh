import mongoose, { type Model } from 'mongoose';

// Define OrderDocument type for Mongoose documents
interface OrderDocument extends Document {
  createdAt: Date;
}

// Define return type
type OrderStats = {
  totalLast30Days: number;
  totalPrev30Days: number;
  percentageChange: string;
  trend: 'up' | 'down' | 'neutral';
  last30DaysCounts: number[];
};

// Function to generate the last 30 days as strings
const generateLastNDays = (days: number): string[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
  }).reverse();
};

const last30Days: string[] = generateLastNDays(30);
const prev30Days: string[] = generateLastNDays(30).map((date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
});

// Function to fetch order statistics
const fetchOrderStats = async (
  Model: Model<OrderDocument>,
  storeId: string
): Promise<OrderStats> => {
  const sixtyDaysAgo: Date = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const orderSummary = await Model.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId.createFromHexString(storeId),
        createdAt: { $gte: sixtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const orderCountsMap: Record<string, number> = {};

  // Populate counts from MongoDB
  for (const { _id, count } of orderSummary) {
    orderCountsMap[_id] = count;
  }

  // Ensure all 30 days have values, defaulting to 0 if missing
  const last30DaysCounts: number[] = last30Days.map(
    (date) => orderCountsMap[date] || 0
  );
  const prev30DaysCounts: number[] = prev30Days.map(
    (date) => orderCountsMap[date] || 0
  );

  // Calculate total orders for last 30 days and previous 30 days
  const totalLast30Days: number = last30DaysCounts.reduce(
    (sum, count) => sum + count,
    0
  );
  const totalPrev30Days: number = prev30DaysCounts.reduce(
    (sum, count) => sum + count,
    0
  );

  // Calculate percentage change
  const percentageChange: number =
    totalPrev30Days === 0
      ? // biome-ignore lint/style/noNestedTernary: <Ignore>
        totalLast30Days > 0
        ? 100
        : 0
      : ((totalLast30Days - totalPrev30Days) / totalPrev30Days) * 100;

  const formattedPercentageChange = percentageChange.toFixed(0);

  // Determine trend
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (totalLast30Days > totalPrev30Days) {
    trend = 'up';
  } else if (totalLast30Days < totalPrev30Days) {
    trend = 'down';
  }

  return {
    totalLast30Days,
    totalPrev30Days,
    percentageChange: formattedPercentageChange,
    trend,
    last30DaysCounts,
  };
};

export { fetchOrderStats };
