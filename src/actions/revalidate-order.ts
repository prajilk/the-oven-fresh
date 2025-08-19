'use server';

import { revalidatePath } from 'next/cache';

// biome-ignore lint/suspicious/useAwait: <Server Actions must be async functions.>
export async function revalidateOrder(orderString: string) {
  revalidatePath(`/dashboard/orders/${orderString}`);
}
