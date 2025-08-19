'use client';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

type Order = {
  id: string;
  store: string;
  customer: string;
  phone: string;
  address: string;
  order_type: string;
};

type CateringOrder = Order & {
  items: Array<{
    name: string;
    quantity: number;
    priceAtOrder: number;
  }>;
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
    width: '20%',
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
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 7,
  },
  tableColWide: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 7,
  },
});

type OrderViewerProps = {
  date: Date | string;
  cateringOrders: CateringOrder[] | [];
  tiffinOrders: Order[] | [];
};

// Updated PDF document component
const OrdersPDF = ({
  date,
  cateringOrders,
  tiffinOrders,
}: OrderViewerProps) => (
  <Document>
    {cateringOrders.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Scheduled Orders Report for {format(date, 'MMMM d, yyyy')}
        </Text>
        <Text style={styles.subtitle}>
          Printed on: {format(new Date(), 'MMMM d, yyyy HH:mm:ss')}
        </Text>
        <Text style={styles.title}>Catering Orders</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View
              style={{
                ...styles.tableColHeader,
                width: '15%',
              }}
            >
              <Text>Order ID</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: '15%',
              }}
            >
              <Text>Customer</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: '10%',
              }}
            >
              <Text>Phone</Text>
            </View>
            <View
              style={{
                ...styles.tableColWide,
                width: '30%',
              }}
            >
              <Text>Address</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: '10%',
              }}
            >
              <Text>Type</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: '20%',
              }}
            >
              <Text>Items</Text>
            </View>
          </View>
          {/* Table Body */}
          {cateringOrders.map((order) => (
            <React.Fragment key={order.id}>
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '15%',
                  }}
                >
                  <Text>{order.id}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '15%',
                  }}
                >
                  <Text>{order.customer}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '10%',
                  }}
                >
                  <Text>{order.phone}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableColWide,
                    width: '30%',
                  }}
                >
                  <Text>{order.address}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '10%',
                  }}
                >
                  <Text style={{ textTransform: 'capitalize' }}>
                    {order.order_type}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '20%',
                  }}
                >
                  {order.items?.map((item) => (
                    <Text key={item.name}>
                      {item.name} (x{item.quantity}) - ${item.priceAtOrder}
                    </Text>
                  ))}
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      </Page>
    )}
    {tiffinOrders.length > 0 && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Scheduled Orders Report for {format(date, 'MMMM d, yyyy')}
        </Text>
        <Text style={styles.subtitle}>
          Printed on: {format(new Date(), 'MMMM d, yyyy HH:mm:ss')}
        </Text>
        <Text style={styles.title}>Tiffin Orders</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Order ID</Text>
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
              <Text>Type</Text>
            </View>
          </View>
          {/* Table Body */}
          {tiffinOrders.map((order) => (
            <React.Fragment key={order.id}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>{order.id}</Text>
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
                  <Text style={{ textTransform: 'capitalize' }}>
                    {order.order_type}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      </Page>
    )}
  </Document>
);

// Component to display the PDF
export default function OrdersPDFViewer({
  date,
  cateringOrders,
  tiffinOrders,
}: OrderViewerProps) {
  const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@react-pdf/renderer').then((mod) => {
      setPDFViewer(() => mod.PDFViewer);
    });
  }, []);

  return PDFViewer ? (
    // @ts-expect-error: PDFViewer is not defined
    <PDFViewer height={600} width="100%">
      <OrdersPDF
        cateringOrders={cateringOrders}
        date={date}
        tiffinOrders={tiffinOrders}
      />
    </PDFViewer>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <p>Loading PDF Viewer...</p>
    </div>
  );
}
