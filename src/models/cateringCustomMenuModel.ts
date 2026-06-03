import { model, models, Schema } from "mongoose";
import type { CateringCustomMenuDocument } from "./types/catering-menu";

const CateringCustomMenuSchema = new Schema<CateringCustomMenuDocument>(
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
    { versionKey: false }
);

const CateringCustomMenu =
    models?.CateringCustomMenu ||
    model<CateringCustomMenuDocument>(
        "CateringCustomMenu",
        CateringCustomMenuSchema
    );
export default CateringCustomMenu;
