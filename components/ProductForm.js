import { useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
// the rename of the const is because there is not confution between the validation
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,

    }){
        const [title, setTitle] = useState(existingTitle || '')
        const [description, setDescription] = useState(existingDescription || '')
        const [category,setCategory] = useState(assignedCategory || '');
        const [productProperties,setProductProperties] = useState(assignedProperties || {});
        const [price, setPrice] = useState(existingPrice || '')
        const [isUploading, setIsUploading] = useState(false);
        const [images,setImages] = useState(existingImages || []);
        const [goToProducts, setGoToProducts] = useState(false)
        const [categoriesLoading, setCategoriesLoading] = useState(false);
        const [categories,setCategories] = useState([]);
        const router = useRouter();
        console.log({_id})

        useEffect(() => {
            setCategoriesLoading(true);
            axios.get('/api/categories').then(result => {
              setCategories(result.data);
              setCategoriesLoading(false);
            })
          }, []);

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
            const data = {title,description,price,images,category,properties:productProperties};
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
                setIsUploading(true);
                const data = new FormData();
                for (const file of files){
                    data.append('file', file)
                }
                //const res = await axios.post('/api/upload', data);
                const res = await axios.post('/api/upload', data)
                setImages(oldImages => {
                    return [...oldImages, ...res.data.links];
                });
                setIsUploading(false);
                console.log(res.data.links);
            }        
        }
        function updateImagesOrder(images) {
            setImages(images);
        }

        function setProductProp(propName,value) {
            setProductProperties(prev => {
              const newProductProps = {...prev};
              newProductProps[propName] = value;
              return newProductProps;
            });
        }

        const propertiesToFill = [];
        if (categories.length > 0 && category) {
          let catInfo = categories.find(({_id}) => _id === category);
          propertiesToFill.push(...catInfo.properties);
          while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
          }
        }
    
        return (
                <form onSubmit={saveProduct}>
                    <label>Nombre de producto</label>
                    <input 
                        type="text" 
                        placeholder="TÍtulo" 
                        value={title} 
                        className="mt-2"
                        onChange={onChangeTitle}/>
                    <label>Categoría</label>
                    <select value={category}
                            className="mt-2"
                            onChange={ev => setCategory(ev.target.value)}>
                        <option value="">Sin categoría padre</option>
                        {categories.length > 0 && categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                    </select>
                    {categoriesLoading && (
                        <Spinner />
                    )}
                    {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                        <div key={p.name} className="">
                            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                            <div>
                            <select value={productProperties[p.name]}
                                    className="mt-2"
                                    onChange={ev =>
                                        setProductProp(p.name,ev.target.value)
                                    }
                            >
                                {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                            </div>
                        </div>
                    ))}
                    <label>Fotos</label>
                    <div className="mb-3 flex flex-wrap gap-1 mt-2">
                        <ReactSortable
                            list={images}
                            className="flex flex-wrap gap-1"
                            setList={updateImagesOrder}>
                            {!!images?.length && images.map(link => (
                            <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-sm border border-gray">
                                <img src={link} alt="" className="rounded-lg"/>
                            </div>
                            ))}
                        </ReactSortable>
                        {isUploading && (
                            <div className="h-24 flex items-center">
                            <Spinner />
                            </div>
                        )}
                        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-white rounded-sm bg-blue shadow-md border border-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <div>
                            Add image
                            </div>
                            <input type="file" onChange={uploadImages} className="hidden"/>
                        </label>
                    </div>
                    <label>Descripcion</label>
                    <textarea 
                        placeholder="Descripcion" 
                        value={description} 
                        onChange={onChangeDescription}
                        className="mt-2"
                        >
                    </textarea>
                    <label>Precio</label>
                    <input 
                        type="number" 
                        placeholder="Precio" 
                        value={price} 
                        className="mt-2"
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