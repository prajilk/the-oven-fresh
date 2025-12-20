import ItemizedQuotation from "@/components/quotation/itemized-quotation";
import PerHeadQuotation from "@/components/quotation/per-head-quotation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Stack } from "@mui/material";

const QuotationAddPage = () => {
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
                                    defaultValue="per-head"
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 bg-muted h-10">
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

                                    <hr className="mb-6 mt-4" />

                                    <TabsContent
                                        value="per-head"
                                        className="pb-6"
                                    >
                                        <PerHeadQuotation />
                                    </TabsContent>

                                    <TabsContent
                                        value="itemized"
                                        className="py-6"
                                    >
                                        <ItemizedQuotation />
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
