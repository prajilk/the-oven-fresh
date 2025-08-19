import { formatDate } from 'date-fns';
import type mongoose from 'mongoose';
import TiffinOrderStatus from '@/models/tiffinOrderStatusModel';

async function createOrderStatus(
  orderId: mongoose.Types.ObjectId,
  startDate: string,
  endDate: string,
  store: string
) {
  const statuses: {
    orderId: mongoose.Types.ObjectId;
    date: string;
    status: string;
    store: string;
  }[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip weekends
      statuses.push({
        orderId,
        date: formatDate(new Date(currentDate), 'yyyy-MM-dd'),
        status: 'PENDING',
        store,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  await TiffinOrderStatus.insertMany(statuses); // Batch insert all statuses
}

export { createOrderStatus };
