import Layout from "@/components/Layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Swal from 'sweetalert2';

export default function Products() {
  const [products,setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      setIsLoading(false);
    });
  }, []);

  const deleteProduct = async (id) => {
    // Mostrar la alerta de Swal para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará permanentemente el producto.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        // Si el usuario confirma la eliminación, procede con la solicitud de eliminación
        if (result.isConfirmed) {
            try {
                await axios.delete('/api/products?id=' + id);
                // Mostrar una alerta de éxito después de eliminar el producto
                Swal.fire({
                    title: 'Producto eliminado',
                    text: 'El producto ha sido eliminado correctamente.',
                    icon: 'success'
                });
                // Realizar cualquier otra lógica necesaria después de eliminar el producto
                loadAdmins();
            } catch (error) {
                // Manejar errores si la solicitud de eliminación falla
                console.error('Error al eliminar el producto:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al intentar eliminar el producto. Por favor, inténtalo de nuevo más tarde.',
                    icon: 'error'
                });
            }
        }
    });
};


function loadAdmins() {
  setIsLoading(true);
  axios.get('/api/products').then(res => {
    setProducts(res.data);
    setIsLoading(false);
  });
}
useEffect(() => {
  loadAdmins();
}, []);
  return (
    <Layout>
      <Link className="btn-primary" href={'/products/new'}>Agregar nuevo producto</Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Nombre de producto</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
        {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>
                <Link className="btn-default" href={'/products/edit/'+product._id}>
                  Editar
                </Link>
                <button className=" btn-red text-sm" onClick={() => deleteProduct(product._id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}