import { CircleAlert, Loader2 } from "lucide-react";
import type {
    CateringCustomMenuDocument,
    CateringMenuDocumentPopulate,
} from "@/models/types/catering-menu";
import { SelectedItemsList } from "./selected-items-list";
import { VisualMenuSelector } from "./visual-menu-selector";

const SelectItems = ({
    data,
    customMenu,
    isPending,
}: {
    data?: CateringMenuDocumentPopulate[] | null;
    customMenu?: CateringCustomMenuDocument[] | null;
    isPending: boolean;
}) => {
    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <span>Loading...</span>
            </div>
        );
    }

    if (data?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2">
                <CircleAlert className="text-primary" />
                <span>No catering menu found!</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 lg:flex-row">
            <div className="grid w-full grid-cols-1 gap-6 pb-14 lg:grid-cols-3 lg:pb-0">
                <div className="lg:col-span-2">
                    <VisualMenuSelector
                        menuItems={data || []}
                        customMenu={customMenu || []}
                    />
                </div>
                <div>
                    <SelectedItemsList />
                </div>
            </div>
        </div>
    );
};

export default SelectItems;
