import mongoose, { model, models, Schema } from "mongoose";
import type { CateringDocument } from "./types/catering";

const CateringSchema = new Schema<CateringDocument>(
    {
        orderId: {
            type: String,
            require: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        deliveryDate: {
            type: Date,
            required: true,
        },
        deliveryDateLocal: {
            type: Date,
            required: true,
        },
        order_taken_by: {
            type: String,
        },
        items: {
            type: [
                {
                    itemId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "CateringMenu", // Reference to the Item collection
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    priceAtOrder: {
                        // Store the price at the time of order
                        type: Number,
                        required: true,
                    },
                    size: {
                        type: String,
                        enum: ["small", "medium", "large"],
                        required: true,
                    },
                },
            ],
            required: true,
        },
        customItems: {
            type: [
                {
                    itemDescription: {
                        type: String,
                        required: true,
                    },
                    rate: {
                        type: Number,
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    unit: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
        advancePaid: {
            type: Number,
            required: true,
        },
        pendingBalance: {
            type: Number,
            required: true,
        },
        fullyPaid: {
            type: Boolean,
            default: false,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        tax: Number,
        deliveryCharge: Number,
        discount: Number,
        note: String,
        order_type: {
            type: String,
            enum: ["pickup", "delivery"],
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ONGOING", "DELIVERED", "PICKUP", "CANCELLED"],
            default: "PENDING",
        },
        trip: {
            type: Number,
        },
    },
    { versionKey: false, timestamps: true }
);

// Create a unique index for orderId
CateringSchema.index({ orderId: 1 }, { unique: true });

const Catering =
    models?.Catering || model<CateringDocument>("Catering", CateringSchema);
export default Catering;
