import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { StoreDocument } from "@/models/types/store";

const StoreSelectStaff = ({
    stores,
    value,
    setValue,
}: {
    stores: StoreDocument[];
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <Select name="store" value={value} onValueChange={setValue}>
            <SelectTrigger className="col-span-3 text-primary">
                <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent className="z-[1560]">
                {stores?.map((store, i) => (
                    <SelectItem value={store._id} key={i}>
                        {store.location}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StoreSelectStaff;
