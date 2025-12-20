import type { ReactNode } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-input";
import type { Value } from "react-phone-number-input";

const QuotationSentDialog = ({
    children,
    whatsappNumber,
    onSubmit,
    onChange,
}: {
    children: ReactNode;
    onSubmit: () => void;
    whatsappNumber: string;
    onChange: (value: Value) => void;
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Quotation via WhatsApp</DialogTitle>
                    <DialogDescription>
                        Enter the customer's WhatsApp number to send the
                        quotation
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <PhoneInput
                            placeholder="phone"
                            defaultCountry="CA"
                            value={whatsappNumber}
                            onChange={onChange}
                            id="whatsapp"
                            type="tel"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={!whatsappNumber}>
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuotationSentDialog;
