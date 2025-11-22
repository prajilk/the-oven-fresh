import { Box, Stack, Typography } from "@mui/material";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import SupplierTable from "@/components/data-table/supplier-table";
import { getStoresServer } from "@/lib/api/stores/get-stores";
import { getSuppliersServer } from "@/lib/api/suppliers/get-suppliers";

const Supplier = async () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
    });
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["suppliers"],
            queryFn: getSuppliersServer,
        }),
        queryClient.prefetchQuery({
            queryKey: ["stores"],
            queryFn: getStoresServer,
        }),
    ]);

    return (
        <Box className="flex-grow overflow-auto" component="main">
            <Header />
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: { xs: 1, md: 3 },
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
                        Supplier Invoices
                    </Typography>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <SupplierTable />
                    </HydrationBoundary>
                </Box>
            </Stack>
        </Box>
    );
};

export default Supplier;
