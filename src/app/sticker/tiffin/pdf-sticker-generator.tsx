'use client';

import ReactPDF, {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Order = {
  orderId: string;
  deliveryDate: Date;
  order_type: 'pickup' | 'delivery';
  customerName: string;
  phone: string;
  note: string;
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
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
  sticker: {
    width: '50%',
    height: '12.5%',
    padding: 8,
    borderBottom: '1px dashed #000',
    borderRight: '1px dashed #000',
    boxSizing: 'border-box',
  },
  orderHeader: {
    borderBottom: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  datetime: {
    fontSize: 10,
    color: '#666',
  },
  customerInfo: {
    fontSize: 10,
    marginBottom: 3,
  },
  address: {
    fontSize: 9,
    marginTop: 3,
    color: '#444',
  },
});

// Kitchen Order Sticker component
const KitchenOrderSticker = ({ order }: { order: Order }) => {
  return (
    <View style={styles.sticker}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <Text style={styles.datetime}>
          {format(order.deliveryDate, 'dd/MM/yyyy')}
        </Text>
      </View>
      <Text style={styles.customerInfo}>
        {order.customerName} | {order.phone}
      </Text>
      <Text style={styles.address}>Note: {order.note}</Text>
    </View>
  );
};

const MyDocument = ({ orders }: { orders: Order[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Text style={styles.title}>Tiffin Order Stickers</Text>
        <Text style={styles.subtitle}>
          Printed on: {format(new Date(), 'MMMM d, yyyy HH:mm:ss')}
        </Text>
      </View>
      {orders.map((order) => (
        <KitchenOrderSticker key={order.orderId} order={order} />
      ))}
    </Page>
  </Document>
);

const PDFWithAutoPrint = ({ orders }: { orders: Order[] }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Create PDF Blob asynchronously
    const generateAndLoadPDF = async () => {
      try {
        const pdfBlob = await ReactPDF.pdf(
          <MyDocument orders={orders} />
        ).toBlob(); // Wait for the Blob to be generated
        if (pdfBlob) {
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Ensure the iframe has been loaded
          if (iframeRef.current) {
            iframeRef.current.src = pdfUrl;

            // Trigger the print dialog after the PDF is loaded into the iframe
            iframeRef.current.onload = () => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.print();
              }
            };
          }
        }
      } catch {
        toast.error('Error generating PDF');
      }
    };

    generateAndLoadPDF(); // Call the async function to generate and load the PDF
  }, [orders]);

  return (
    <div>
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFWithAutoPrint;
