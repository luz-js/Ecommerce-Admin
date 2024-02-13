import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'

export default function HomeHeader() {
  const {data: session} = useSession();
  //console.log(session?.user)
  return(
      <div className='text-slate-900 flex justify-between'>
        <h2>
          Bienvenido/a, {session?.user?.name}
        </h2>
        <div className='rounded-lg flex bg-blue text-white overflow-hidden'>
          <img src={session?.user?.image} alt='' className='rounded-lg w-10 h-10 mr-1'></img>
          <span className='p-2'>{session?.user?.email}</span>
        </div>
      </div>
  )
}