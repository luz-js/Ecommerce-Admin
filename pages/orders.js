
import Layout from "@/components/Layout";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 100,
  },
  section: {
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    paddingBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#495057'
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'right',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4f772d'
  },
});



// Función para generar el PDF de una orden específica
const generatePDF = (order) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
      <Text style={styles.header}>Factura Cliente DuoComp</Text>
        <Text style={styles.title}>Fecha: {(new Date(order.createdAt)).toLocaleString()}</Text>
        <Text style={styles.title}>Detalles:</Text>
        <Text style={styles.text}>Nombre: {order.name}</Text>
        <Text style={styles.text}>Email contacto: {order.email}</Text>
        <Text style={styles.text}>Ciuda: {order.city} {order.country}</Text>
        <Text style={styles.text}>Codigo postal: {order.postalCode} </Text>
        <Text style={styles.text}>Dirección: {order.streetAddress}</Text>
        <View style={styles.divider} />
        <Text style={styles.title}>Productos:</Text>
        {order.line_items.map(item => (
          <Text style={styles.text} key={item._id}>{item.price_data?.product_data.name} x{item.quantity}</Text>
        ))}
        <View style={styles.footer}>
          <Text>Total: {calculateTotal(order.line_items)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Función para calcular el total de la orden
const calculateTotal = (lineItems) => {
  let total = 0;
  lineItems.forEach(item => {
    total += item.price_data.unit_amount * item.quantity;
  });
  return `$${total / 100}`;
};

// Componente de la página de órdenes
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders')
      .then(response => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold text-center text-blue mt-4 font-serif">Órdenes</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Detalles</th>
            <th>Productos</th>
            <th>Factura</th> {/* Nueva columna para el botón de PDF */}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 && orders.map(order => (
            <tr key={order._id}>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td>
                {order.name} {order.email} 
                < br/>
                {order.city} {order.postalCode} {order.country}
                < br/>
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map(item => (
                  <div key={item._id}>
                    {item.price_data?.product_data.name} x{item.quantity}
                  </div>
                ))}
              </td>
              <td>
                <PDFDownloadLink document={generatePDF(order)} fileName={`order_${order._id}.pdf`}   className="btn-primary px-4 py-2 rounded-md text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105">
                  {({ loading }) => (loading ? 'Generando PDF...' : 'Imprimir factura(PDF)')}
                </PDFDownloadLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
