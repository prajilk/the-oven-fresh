import Stack from "@mui/material/Stack";
import { Suspense } from "react";
import ReminderDialog from "../dialog/reminder-dialog";
import { Skeleton } from "../ui/skeleton";
import NavbarBreadcrumbs from "./navbar-breadcrumbs";
import StoreDisplay from "./store-display";

export default function Header() {
    return (
        <Stack
            className="bg-primary"
            direction="row"
            spacing={2}
            // className="bg-primary sticky top-0 z-50"
            sx={{
                display: { xs: "none", md: "flex" },
                width: "100%",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                maxWidth: { sm: "100%", md: "1700px" },
                p: 1.5,
            }}
        >
            <NavbarBreadcrumbs />
            <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
                <ReminderDialog />
                <Suspense
                    fallback={
                        <>
                            <Skeleton className="h-9 w-[131px] rounded-xl bg-primary-foreground/40" />
                            <Skeleton className="h-[42px] w-48 rounded-xl bg-primary-foreground/40" />
                        </>
                    }
                >
                    <StoreDisplay />
                </Suspense>
            </Stack>
        </Stack>
    );
}
