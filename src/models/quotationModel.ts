import { model, models, Schema } from "mongoose";
import type { QuotationDocument } from "./types/quotation";

const QuotationSchema = new Schema<QuotationDocument>(
    {
        quotationId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        shopAddress: {
            type: String,
            required: true,
        },
        billTo: {
            type: String,
        },
        attendedBy: {
            type: String,
        },
        quotationType: {
            type: String,
            required: true,
            enum: ["per-head", "itemized"],
        },
        sentToWhatsApp: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
        },
        note: {
            type: String,
        },
        discount: {
            type: Number,
            default: 0,
        },
        includeTax: {
            type: Boolean,
            default: false,
        },
        tax: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
        perHead: {
            title: {
                type: String,
            },
            items: {
                type: String,
            },
            costPerHead: {
                type: Number,
            },
            numberOfHeads: {
                type: Number,
            },
        },
        itemized: {
            items: {
                type: Array,
                required: true,
            },
        },
    },
    { versionKey: false, timestamps: true }
);

const Quotation =
    models?.Quotation || model<QuotationDocument>("Quotation", QuotationSchema);
export default Quotation;
