import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import HomeHeader from '@/components/HomeHeader';
import HomeStats from '@/components/HomeStats';

export default function Home() {
  const {data: session} = useSession();
  //console.log(session?.user)
  return(
    <Layout>
      <HomeHeader />
      <HomeStats />
    </Layout>
  )
}
