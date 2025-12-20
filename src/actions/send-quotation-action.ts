"use server";

import { withDbConnectAndActionAuth } from "@/lib/with-db-connect-and-auth";
import Quotation from "@/models/quotationModel";
import { sendWhatsappMessage } from "@/lib/whatsapp";

export async function sendQuotationAction(
    whatsappNumber: string,
    quotationId: string
) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        if (!whatsappNumber || whatsappNumber === "") {
            return { error: "No whatsapp number provided." };
        }

        if (!quotationId) {
            return { error: "No quotation id provided." };
        }

        const quotation = await Quotation.findById(quotationId);

        if (!quotation) {
            return { error: "No quotation found." };
        }

        if (!process.env.TWILIO_ORDER_QUOTATION) {
            throw new Error("TWILIO_ORDER_QUOTATION is not set.");
        }

        try {
            await sendWhatsappMessage(
                whatsappNumber,
                {
                    1: quotation.quotationId,
                    2: `quotation?quotationId=${quotation.quotationId}`,
                },
                process.env.TWILIO_ORDER_QUOTATION
            );
        } catch (error) {
            return {
                error: "Failed to send quotation to whatsapp.",
            };
        }

        await Quotation.findByIdAndUpdate(quotationId, {
            $set: {
                sentToWhatsApp: true,
            },
        });

        return { success: true };
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unknown error occurred" };
    }
}
