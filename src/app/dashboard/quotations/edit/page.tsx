import ItemizedQuotation from "@/components/quotation/itemized-quotation";
import PerHeadQuotation from "@/components/quotation/per-head-quotation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import connectDB from "@/config/mongoose";
import { splitId } from "@/lib/utils";
import Quotation from "@/models/quotationModel";
import { Box, Stack } from "@mui/material";
import { notFound } from "next/navigation";

const QuotationAddPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const quotationId = (await searchParams)?.id as string;
    if (!quotationId) {
        return notFound();
    }

    await connectDB();

    const quotation = await Quotation.findOne({
        quotationId,
    });

    if (!quotation) {
        return notFound();
    }

    return (
        <Box className="flex-grow overflow-auto" component="main">
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1.5, md: 3 },
                    pb: 5,
                    pt: { xs: 2, md: 0 },
                    mt: { xs: 8, md: 2 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className="min-h-screen pt-2 pb-8 sm:px-6 lg:pt-4 lg:pb-8">
                        <div className="mx-auto max-w-5xl">
                            <Card className="shadow-none border-none bg-transparent">
                                <Tabs
                                    defaultValue={quotation.quotationType}
                                    className="w-full"
                                >
                                    <TabsList className="hidden w-full grid-cols-2 bg-muted h-10">
                                        <TabsTrigger
                                            value="per-head"
                                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-1.5"
                                        >
                                            Price Per Head
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="itemized"
                                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                        >
                                            Itemized Quotation
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="per-head"
                                        className="pb-6"
                                    >
                                        <PerHeadQuotation
                                            data={{
                                                attendedBy:
                                                    quotation.attendedBy,
                                                billTo: quotation.billTo,
                                                discount: quotation.discount,
                                                includeTax:
                                                    quotation.includeTax,
                                                items: quotation.perHead.items,
                                                note: quotation.note,
                                                numberOfHeads:
                                                    quotation.perHead
                                                        .numberOfHeads,
                                                shopAddress:
                                                    quotation.shopAddress,
                                                title: quotation.perHead.title,
                                                whatsappNumber: quotation.phone,
                                                quotationId: splitId(
                                                    quotation.quotationId
                                                )[0],
                                                idSuffix: splitId(
                                                    quotation.quotationId
                                                )[1],
                                                costPerHead:
                                                    quotation.perHead
                                                        .costPerHead,
                                            }}
                                            edit
                                        />
                                    </TabsContent>

                                    <TabsContent
                                        value="itemized"
                                        className="py-6"
                                    >
                                        <ItemizedQuotation
                                            data={{
                                                attendedBy:
                                                    quotation.attendedBy,
                                                billTo: quotation.billTo,
                                                discount: quotation.discount,
                                                includeTax:
                                                    quotation.includeTax,
                                                whatsappNumber: quotation.phone,
                                                quotationId: splitId(
                                                    quotation.quotationId
                                                )[0],
                                                idSuffix: splitId(
                                                    quotation.quotationId
                                                )[1],
                                                note: quotation.note,
                                                shopAddress:
                                                    quotation.shopAddress,
                                            }}
                                            orderItems={
                                                quotation.itemized.items
                                            }
                                            edit
                                        />
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        </div>
                    </div>
                </Box>
            </Stack>
        </Box>
    );
};

export default QuotationAddPage;
