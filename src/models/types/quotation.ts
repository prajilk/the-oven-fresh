export interface SubItem {
    id: string;
    name: string;
}

export interface Item {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    rate: string;
    subItems: SubItem[];
}

export type QuotationDocument = {
    _id: string;
    quotationId: string;
    shopAddress: string;
    billTo?: string;
    attendedBy?: string;
    quotationType: "per-head" | "itemized";
    sentToWhatsApp: boolean;
    phone?: string;
    note?: string;
    discount: number;
    includeTax: boolean;
    tax: number;
    total: number;
    perHead: {
        title?: string;
        items: string;
        costPerHead: string;
        numberOfHeads: string;
    };
    itemized: {
        items: Item[];
    };
};
