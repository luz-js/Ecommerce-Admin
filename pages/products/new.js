import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
/** lo que esta adentro del layout es el children del componente**/
export default function NewProducts(){
    return (
        <Layout>
            <h1>Nuevo producto</h1>
            <ProductForm />
        </Layout>
    )
}
