import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import type { MonthlyRevenueData } from '@/lib/types/finance';
import Catering from '@/models/cateringModel';
import Tiffin from '@/models/tiffinModel';
import type { StoreDocument } from '@/models/types/store';

function formatStoreData(stores: StoreDocument[]) {
  const arr = stores.map((store, i) => ({
    value: `store${i + 1}`,
    name: store.location,
  }));
  arr.unshift({
    value: 'all',
    name: 'All Stores',
  });
  return arr;
}

// Predefined color map for known services
const colorMap: { [key: string]: string } = {
  'Scarborough Tiffin': '#2563eb',
  'Scarborough Catering': '#16a34a',
  'Oshawa Tiffin': '#ea580c',
  'Oshawa Catering': '#8b5cf6',
};

// Function to generate a random color (without concern for vibrancy)
const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to get the colors for store locations and services
const generateStoreColors = (
  data: {
    location: string;
  }[]
): { [key: string]: string } => {
  const result: { [key: string]: string } = {};

  // Iterate over each store data object
  for (const entry of data) {
    const { location } = entry;

    // Define service names for each location
    const services = ['Tiffin', 'Catering'];

    // Loop through the services and create keys for each service type
    for (const service of services) {
      const key = `${location} ${service}`;

      // If the key exists in the color map, use that color, else generate a random color
      result[key] = colorMap[key] || generateRandomColor();
    }
  }

  return result;
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

async function formatRevenueData(stores: StoreDocument[], year: number) {
  // Initialize the result array
  const result: MonthlyRevenueData[] = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const lastMonth = year < currentYear ? 12 : currentMonth + 1;

  // Loop through each month of the current year
  for (let monthIndex = 0; monthIndex < lastMonth; monthIndex++) {
    // Example: Looping for Jan, Feb, Mar
    const monthName = months[monthIndex];

    const monthData: MonthlyRevenueData = { name: monthName };

    // Loop over stores to gather month-specific data
    for (const store of stores) {
      // Get the start and end of the current month
      const startOfTheMonth = startOfMonth(new Date(year, monthIndex, 1));
      const endOfTheMonth = endOfMonth(new Date(year, monthIndex, 1));

      const [tiffins, caterings] = await Promise.all([
        // Find Tiffins for the store in the current month
        Tiffin.find({
          store: store._id,
          $or: [
            {
              startDate: { $lte: endOfTheMonth },
              endDate: { $gte: startOfTheMonth },
            },
          ],
        }),
        // Find Caterings for the store in the current month
        Catering.find(
          {
            store: store._id,
            createdAt: {
              $gte: startOfTheMonth,
              $lt: endOfTheMonth,
            },
          },
          'totalPrice'
        ),
      ]);

      // Aggregate totals for Tiffins and Caterings
      let tiffinTotal = 0;
      for (const tiffin of tiffins) {
        // 1. All days in the order range
        const allDays = eachDayOfInterval({
          start: tiffin.startDate,
          end: tiffin.endDate,
        });

        // 2. Weekdays only (Mon–Fri)
        const weekdays = allDays.filter((date) => {
          const day = getDay(date); // 0: Sunday, 6: Saturday
          return day !== 0 && day !== 6;
        });

        const perDayPrice = tiffin.totalPrice / weekdays.length;

        // 3. Weekdays that fall in the selected month
        const monthWeekdays = weekdays.filter(
          (date) =>
            date >= startOfTheMonth &&
            date <= endOfTheMonth &&
            isSameMonth(date, startOfTheMonth)
        );

        tiffinTotal += perDayPrice * monthWeekdays.length;
      }
      const cateringTotal = caterings.reduce(
        (sum, catering) => sum + catering.totalPrice,
        0
      );

      // Add the data for the specific store and category
      monthData[`${store.location} Tiffin`] = tiffinTotal;
      monthData[`${store.location} Catering`] = cateringTotal;
    }

    // Push the month's data to the result array
    result.push(monthData);
  }

  return result;
}

type Result = {
  [key: string]: {
    tiffin: string[];
    catering: string[];
    all: string[];
  };
};

const getStoreServiceMap = (stores: StoreDocument[]): Result => {
  const result: Result = {
    all: {
      tiffin: [],
      catering: [],
      all: [],
    },
  };

  stores.forEach((store, index) => {
    const storeKey = `store${index + 1}`;

    // Initialize the store entry
    result[storeKey] = {
      tiffin: [`${store.location} Tiffin`],
      catering: [`${store.location} Catering`],
      all: [`${store.location} Tiffin`, `${store.location} Catering`],
    };

    // Add to 'all' entry
    result.all.tiffin.push(`${store.location} Tiffin`);
    result.all.catering.push(`${store.location} Catering`);
    result.all.all.push(
      `${store.location} Tiffin`,
      `${store.location} Catering`
    );
  });

  return result;
};

export {
  formatStoreData,
  generateStoreColors,
  formatRevenueData,
  getStoreServiceMap,
};
