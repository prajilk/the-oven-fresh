const ORDER_STATUSES = [
  'PENDING',
  'ONGOING',
  'DELIVERED',
  'CANCELLED',
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type DayStatus = {
  _id: string;
  status: OrderStatus;
};

export { ORDER_STATUSES };
export type { OrderStatus, DayStatus };
