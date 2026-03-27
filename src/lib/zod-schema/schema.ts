import { z } from "zod";

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username" }),
    password: z.string().min(8, "Password must be 8 or more characters long"),
});

export const ZodUserSchemaWithPassword = z.object({
    id: z.string({ message: "Staff ID is required!" }),
    username: z.string().min(3).max(15),
    displayUsername: z.string().min(3).max(15),
    password: z
        .string()
        .refine((val) => val.length === 0 || val.length >= 8, {
            message: "Password must be 8 or more characters long",
        })
        .optional(),
    role: z.enum(["manager", "delivery", "admin"]),
    store: z.string({ message: "Store ID is required!" }),
});

export const ZodStoreSchema = z.object({
    name: z.string().min(3).max(50),
    address: z.string().min(3).max(150),
    phone: z.string().optional(),
    location: z.string().min(2).max(20),
    placeId: z.string().min(2).max(30),
    lat: z.number(),
    lng: z.number(),
    dividerLine: z.object({
        start: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
        end: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
    }),
});

export const ZodCustomerSchema = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(1).max(20),
    phone: z.string().min(3).max(20),
    address: z
        .union([
            z.literal(""), // allow empty string
            z.string().min(3).max(200), // if not empty, must be 3–200 chars
        ])
        .optional(),
    aptSuiteUnit: z.string().optional(),
    lat: z.number().min(-90).max(90), // Latitude must be between -90 and 90
    lng: z.number().min(-180).max(180), // Longitude must be between -180 and 180
});

export const ZodCateringSchema = z.object({
    deliveryDate: z.date({
        error: "Delivery date is required",
    }),
    customerDetails: ZodCustomerSchema,
    items: z
        .array(
            z.object({
                itemId: z.string().length(24),
                quantity: z.number().min(1),
                priceAtOrder: z.number(),
                size: z.string(),
            })
        )
        .optional(),
    customItems: z
        .array(
            z.object({
                itemDescription: z.string(),
                rate: z.number(),
                quantity: z.number(),
                unit: z.string(),
            })
        )
        .optional(),
    payment_method: z.enum(["cash", "card", "e-transfer"]),
    note: z.string().optional(),
    totalPrice: z.number(),
    tax: z.number(),
    deliveryCharge: z.number(),
    advancePaid: z.number(),
    pendingBalance: z.number(),
    discount: z.number(),
    fullyPaid: z.boolean(),
    order_type: z.enum(["pickup", "delivery"]),
    order_taken_by: z.string().optional(),
});

export const ZodCateringMenuSchema = z.object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(1, "Item name is required"),
    image: z.string().optional(),
    variant: z.string().optional(),
    smallPrice: z.string().optional(),
    mediumPrice: z.string().optional(),
    largePrice: z.string().optional(),
    smallServingSize: z.string().optional(),
    mediumServingSize: z.string().optional(),
    largeServingSize: z.string().optional(),
    disabled: z.boolean().optional(),
});

export const ZodTiffinSchema = z.object({
    customerDetails: ZodCustomerSchema,
    start_date: z.string(),
    end_date: z.string(),
    number_of_weeks: z.string().min(1),
    payment_method: z.enum(["cash", "card", "e-transfer"]),
    totalAmount: z.string().min(1),
    tax: z.number(),
    pendingAmount: z.string().optional(),
    advancePaid: z.string().optional(),
    discount: z.string().optional(),
    note: z.string().optional(),
    order_type: z.enum(["pickup", "delivery"]),
    order_taken_by: z.string().optional(),
});

export const ZodGrocerySchema = z.object({
    item: z
        .string()
        .min(3, "Item is required")
        .max(20, "Item must be 3-20 characters long"),
    quantity: z.string().min(1, "Quantity is required"),
    unit: z.enum(
        ["L", "Kg", "g", "lbs", "Pcs", "Nos", "none"],
        "Unit is required"
    ),
    price: z.string().min(1, "Price is required"),
    tax: z.string().min(1, "Tax is required"),
    total: z.string().min(1, "Total is required"),
    purchasedFrom: z.string().min(1, "Purchased from is required"),
    date: z.string({
        error: "Invalid date format",
    }),
});

export const ZodSupplierSchema = z.object({
    name: z.string().optional(),
    invoice: z.string().min(3).max(15),
    totalAmount: z.string(),
    date: z.string(),
    paid: z.string(),
});

export const ZodPerHeadQuotationSchema = z.object({
    shopAddress: z.string().min(3).max(150),
    billTo: z.string().optional(),
    attendedBy: z.string().optional(),
    discount: z.number().optional(),
    includeTax: z.boolean(),
    tax: z.number(),
    total: z.number(),
    note: z.string().optional(),
    whatsappNumber: z.string().optional(),
    quotationType: z.enum(["per-head", "itemized"]),

    title: z.string().optional(),
    items: z.string().min(1),
    costPerHead: z.number().min(1),
    numberOfHeads: z.number().min(1),
});

export const ZodItemizedQuotationSchema = z.object({
    shopAddress: z.string().min(3).max(150),
    billTo: z.string().optional(),
    attendedBy: z.string().optional(),
    discount: z.number().optional(),
    includeTax: z.boolean(),
    tax: z.number(),
    total: z.number(),
    note: z.string().optional(),
    whatsappNumber: z.string().optional(),
    quotationType: z.enum(["per-head", "itemized"]),

    items: z.array(
        z.object({
            id: z.string(),
            name: z.string().min(1),
            quantity: z.string().min(1),
            unit: z.string().optional(),
            rate: z.string().min(1),
            subItems: z.array(
                z.object({
                    id: z.string(),
                    name: z.string().min(1),
                })
            ),
        })
    ),
});
