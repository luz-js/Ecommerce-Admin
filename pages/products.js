import Layout from "@/components/Layout";
import Link from "next/link";
/** lo que esta adentro del layout es el children del componente**/
export default function Products(){
    return( 
        <Layout>
        <Link href={'/products/new'} className="inline-flex overflow-hidden text-white bg-blue rounded group">
            <span className="px-3.5 py-2 text-white bg-green flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </span>
            <span className="pl-4 pr-5 py-2.5">Add New Producst</span>
        </Link>
        </Layout>
    )
}