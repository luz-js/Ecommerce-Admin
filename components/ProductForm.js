import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({

    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images,

    }){
        const [title, setTitle] = useState(existingTitle || '')
        const [description, setDescription] = useState(existingDescription || '')
        const [price, setPrice] = useState(existingPrice || '')
        const [goToProducts, setGoToProducts] = useState(false)
        const router = useRouter();
        console.log({_id})
    
        const onChangeTitle = (e) => {
            setTitle(e.target.value);
        }
    
        const onChangeDescription = (e) => {
            setDescription(e.target.value);
        }
    
        const onChangePrice = (e) => {
            setPrice(e.target.value);
        }
    
        async function saveProduct (e){
            e.preventDefault()
            const data = {title,description,price};
            if (_id) {
                //update
                await axios.put('/api/products', {...data, _id})
            }else{
                //create
                await axios.post('/api/products', data);
                
            }
            setGoToProducts(true);
        }
        //when we create the produtcs, this return us to de product page
        if (goToProducts) {
             router.push('/products')
        }

        async function uploadImages(e){
            const files = e.target?.files;
            console.log(files?.length)
            if (files?.length > 0) {
                const data = new FormData();
                for (const file of files){
                    data.append('file', file)
                }
                //const res = await axios.post('/api/upload', data);
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: data,
                })
                console.log(res.data);
            }
        }
    
        return (
                <form onSubmit={saveProduct}>
                    <label>Nombre de producto</label>
                    <input 
                        type="text" 
                        placeholder="Titulo" 
                        value={title} 
                        onChange={onChangeTitle}/>
                    <label>Fotos</label>
                    <div className="mb-3">
                        <label className="w-28 h-24 cursor-pointer border gap-1 text-lg flex justify-center items-center hover:text-green">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                            <input type="file" onChange={uploadImages} className="hidden"/>
                        </label>
                        {!images?.lenth && (
                            <div>No fotos disponibles</div>
                        )}
                    </div>
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
        )
}