import type mongoose from "mongoose";

export type SupplierDocument = {
    _id: string;
    store: mongoose.Schema.Types.ObjectId;
    invoice: string;
    name?: string;
    totalAmount: number;
    date: Date;
    paid: number;
    balance: number;
    status: string;
};
