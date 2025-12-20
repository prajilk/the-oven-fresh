interface SubItem {
    id: string;
    name: string;
}

interface ItemizedItem {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    rate: string;
    subItems: SubItem[];
}

interface PrintableQuotationProps {
    type: "per-head" | "itemized";
    shopAddress: string;
    billTo: string;
    attendedBy: string;
    title?: string;
    items?: string | ItemizedItem[];
    costPerHead?: string;
    numberOfHeads?: string;
    notes?: string;
    discount?: number;
    includeTax: boolean;
    subtotal: number;
    afterDiscount: number;
    taxAmount: number;
    total: number;
}

export default function PrintableQuotation({
    type,
    shopAddress,
    billTo,
    attendedBy,
    title,
    items,
    costPerHead,
    numberOfHeads,
    notes,
    discount,
    includeTax,
    subtotal,
    afterDiscount,
    taxAmount,
    total,
}: PrintableQuotationProps) {
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-white text-black p-8 space-y-6 print:p-0">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">QUOTATION</h1>
                <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
            </div>

            {/* Shop Address */}
            <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    From:
                </h2>
                <p className="text-sm whitespace-pre-wrap border-l-4 border-blue-600 pl-3">
                    {shopAddress}
                </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                        Bill To:
                    </h2>
                    <p className="text-sm whitespace-pre-wrap border-l-4 border-coral-500 pl-3">
                        {billTo}
                    </p>
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                        Attended By:
                    </h2>
                    <p className="text-sm border-l-4 border-coral-500 pl-3">
                        {attendedBy}
                    </p>
                </div>
            </div>

            {/* Quotation Details */}
            <div className="border-t-2 border-gray-300 pt-4">
                {type === "per-head" ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <pre className="text-sm whitespace-pre-wrap font-sans">
                                {items as string}
                            </pre>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">
                                    Number of Heads:
                                </span>{" "}
                                {numberOfHeads}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Cost Per Head:
                                </span>{" "}
                                ${costPerHead}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Items
                        </h3>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th className="text-left p-2 font-semibold">
                                        Item
                                    </th>
                                    <th className="text-right p-2 font-semibold">
                                        Qty
                                    </th>
                                    {Array.isArray(items) &&
                                        items.some((item) => item.unit) && (
                                            <th className="text-right p-2 font-semibold">
                                                Unit
                                            </th>
                                        )}
                                    <th className="text-right p-2 font-semibold">
                                        Rate
                                    </th>
                                    <th className="text-right p-2 font-semibold">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(items) &&
                                    items.map((item) => (
                                        <>
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-200"
                                            >
                                                <td className="p-2">
                                                    <div className="font-medium">
                                                        {item.name}
                                                    </div>
                                                    {item.subItems.length >
                                                        0 && (
                                                        <div className="text-xs text-gray-600 ml-4 mt-1">
                                                            (
                                                            {item.subItems
                                                                .map(
                                                                    (sub) =>
                                                                        sub.name
                                                                )
                                                                .join(", ")}
                                                            )
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-right p-2">
                                                    {item.quantity}
                                                </td>
                                                {Array.isArray(items) &&
                                                    items.some(
                                                        (item) => item.unit
                                                    ) && (
                                                        <td className="text-right p-2">
                                                            {item.unit || "-"}
                                                        </td>
                                                    )}
                                                <td className="text-right p-2">
                                                    $
                                                    {Number.parseFloat(
                                                        item.rate || "0"
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="text-right p-2">
                                                    $
                                                    {(
                                                        Number.parseFloat(
                                                            item.quantity || "0"
                                                        ) *
                                                        Number.parseFloat(
                                                            item.rate || "0"
                                                        )
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {notes && (
                <div className="border-t border-gray-300 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                        Notes:
                    </h3>
                    <p className="text-sm whitespace-pre-wrap text-gray-600">
                        {notes}
                    </p>
                </div>
            )}

            {/* Total Summary */}
            <div className="border-t-2 border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-base">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount && discount > 0 && (
                    <>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Discount:</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base">
                            <span className="font-semibold">
                                After Discount:
                            </span>
                            <span>${afterDiscount.toFixed(2)}</span>
                        </div>
                    </>
                )}
                {includeTax && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax (13%):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-2">
                    <span>Total:</span>
                    <span className="text-coral-600">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4 mt-8">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
}
