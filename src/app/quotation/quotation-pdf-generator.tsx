"use client";

import { formatDate, formatTimezone } from "@/lib/utils";
import { Item } from "@/models/types/quotation";
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
    Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface QuotationData {
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
        costPerHead: number;
        numberOfHeads: number;
    };
    itemized: {
        items: Item[];
    };
    createdAt: Date;
}

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 11,
        color: "#1a1a1a",
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: "#1f2937",
        paddingBottom: 12,
        marginBottom: 20,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    logo: {
        width: 50,
        height: 50,
    },
    subtitle: {
        fontSize: 10,
        color: "#6b7280",
        fontWeight: "500",
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#374151",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    text: {
        fontSize: 10,
        lineHeight: 1.5,
        borderLeftWidth: 3,
        borderLeftColor: "#2563eb",
        paddingLeft: 10,
    },
    grid: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
    },
    divider: {
        borderTopWidth: 2,
        borderTopColor: "#e5e7eb",
        marginVertical: 16,
    },
    quotationTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 12,
    },
    itemsBox: {
        backgroundColor: "#f9fafb",
        padding: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderBottomWidth: 2,
        borderBottomColor: "#d1d5db",
        paddingVertical: 8,
        paddingHorizontal: 6,
        marginBottom: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    tableCell: {
        fontSize: 9,
    },
    tableCellBold: {
        fontSize: 9,
        fontWeight: "bold",
    },
    subItems: {
        fontSize: 8,
        color: "#6b7280",
        marginTop: 2,
        marginLeft: 12,
    },
    totalSection: {
        borderTopWidth: 2,
        borderTopColor: "#1f2937",
        paddingTop: 12,
        marginTop: 16,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: 11,
    },
    totalRowBold: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: 11,
        fontWeight: "bold",
    },
    grandTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#d1d5db",
        paddingTop: 8,
        marginTop: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        marginTop: 30,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        textAlign: "center",
        fontSize: 9,
        color: "#6b7280",
    },
});

