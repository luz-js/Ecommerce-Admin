import Layout from "@/components/Layout";
import { useState } from "react";
import axios  from "axios";
/** lo que esta adentro del layout es el children del componente**/
export default function NewProducts(){

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const onChangePrice = (e) => {
        setPrice(e.target.value);
    }

    async function createProduct (e){
        e.preventDefault()
        //this function means that the data in this form is send to the api/products
        const data = {title,description,price};
        await axios.post('/api/products', data);
    }

    return( 
        <Layout>
            <form onSubmit={createProduct}>
                <h1>Nuevo producto</h1>
                <label>Nombre de producto</label>
                <input 
                    type="text" 
                    placeholder="Nuevo Producto" 
                    value={title} 
                    onChange={onChangeTitle}/>
                <label>Descripcion</label>
                <textarea 
                    placeholder="Descripcion" 
                    value={description} 
                    onChange={onChangeDescription}>
                </textarea>
                <label>Precio</label>
                <input 
                    type="number" 
                    placeholder="Precio" 
                    value={price} 
                    onChange={onChangePrice}>
                </input>
                <button 
                    className="btn-primary" 
                    type="submit">
                    Guardar
                </button>
            </form>
            
        </Layout>
    )
}
