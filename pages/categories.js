import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import Spinner from "@/components/Spinner";
import Swal from 'sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [parentCategory,setParentCategory] = useState('');
  const [categories,setCategories] = useState([]);
  const [properties,setProperties] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    setIsLoading(true);
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();

    if (!name.trim() || properties.some(p => !p.name.trim() || !p.values.trim())) {
      swal.fire({
        title: 'No se pueden guardar campos vacíos!',
        text: 'Por favor, complete todos los campos y en caso de no tener propiedades hijas, presione el botón REMOVER',
        icon: 'error',
      });
      return;
    }

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
      await axios.put('/api/categories', data).then(() => {
        Swal.fire({
            title: 'Categoría editada!',
            icon: 'success',
          });
    });
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data).then(() => {
        Swal.fire({
            title: 'Categoría agregada correctamente!',
            icon: 'success',
          });
    });
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
      text: `Quieres eliminar ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Sí, eliminar!',
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
  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold text-center text-blue mt-4 font-serif">Categorías </h1>
      <label>
        {editedCategory
          ? `Editar categoría ${editedCategory.name}`
          : 'Crear nueva categoría'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1 mt-2 mb-5">
          <input
            type="text"
            placeholder={'Category name'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
          <select
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
            <option value="0">Categoría padre</option>
            {categories.length > 0 && categories.filter(category => !category.parent).map(category => (
                <option key={category._id} value={category._id}>Categoría hija de: {category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-2">Propiedades</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
            disabled={!name|| !name.trim()}>
            Agregar nueva propiedad
          </button>
          {properties.length > 0 && properties.map((property,index) => (
            <div key={property.name} className="flex gap-1 mb-2">
              <input type="text"
                     value={property.name}
                     className="mb-0"
                     onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="property name (example: color)"/>
              <input type="text"
                     className="mb-0"
                     onChange={ev =>
                       handlePropertyValuesChange(
                         index,
                         property,ev.target.value
                       )}
                     value={property.values}
                     placeholder="values, comma separated"/>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                Remover
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-primary-two py-1 mb-5">Cancelar</button>
          )}
          <button type="submit"
                  className="btn-primary py-1 mb-5 transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={!name || !name.trim()}>
            Guardar
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
          <tr>
            <td>Nombre de categoría</td>
            <td>Categoría padre</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {isLoading && (
            <tr>
              <td colSpan={3}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {categories.length > 0 && categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category?.parent?.name ?? <p>Categoría padre</p>} </td>
              <td>
                <button
                  onClick={() => editCategory(category)}
                  className="btn-default mr-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="btn-red">Borrar</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal} />
));