// Updated PDF document component
const QuotationPDF = ({ quotation }: { quotation: QuotationData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <Image src={"/logo-min.png"} style={styles.logo} />
                    <View>
                        <Text style={styles.title}>THE OVEN FRESH</Text>
                        <Text style={styles.subtitle}>
                            WE SERVE WITH PASSION
                        </Text>
                    </View>
                </View>
                <View>
                    <Text>ID: {quotation.quotationId}</Text>
                    <Text>
                        Date:{" "}
                        {format(formatTimezone(quotation.createdAt), "PPP")}
                    </Text>
                </View>
            </View>

            {/* Shop Address */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>From:</Text>
                <Text style={styles.text}>{quotation.shopAddress}</Text>
            </View>

            {/* Customer Details */}
            <View style={styles.grid}>
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Bill To:</Text>
                    <Text style={styles.text}>{quotation.billTo}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Attended By:</Text>
                    <Text style={styles.text}>{quotation.attendedBy}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Quotation Details */}
            {quotation.quotationType === "per-head" ? (
                <View>
                    <Text style={styles.quotationTitle}>
                        {quotation.perHead.title}
                    </Text>
                    <View style={styles.itemsBox}>
                        <Text style={{ fontSize: 10, lineHeight: 1.6 }}>
                            {quotation.perHead.items as string}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 20,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                                Number of Heads:{" "}
                                {quotation.perHead.numberOfHeads}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                                Cost Per Head: ${quotation.perHead.costPerHead}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View>
                    <Text style={styles.quotationTitle}>Items</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCellBold, { width: "40%" }]}>
                            Item
                        </Text>
                        <Text
                            style={[
                                styles.tableCellBold,
                                { width: "12%", textAlign: "right" },
                            ]}
                        >
                            Qty
                        </Text>
                        {Array.isArray(quotation.itemized.items) &&
                            quotation.itemized.items.some(
                                (item) => item.unit
                            ) && (
                                <Text
                                    style={[
                                        styles.tableCellBold,
                                        {
                                            width: "13%",
                                            textAlign: "right",
                                        },
                                    ]}
                                >
                                    Unit
                                </Text>
                            )}
                        <Text
                            style={[
                                styles.tableCellBold,
                                { width: "17%", textAlign: "right" },
                            ]}
                        >
                            Rate
                        </Text>
                        <Text
                            style={[
                                styles.tableCellBold,
                                { width: "18%", textAlign: "right" },
                            ]}
                        >
                            Amount
                        </Text>
                    </View>
                    {Array.isArray(quotation.itemized.items) &&
                        quotation.itemized.items.map((item) => (
                            <View key={item.id} style={styles.tableRow}>
                                <View style={{ width: "40%" }}>
                                    <Text style={styles.tableCellBold}>
                                        {item.name}
                                    </Text>
                                    {item.subItems.length > 0 && (
                                        <Text style={styles.subItems}>
                                            (
                                            {item.subItems
                                                .map((sub) => sub.name)
                                                .join(", ")}
                                            )
                                        </Text>
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: "12%",
                                            textAlign: "right",
                                        },
                                    ]}
                                >
                                    {item.quantity}
                                </Text>
                                {Array.isArray(quotation.itemized.items) &&
                                    quotation.itemized.items.some(
                                        (item) => item.unit
                                    ) && (
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                {
                                                    width: "13%",
                                                    textAlign: "right",
                                                },
                                            ]}
                                        >
                                            {item.unit || "-"}
                                        </Text>
                                    )}
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: "17%",
                                            textAlign: "right",
                                        },
                                    ]}
                                >
                                    $
                                    {Number.parseFloat(
                                        item.rate || "0"
                                    ).toFixed(2)}
                                </Text>
                                <Text
                                    style={[
                                        styles.tableCell,
                                        {
                                            width: "18%",
                                            textAlign: "right",
                                        },
                                    ]}
                                >
                                    $
                                    {(
                                        Number.parseFloat(
                                            item.quantity || "0"
                                        ) * Number.parseFloat(item.rate || "0")
                                    ).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                </View>
            )}

            {/* Notes */}
            {quotation.note && (
                <View style={[styles.section, { marginTop: 16 }]}>
                    <Text style={styles.sectionTitle}>Notes:</Text>
                    <Text
                        style={{
                            fontSize: 10,
                            color: "#6b7280",
                            lineHeight: 1.5,
                        }}
                    >
                        {quotation.note}
                    </Text>
                </View>
            )}

            {/* Total Summary */}
            <View style={styles.totalSection}>
                <View style={styles.totalRowBold}>
                    <Text>Subtotal:</Text>
                    <Text>
                        $
                        {(
                            quotation.total -
                            quotation.tax +
                            quotation.discount
                        ).toFixed(2)}
                    </Text>
                </View>
                {quotation.discount && quotation.discount > 0 && (
                    <>
                        <View style={styles.totalRow}>
                            <Text style={{ color: "#6b7280" }}>Discount:</Text>
                            <Text style={{ color: "#6b7280" }}>
                                -${quotation.discount.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRowBold}>
                            <Text>After Discount:</Text>
                            <Text>
                                ${(quotation.total - quotation.tax).toFixed(2)}
                            </Text>
                        </View>
                    </>
                )}
                {quotation.includeTax && (
                    <View style={styles.totalRow}>
                        <Text style={{ color: "#6b7280" }}>Tax (13%):</Text>
                        <Text style={{ color: "#6b7280" }}>
                            ${quotation.tax.toFixed(2)}
                        </Text>
                    </View>
                )}
                <View style={styles.grandTotal}>
                    <Text>Total:</Text>
                    <Text style={{ color: "#dc2626" }}>
                        ${quotation.total.toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for your business!</Text>
            </View>
        </Page>
    </Document>
);

// Component to display the PDF
export default function QuotationPDFViewer({
    quotation,
}: {
    quotation: QuotationData;
}) {
    const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(
        null
    );

    useEffect(() => {
        import("@react-pdf/renderer").then((mod) => {
            setPDFViewer(() => mod.PDFViewer);
        });
    }, []);

    return PDFViewer ? (
        // @ts-expect-error: PDFViewer is not defined
        <PDFViewer height={600} width="100%">
            <QuotationPDF quotation={quotation} />
        </PDFViewer>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p>Loading PDF Viewer...</p>
        </div>
    );
}
