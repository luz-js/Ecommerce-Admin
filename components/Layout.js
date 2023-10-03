import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/nav'
import { useEffect } from "react"

export default function Layout({children}) {
  const { data: session } = useSession()
 
    if (!session) {
      return (
      <div className='bg-blue w-screen h-screen flex items-center'>
        <div className='text-center w-full'>
          <button onClick={(e) => signIn('google')} className='bg-white p-2 px-4 rounded-lg'>Login with google</button>
        </div>
      </div>
      )
    }
    
    return(
      <div className='bg-blue min-h-screen flex'>
        <Nav />                          {/*el children significa que se visualizara dependiendo de lo que rendericemos */}
        <div className='bg-white text-blue flex-grow mt-2 mr-2 rounded-lg p-4'> {children} </div>
      </div>
      
    )
}
