import Layout from "@/components/Layout";
import {useEffect, useState} from "react"
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories,setCategories] = useState([]);
    const [properties,setProperties] = useState([]);

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
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => ({
              name:p.name,
              values:p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
          } else {
            await axios.post('/api/categories', data);
          }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
          category.properties.map(({name,values}) => ({
          name,
          values:values.join(',')
        }))
        );
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

      function addProperty() {
        setProperties(prev => {
          return [...prev, {name:'',values:''}];
        });
      }

      function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].name = newName;
          return properties;
        });
      }

      function handlePropertyValuesChange(index,property,newValues) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].values = newValues;
          return properties;
        });
      }

      function removeProperty(indexToRemove) {
        setProperties(prev => {
          return [...prev].filter((p,pIndex) => {
            return pIndex !== indexToRemove;
          });
        });
      }

    return(
        <Layout>
            <h1 className="mb-5">Categorías</h1>
            <label>{editedCategory ? `Editar Categoría ${editCategory.name}` : 'Crear nueva categoría'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex items-center gap-1">
                    <input 
                        type="text" 
                        className="mt-2 rounded-md"
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
                </div>
                <div className="mb-2">
                    <label className="block mt-2">Propiedades</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-primary mt-2">
                        Agregar nueva propiedad
                    </button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div className="flex gap-1 mb-2">
                            <input type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                                placeholder="Nombre (ejemplo: color)"/>
                            <input type="text"
                                value={property.values}
                                className="mb-0"
                                onChange={ev =>
                                handlePropertyValuesChange(
                                    index,
                                    property,ev.target.value
                                )}
                                placeholder="valor, separar con coma"/>
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-red">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                 <div className="flex gap-1">
                    {editedCategory && (
                        <button type="button" className="btn-red" onClick={() => {
                            setEditedCategory(null); setName('');
                            setParentCategory('');
                            setProperties([])}}>Cancelar</button>
                    )}
                    <button 
                        className="btn-green mt-2" 
                        type="submit">
                        Guardar
                    </button>    
                 </div>
                 
                
            </form>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                {!editedCategory && (
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
                                        <button className="btn-green mt-1 mr-2" onClick={() => editCategory(category)}>Editar</button>
                                        <button className="btn-red" onClick={() => deleteCategory(category)}>Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>               
                    </table>
                )}
              
            </div>
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  ));