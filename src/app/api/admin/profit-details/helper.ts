import { eachDayOfInterval, getDay, isSameMonth } from 'date-fns';
import Tiffin from '@/models/tiffinModel';

export async function calculateTiffinTotal(
  year: number,
  monthNumber: number,
  store: { _id: string }
) {
  const startOfTheMonth = new Date(year, monthNumber - 1, 1);
  const endOfTheMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  const tiffins = await Tiffin.aggregate([
    {
      $match: {
        store: store._id,
        startDate: { $lte: endOfTheMonth },
        endDate: { $gte: startOfTheMonth },
      },
    },
    {
      $project: {
        totalPrice: 1,
        startDate: 1,
        endDate: 1,
      },
    },
  ]);

  let totalRevenue = 0;

  for (const tiffin of tiffins) {
    const allDays = eachDayOfInterval({
      start: new Date(tiffin.startDate),
      end: new Date(tiffin.endDate),
    });
    const weekdays = allDays.filter((d) => {
      const day = getDay(d);
      return day !== 0 && day !== 6; // Exclude Sun (0) and Sat (6)
    });

    const perDayPrice = tiffin.totalPrice / weekdays.length;

    const monthDays = weekdays.filter((d) => isSameMonth(d, startOfTheMonth));
    totalRevenue += perDayPrice * monthDays.length;
  }

  return totalRevenue;
}
