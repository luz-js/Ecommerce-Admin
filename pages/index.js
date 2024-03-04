import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import HomeHeader from '@/components/HomeHeader';
import HomeStats from '@/components/HomeStats';
import { useState, useEffect } from 'react';

export default function Home() {
  const {data: session} = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Actualiza la hora actual cada segundo
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // Ejecuta el efecto solo una vez al montar el componente

  //console.log(session?.user)
  return(
    <Layout>
      <HomeHeader />
      <div className="text-1xl font-bold text-green mt-4 font-serif">
        {currentTime.toLocaleString('es-ES', { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
        {/* Muestra el día de la semana, la hora, los minutos y los segundos */}
      </div>
      <HomeStats />
    </Layout>
  )
}
