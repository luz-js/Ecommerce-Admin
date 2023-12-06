import Layout from "@/components/Layout";
import {useEffect, useState} from "react"
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);

    useEffect(() => {
        fetchCategories(); 
    }, [])
    
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
          setCategories(result.data);
        });
    }

    async function saveCategory(e) {
        e.preventDefault();
        const data = {name,parentCategory}
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
          } else {
            await axios.post('/api/categories', data);
          }
        setName('')
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }
    function deleteCategory(category){
        swal.fire({
          title: 'Estás seguro?',
          text: `Quieres eliminar ${category?.name}?`,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Sí, borrar!',
          confirmButtonColor: '#d55',
          reverseButtons: true,
        }).then(async result => {
          if (result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id='+_id);
            fetchCategories();
          }
        });
      }

    return(
        <Layout>
            <h1>Categorías</h1>
            <label>{editedCategory ? `Editar Categoría ${editCategory.name}` : 'Crear nueva categoría'}</label>
            <form onSubmit={saveCategory} className="flex items-center gap-1">
                <input 
                    type="text" 
                    className="mb-0 rounded-md"
                    placeholder="Category name"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                <select className="mb-0 rounded-md h-10" onChange={e => setParentCategory(e.target.value)} value={parentCategory}>
                    <option value="0">No parent category</option>
                    {categories?.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button 
                    className="btn-primary" 
                    type="submit">
                    Guardar
                </button>
            </form>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
              <table className="basic">
                <thead className="text-xs text-white uppercase bg-blue">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre de la categoría</th>
                        <th scope="col" className="px-6 py-3">Categoría padre</th>
                        <th scope="col"></th>
                    </tr>    
                </thead> 
                <tbody>
                    {categories?.length > 0 && categories.map(category => (
                        <tr className="bg-white border-b ">
                            <td className="px-6 py-4 border-r">{category.name}</td>
                            <td className="px-6 py-4 border-r text-center">{category?.parent?.name}</td>
                            <td>
                                <button className="btn-primary mr-2" onClick={() => editCategory(category)}>Editar</button>
                                <button className="btn-primary" onClick={() => deleteCategory(category)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>               
            </table>  
            </div>
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  ));