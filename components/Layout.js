import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/nav'
import { useEffect } from "react"
//this is the luz mariel project
export default function Layout({children}) {
  const { data: session } = useSession()
 
    if (!session) {
      async function login() {
        await signIn('google');
      }
      return (
      <div className='w-screen h-screen flex items-center justify-center bg-blue'>
        <div className='text-center w-96  flex flex-col items-center bg-white rounded-lg p-5'>
          <img src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?w=1480&t=st=1707838017~exp=1707838617~hmac=f3c1a0fe6caaaad3187b4a9e4d578cdfa225f6eef6425eedfbc585eca8580899" />
          {/*<button onClick={(e) => signIn('google')} className='bg-white p-2 px-4 rounded-lg'>Ingresa con Google</button>*/}
          <button onClick={login} class="px-8 py-2 mt-5 mb-5 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
              <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
              <span>Ingresar con Google</span>
          </button>
          <button onClick={(e) => signIn('facebook')} class="px-6 py-2 mb-5 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
              <img class="w-6 h-6" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/facebook-round-color-icon.png" loading="lazy" alt="google logo" />
              <span>Ingresar con Facebook</span>
          </button>

          <p className="mt-5 text-xs">Acceso permitido solo para administradores</p>
          <p className="text-xs">No se permite Registro</p>
        </div>
      </div>
      )
    }
    
    return(
      <div className='bg-blue min-h-screen flex'>
        <Nav />                          {/*el children significa que se visualizara dependiendo de lo que rendericemos */}
        <div className='bg-bgGray text-blue flex-grow rounded-l-md p-4'> {children} </div>
      </div>
      
    )
}
