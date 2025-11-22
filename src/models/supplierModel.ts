import mongoose, { model, models, Schema } from "mongoose";
import type { SupplierDocument } from "./types/supplier";

const SupplierSchema = new Schema<SupplierDocument>(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        name: {
            type: String,
        },
        invoice: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        paid: {
            type: Number,
            required: true,
            default: 0,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
        },
    },
    { versionKey: false, timestamps: true }
);

const Supplier =
    models?.Supplier || model<SupplierDocument>("Supplier", SupplierSchema);
export default Supplier;
