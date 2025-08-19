import { format } from 'date-fns';
import { error403, error500, success200 } from '@/lib/response';
import type { AuthenticatedRequest } from '@/lib/types/auth-request';
import {
  getMonthInNumber,
  getMonthsUpToCurrent,
  isRestricted,
} from '@/lib/utils';
import { withDbConnectAndAuth } from '@/lib/with-db-connect-and-auth';
import Grocery from '@/models/groceryModel';
import Store from '@/models/storeModel';

async function getHandler(req: AuthenticatedRequest) {
  try {
    if (isRestricted(req.user, ['admin'])) {
      return error403();
    }

    const year =
      req.nextUrl.searchParams.get('year') || format(new Date(), 'yyyy');

    // Get all stores with their locations
    const stores = await Store.find({}, '_id location');
    const storeMap = new Map(
      stores.map((store) => [store._id.toString(), store.location])
    );
    const storesLocation = stores.map((store) => store.location);

    // Get last 3 months
    const months = getMonthsUpToCurrent(true, Number(year)); // Example: [{ value: "jan", name: "January 2025" }, ...]

    const expensesData: Record<
      string,
      {
        month: string;
        expenses: Record<string, { total: number; items: number }>;
      }
    > = {};
    for (const { value, name } of months) {
      expensesData[value] = { month: name, expenses: {} };
    }

    // Create a date filter range using month-to-number conversion
    const startMonth = getMonthInNumber(months[0].value); // Convert "jan" -> 1, etc.
    const endMonth = getMonthInNumber(months.at(-1)?.value || 'dec'); // Convert "jan" -> 1, etc.

    const startDate = format(
      new Date(Number(year), startMonth - 1, 1),
      'yyyy-MM-dd'
    ); // YYYY-MM-01
    const endDate = format(new Date(Number(year), endMonth, 0), 'yyyy-MM-dd');

    // Fetch grocery data
    const groceries = await Grocery.find(
      { date: { $gte: startDate, $lte: endDate } }, // Filter from the earliest month
      { store: 1, total: 1, date: 1 }
    ).lean();

    // Process data manually
    for (const grocery of groceries) {
      const groceryDate = new Date(grocery.date);
      const monthNumber = groceryDate.getMonth() + 1; // Get month as number (1-12)
      const monthKey = Object.keys(expensesData).find(
        (key) => getMonthInNumber(key) === monthNumber
      );

      const storeLocation = storeMap.get(grocery.store.toString());

      if (monthKey && expensesData[monthKey] && storeLocation) {
        // Convert store ID to location name

        if (!expensesData[monthKey].expenses[storeLocation]) {
          expensesData[monthKey].expenses[storeLocation] = {
            total: 0,
            items: 0,
          };
        }
        expensesData[monthKey].expenses[storeLocation].total += grocery.total;
        expensesData[monthKey].expenses[storeLocation].items += 1;
      }
    }

    const result = {
      expensesData: Object.values(expensesData),
      stores: storesLocation,
    };

    return success200({ result });
  } catch (error) {
    if (error instanceof Error) {
      return error500({ error: error.message });
    }
    return error500({ error: 'An unknown error occurred' });
  }
}

export const GET = withDbConnectAndAuth(getHandler);
