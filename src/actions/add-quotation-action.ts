"use server";

import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import z from "zod";
import {
    ZodItemizedQuotationSchema,
    ZodPerHeadQuotationSchema,
} from "@/lib/zod-schema/schema";
import Quotation from "@/models/quotationModel";
import { generateId } from "better-auth";
import { sendWhatsappMessage } from "@/lib/whatsapp";

export async function addQuotationAction(
    data:
        | z.infer<typeof ZodPerHeadQuotationSchema>
        | z.infer<typeof ZodItemizedQuotationSchema>,
    sentToWhatsApp: boolean
) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const quotationId = generateId(7).toUpperCase();

        if (data.quotationType === "per-head") {
            const result = ZodPerHeadQuotationSchema.safeParse(data);

            if (!result.success) {
                return { error: "Invalid data format." };
            }

            await Quotation.create({
                quotationId,
                shopAddress: result.data.shopAddress,
                billTo: result.data.billTo,
                attendedBy: result.data.attendedBy,
                quotationType: result.data.quotationType,
                phone: result.data.whatsappNumber,
                note: result.data.note,
                discount: result.data.discount,
                includeTax: result.data.includeTax,
                tax: result.data.tax,
                total: result.data.total,
                perHead: {
                    title: result.data.title,
                    items: result.data.items,
                    costPerHead: result.data.costPerHead,
                    numberOfHeads: result.data.numberOfHeads,
                },
                itemized: {},
            });
        } else if (data.quotationType === "itemized") {
            const result = ZodItemizedQuotationSchema.safeParse(data);

            if (!result.success) {
                return { error: "Invalid data format." };
            }

            await Quotation.create({
                quotationId,
                shopAddress: result.data.shopAddress,
                billTo: result.data.billTo,
                attendedBy: result.data.attendedBy,
                quotationType: result.data.quotationType,
                phone: result.data.whatsappNumber,
                note: result.data.note,
                discount: result.data.discount,
                includeTax: result.data.includeTax,
                tax: result.data.tax,
                total: result.data.total,
                perHead: {},
                itemized: {
                    items: result.data.items,
                },
            });
        }

        if (sentToWhatsApp) {
            if (!process.env.TWILIO_ORDER_QUOTATION) {
                throw new Error("TWILIO_ORDER_QUOTATION is not set.");
            }

            if (!data.whatsappNumber || data.whatsappNumber === "") {
                return {
                    error: "No whatsapp number provided.",
                    messageSent: false,
                };
            }

            try {
                const test = await sendWhatsappMessage(
                    data.whatsappNumber,
                    {
                        1: quotationId,
                        2: `quotation?quotationId=${quotationId}`,
                    },
                    process.env.TWILIO_ORDER_QUOTATION
                );
                console.log(test);
            } catch (error) {
                return {
                    error: "Failed to send quotation to whatsapp.",
                    messageSent: false,
                };
            }

            await Quotation.findOneAndUpdate(
                { quotationId },
                {
                    $set: {
                        sentToWhatsApp: true,
                    },
                }
            );

            return { success: true, messageSent: true };
        }

        return { success: true };
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
