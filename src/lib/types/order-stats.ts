type OrderStatCount = {
    tiffinStatCounts: {
        total: number;
        pending: number;
        delivered: number;
    };
    cateringStatCounts: {
        total: number;
        pending: number;
        delivered: number;
    };
};

type OrderReminder = {
    today: {
        tiffin: number;
        catering: number;
    };
    tomorrow: {
        tiffin: number;
        catering: number;
    };
    dayAfter: {
        tiffin: number;
        catering: number;
    };
};

type StatCardProps = {
    title: string;
    value: string;
    interval: string;
    trend: "up" | "down" | "neutral";
    data: number[];
    percentage?: string;
};

type DeliveryOrderStats = {
    total: number;
    pending: number;
    completed: number;
};

export type {
    OrderStatCount,
    StatCardProps,
    DeliveryOrderStats,
    OrderReminder,
};
