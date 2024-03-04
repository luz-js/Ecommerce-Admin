import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {withSwal} from "react-sweetalert2";

function SettingsPage({swal}) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState('');
  const [shippingFeeError, setShippingFeeError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get('/api/products').then(res => {
      setProducts(res.data);
    });
    await axios.get('/api/settings?name=featuredProductId').then(res => {
      setFeaturedProductId(res?.data?.value);
    });
    await axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res?.data?.value);
    });
  }

  async function saveSettings() {
    if (!shippingFee.trim()) {
      setShippingFeeError('El campo "precio de venta" es obligatorio');
      return;
    }
    setIsLoading(true);
    await axios.put('/api/settings', {
      name: 'featuredProductId',
      value: featuredProductId,
    });
    await axios.put('/api/settings', {
      name: 'shippingFee',
      value: shippingFee,
    });
    setIsLoading(false);
    await swal.fire({
      title: 'Ajustes guardados correctamente!',
      icon: 'success',
    });
  }

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold text-center text-blue mt-4 font-serif">Ajustes</h1>
      {isLoading && (
        <Spinner />
      )}
      {!isLoading && (
        <>
          <label>Featured producto</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map(product => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <label>Precio de venta (en pesos)</label>
          <input type="number"
                 value={shippingFee}
                 onChange={ev => {setShippingFee(ev.target.value); setShippingFeeError('');}}
                 required    
          />
          {shippingFeeError && (
            <div style={{ color: 'red', marginBottom: '10px' }}>{shippingFeeError}</div>
          )}
          <div>
            <button onClick={saveSettings} className="btn-primary">Guardar ajustes</button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <SettingsPage swal={swal} />
));