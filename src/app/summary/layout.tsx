import ErrorComponent from "@/components/error";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

const SummaryLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (
        !session?.user.id ||
        (!session?.user.storeId && session?.user.role !== "SUPERADMIN") ||
        (session?.user.role !== "MANAGER" &&
            session?.user.role !== "SUPERADMIN")
    ) {
        return (
            <ErrorComponent
                message="You are not authorized to access this page."
                code={403}
                title="Forbidden"
            />
        );
    }
    return (
        <>
            {/* Main content */}
            {children}
        </>
    );
};

export default SummaryLayout;
