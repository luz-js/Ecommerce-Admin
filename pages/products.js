import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
/** lo que esta adentro del layout es el children del componente**/
export default function Products(){

    const [products, setProducts] = useState([])

    //here, we are getting de existent data from our
    useEffect(() => {
        axios.get('/api/products')
        .then(response => {
            setProducts(response.data);
        })
    }, [])

    return( 
        <Layout>
        <Link href={'/products/new'} className="inline-flex overflow-hidden text-white bg-blue rounded group">
            <span className="px-3.5 py-2 text-white bg-green flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </span>
            <span className="pl-4 pr-5 py-2.5">Add New Producst</span>

        </Link>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
               <table className="w-full text-sm text-left text-blue">
                  <thead className="text-xs text-white uppercase bg-blue ">
                     <tr className="">
                        <th
                           scope="col" className="px-6 py-3">
                           Nombre de producto
                        </th>
                        <th
                           cscope="col" className="px-6 py-3"
                           >
                           Accion
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                        <tr className="bg-white border-b" >
                            <td
                            className="px-6 py-4"
                            >
                            {product.title}
                            </td>
                            <td
                            className="px-6 py-4"
                            >
                            <Link
                                                    //this +product._id comes from the database, is an default id 
                                href={'/products/edit/'+product._id}
                                className=" btn-green "
                                >
                            Editar
                            </Link>
                            <Link
                                                    //this +product._id comes from the database, is an default id 
                                href={'/products/delete/'+product._id}
                                className="btn-red"
                                >
                            Eliminar
                            </Link>
                            </td>
                        </tr>
                    ))}
                        
                  </tbody>
               </table>
            </div>
        </Layout>
    )
}