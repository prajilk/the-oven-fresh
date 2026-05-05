"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

type Order = {
    id: string;
    deliveryDate: Date;
    createdAt: Date;
    order_type: "pickup" | "delivery";
    address: string;
    aptSuiteUnit?: string;
    customerName: string;
    phone: string;
    order_taken_by?: string;
    fullyPaid: boolean;
    customItems: Array<{
        _id: string;
        itemDescription: string;
        quantity: number;
        rate: number;
        unit: string;
    }>;
};

type CateringOrder = Order & {
    items: Array<{
        _id: string;
        name: string;
        quantity: number;
        priceAtOrder: number;
        size: string;
    }>;
};

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: "Helvetica",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    section: {
        marginBottom: 10,
    },

    label: {},

    value: {
        fontWeight: "bold",
        textTransform: "capitalize",
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#999",
        marginVertical: 8,
    },

    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        paddingBottom: 4,
        marginBottom: 4,
    },

    tableRow: {
        flexDirection: "row",
        marginBottom: 2,
    },

    colItem: { width: "40%" },
    colQty: { width: "10%" },
    colUnit: { width: "20%" },
    colRemarks: { width: "30%" },

    remarksBox: {
        borderWidth: 1,
        height: 80,
    },

    footer: {
        marginTop: 20,
    },
});

// PDF Document component
export default function CateringSheet({
    order,
    remarks,
}: {
    order: CateringOrder;
    remarks: Record<string, string>;
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
        <PDFViewer height={800} width="100%">
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={[styles.row, styles.section]}>
                        <View>
                            <Text>
                                <Text style={styles.label}>
                                    Customer Name:{" "}
                                </Text>
                                <Text style={styles.value}>
                                    {order.customerName}
                                </Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Phone #: </Text>
                                <Text style={styles.value}>{order.phone}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text>
                                <Text style={styles.value}>{order.id}</Text>
                            </Text>
                            <Text>
                                <Text>{format(order.createdAt, "PPP")}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Event */}
                    <View style={[styles.row, styles.section]}>
                        <Text>
                            <Text style={styles.label}>Date of Event: </Text>
                            <Text style={styles.value}>
                                {format(
                                    order.deliveryDate,
                                    "EEEE, MMMM do, yyyy"
                                )}{" "}
                                | {format(order.deliveryDate, "hh:mm a")}
                            </Text>
                        </Text>
                        <Text>
                            <Text style={styles.label}>
                                Count:{" "}
                                {order.items.length + order.customItems.length}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            <Text style={styles.label}>Delivery Method: </Text>
                            <Text style={styles.value}>{order.order_type}</Text>
                        </Text>
                        <Text>
                            <Text style={styles.label}>Delivery Details: </Text>
                            <Text style={styles.value}>
                                {order.address}
                            </Text> | {order.aptSuiteUnit}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colItem}>Items</Text>
                        <Text style={styles.colQty}>Qty</Text>
                        <Text style={styles.colUnit}>Unit</Text>
                        <Text style={styles.colRemarks}>Remarks</Text>
                    </View>

                    {/* Table Rows */}
                    {order.items.map((item, i) => (
                        <View style={styles.tableRow} key={i}>
                            <Text style={[styles.colItem, styles.value]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.colQty, styles.value]}>
                                {item.quantity}
                            </Text>
                            <Text style={[styles.colUnit, styles.value]}>
                                {item.size}
                            </Text>
                            <Text style={styles.colRemarks}>
                                {remarks?.[item._id] || ""}
                            </Text>
                        </View>
                    ))}
                    {order.customItems.map((item, i) => (
                        <View style={styles.tableRow} key={i}>
                            <Text style={[styles.colItem, styles.value]}>
                                {item.itemDescription}
                            </Text>
                            <Text style={[styles.colQty, styles.value]}>
                                {item.quantity}
                            </Text>
                            <Text style={[styles.colUnit, styles.value]}>
                                {item.unit}
                            </Text>
                            <Text style={styles.colRemarks}>
                                {remarks?.[item._id] || ""}
                            </Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {/* Footer */}
                    <View style={[styles.row, styles.footer]}>
                        <Text>
                            <Text style={styles.label}>Payment Status: </Text>
                            <Text style={styles.value}>
                                {order.fullyPaid ? "Paid" : "Unpaid"}
                            </Text>
                        </Text>
                        <Text>
                            Order Taken:{" "}
                            <Text style={styles.value}>
                                {order.order_taken_by}
                            </Text>
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <p>Loading PDF Viewer...</p>
        </div>
    );
}
