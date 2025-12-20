import Quotation from "@/models/quotationModel";
import QuotationPDFViewer from "./quotation-pdf-generator";
import connectDB from "@/config/mongoose";

const QuotationClientPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const quotationId = (await searchParams)?.quotationId as string;

    if (!quotationId) {
        return <div>No quotation ID found.</div>;
    }

    await connectDB();
    const quotation = await Quotation.findOne({ quotationId });

    if (!quotation) {
        return <div>No quotation found.</div>;
    }

    return (
        <QuotationPDFViewer
            quotation={{
                _id: quotation._id.toString(),
                quotationId: quotation.quotationId,
                shopAddress: quotation.shopAddress,
                billTo: quotation.billTo,
                attendedBy: quotation.attendedBy,
                quotationType: quotation.quotationType,
                sentToWhatsApp: quotation.sentToWhatsApp,
                phone: quotation.phone,
                note: quotation.note,
                discount: quotation.discount,
                includeTax: quotation.includeTax,
                tax: quotation.tax,
                total: quotation.total,
                perHead: {
                    title: quotation.perHead.title,
                    items: quotation.perHead.items,
                    costPerHead: quotation.perHead.costPerHead,
                    numberOfHeads: quotation.perHead.numberOfHeads,
                },
                itemized: {
                    items: quotation.itemized.items,
                },
                createdAt: quotation.createdAt,
            }}
        />
    );
};

export default QuotationClientPage;
