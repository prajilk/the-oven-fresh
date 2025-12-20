import { Box, Stack, Typography } from "@mui/material";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { getQuotationsServer } from "@/lib/api/quotations/get-quotations";
import QuotationsTable from "@/components/data-table/quotations-table";

const Quotations = async () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
    });
    await queryClient.prefetchQuery({
        queryKey: ["quotation"],
        queryFn: () => getQuotationsServer(),
    });

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
                    <Typography component="h2" sx={{ mb: 2 }} variant="h6">
                        Quotations
                    </Typography>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <QuotationsTable />
                    </HydrationBoundary>
                </Box>
            </Stack>
        </Box>
    );
};

export default Quotations;
