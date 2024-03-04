import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
/** lo que esta adentro del layout es el children del componente**/
export default function NewProducts(){
    return (
        <Layout>
            <h1 className="mb-8 text-3xl font-bold text-center text-blue mt-4 font-serif">Nuevo producto</h1>
            <ProductForm />
        </Layout>
    )
}
