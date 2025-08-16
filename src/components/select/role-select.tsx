import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const RoleSelect = ({
    value,
    setValue,
}: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <Select name="role" value={value} onValueChange={setValue}>
            <SelectTrigger className="col-span-3 text-primary">
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="z-[1560]">
                <SelectItem value="MANAGER">MANAGER</SelectItem>
                <SelectItem value="DELIVERY">DELIVERY</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default RoleSelect;
