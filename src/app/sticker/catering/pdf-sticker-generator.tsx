'use client';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

type Order = {
  id: string;
  deliveryDate: Date;
  order_type: 'pickup' | 'delivery';
  customerName: string;
  phone: string;
  note: string;
};

type CateringOrder = Order & {
  items: Array<{
    name: string;
    quantity: number;
    priceAtOrder: number;
    size: string;
  }>;
};

// Create styles
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

// PDF Document component
export default function CateringSheet({ orders }: { orders: CateringOrder[] }) {
  const [PDFViewer, setPDFViewer] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@react-pdf/renderer').then((mod) => {
      setPDFViewer(() => mod.PDFViewer);
    });
  }, []);

  return PDFViewer ? (
    // @ts-expect-error: PDFViewer is not defined
    <PDFViewer height={800} width="100%">
      <Document>
        {orders.length > 0 && (
          <Page size="A4" style={styles.page}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Text style={styles.title}>Catering Order Sheet</Text>
              <Text style={styles.subtitle}>
                Printed on: {format(new Date(), 'MMMM d, yyyy HH:mm:ss')}
              </Text>
            </View>
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
                    width: '20%',
                  }}
                >
                  <Text>Phone</Text>
                </View>
                <View
                  style={{
                    ...styles.tableColWide,
                    width: '20%',
                  }}
                >
                  <Text>Note</Text>
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
              {orders.map((order) => (
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
                      <Text>{order.customerName}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.tableCol,
                        width: '20%',
                      }}
                    >
                      <Text>{order.phone}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.tableColWide,
                        width: '20%',
                      }}
                    >
                      <Text>{order.note}</Text>
                    </View>
                    <View
                      style={{
                        ...styles.tableCol,
                        width: '10%',
                      }}
                    >
                      <Text
                        style={{
                          textTransform: 'capitalize',
                        }}
                      >
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
                          {item.name} [{item.size}] (x
                          {item.quantity}) - ${item.priceAtOrder}
                        </Text>
                      ))}
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </Page>
        )}
      </Document>
    </PDFViewer>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <p>Loading PDF Viewer...</p>
    </div>
  );
}
