'use client';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

// Updated Order type to include all required fields
type Order = {
  id: string;
  store: string;
  customer: string;
  phone: string;
  address: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  tax: number;
  advancePaid: number;
  pendingBalance: number;
  paymentMethod: string;
  note: string;
  status: string;
  type: string;
  numberOfWeeks: number;
};

// Updated styles to accommodate the new table structure
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 7,
  },
  tableColWide: {
    width: '12%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 7,
  },
});

// Updated PDF document component
const OrdersPDF = ({ orders }: { orders: Order[] | [] }) => (
  <Document>
    <Page orientation="landscape" size="A4" style={styles.page}>
      <Text style={styles.title}>Tiffin Orders Report</Text>
      <Text style={styles.subtitle}>
        Printed on: {format(new Date(), 'MMMM d, yyyy HH:mm:ss')}
      </Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text>Order ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Store</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Customer</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Phone</Text>
          </View>
          <View style={styles.tableColWide}>
            <Text>Address</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Created</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Date</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Total</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Tax</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Paid</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Pending</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text>Payment</Text>
          </View>
        </View>
        {/* Table Body */}
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{order.id}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.store}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.customer}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.phone}</Text>
              </View>
              <View style={styles.tableColWide}>
                <Text>{order.address}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  {format(
                    new Date(
                      order.createdAt.getUTCFullYear(),
                      order.createdAt.getUTCMonth(),
                      order.createdAt.getUTCDate()
                    ),
                    'MM/dd/yyyy'
                  )}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>
                  SD: {format(new Date(order.startDate), 'dd/MM/yyyy')}
                </Text>
                <Text>ED: {format(new Date(order.endDate), 'dd/MM/yyyy')}</Text>
                <Text>No. of weeks: {order.numberOfWeeks}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${order.totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${order.tax.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${order.advancePaid.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${order.pendingBalance.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{order.paymentMethod}</Text>
              </View>
            </View>
            {/* Note */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '80%' }]}>
                <Text style={{ fontWeight: 'bold' }}>Note: </Text>
                <Text>{order.note}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={{ fontWeight: 'bold' }}>Type: </Text>
                <Text style={{ textTransform: 'capitalize' }}>
                  {order.type}
                </Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={{ fontWeight: 'bold' }}>Status: </Text>
                <Text>{order.status}</Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </Page>
  </Document>
);

// Component to display the PDF
export default function OrdersPDFViewer({ orders }: { orders: Order[] | [] }) {
  const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@react-pdf/renderer').then((mod) => {
      setPDFViewer(() => mod.PDFViewer);
    });
  }, []);

  return PDFViewer ? (
    // @ts-expect-error: PDFViewer is not defined
    <PDFViewer height={600} width="100%">
      <OrdersPDF orders={orders} />
    </PDFViewer>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <p>Loading PDF Viewer...</p>
    </div>
  );
}
