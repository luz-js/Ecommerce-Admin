import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export default function DeleteProductPage (){

    const router = useRouter();
    const [productInfo, setProductInfo] = useState(null)
    const {id} = router.query;

    useEffect(() => {
      if (!id) {
        return
      }
      axios.get('/api/products?id='+id).then(response => {
        setProductInfo(response.data)
      })
    }, [id])
    

    const goBack = () => {
        router.push('/products');
    }

    const deleteProduct = async () => {
        await axios.delete('/api/products?id='+id);
        goBack();
    }

    return(
         <Layout>
            <h1 className="text-center">Realmente deseas eliminar "{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button onClick={deleteProduct} className="btn-red">Sí</button>
                <button onClick={goBack} className="btn-default">No</button>
            </div>
            
         </Layout>
    )
}