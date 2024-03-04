import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { subHours, startOfMonth } from "date-fns";

export default function HomeStats() {
  //aqui almacenamos la data en el estado orders para poder usarlos en la vista de nuestro componente
  const [orders,setOrders] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  //usamos el useEffect cuando necesitamos hacer algo cuando un componente se monta
  //en este caso, lo usamos para el axios, cuando cargue nuestra pagina
  //y entonces cargamos nuestro estado orders con la data que viene de la base de datos 
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(res => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  //esto se usa para calcular la ganancia de las ordenes
  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach(order => {
      const {line_items} = order;
      line_items.forEach(li => {
        const lineSum = li.quantity * li.price_data.unit_amount / 100;
        sum += lineSum;
      });
    });
    console.log({orders});
    return new Intl.NumberFormat('sv-SE').format(sum);
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(o =>  new Date(o.createdAt) > subHours(new Date, 24));
  const ordersWeek = orders.filter(o =>  new Date(o.createdAt) > subHours(new Date, 24*7));
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const ordersMonth = orders.filter(o => new Date(o.createdAt) >= firstDayOfMonth);

  return (
    <div>
      <h1 className="mainTitle">Órdenes</h1>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">hoy</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">{ordersToday.length} órdenes hoy</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Esta semana</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">{ordersWeek.length} órdenes esta semana</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Este mes</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">{ordersMonth.length} órdenes este mes</div>
        </div>
      </div>
      <h1 className="mainTitle">Ganancia</h1>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hoy</h3>
          <div className="tile-number">$ {ordersTotal(ordersToday)}</div>
          <div className="tile-desc">{ordersToday.length} órdenes hoy</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Esta semana</h3>
          <div className="tile-number">$ {ordersTotal(ordersWeek)}</div>
          <div className="tile-desc">{ordersWeek.length} órdenes esta semana</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Este mes</h3>
          <div className="tile-number">$ {ordersTotal(ordersMonth)}</div>
          <div className="tile-desc">{ordersMonth.length} órdenes este mes</div>
        </div>
      </div>
    </div>
  );
}