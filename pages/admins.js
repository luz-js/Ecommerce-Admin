import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {withSwal} from "react-sweetalert2";
import Spinner from "@/components/Spinner";
import {prettyDate} from "@/lib/date";
import Swal from 'sweetalert2';

function AdminsPage({swal}) {
  const [email,setEmail] = useState('');
  const [adminEmails,setAdminEmails] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  function addAdmin(ev){
    ev.preventDefault();

    const emailExtension = email.split('@')[1];
    if (emailExtension !== 'gmail.com') {
      Swal.fire({
        icon: 'error',
        title: 'Introduce un correo válido',
        text: 'Recuerda que la extensión debe ser "Gmail.com".',
      });
      return; // Detener la función si la extensión no es "gmail.com"
    }else{
      axios.post('/api/admins', {email}).then(res => {
        console.log(res.data);
        swal.fire({
          title: 'Admin Creado!',
          icon: 'success',
        });
        setEmail('');
        loadAdmins();
      }).catch(err => {
        swal.fire({
          title: 'Error!',
          text: err.response.data.message,
          icon: 'error',
        });
      });
    }

    
  }
  function deleteAdmin(_id, email) {
    swal.fire({
      title: 'Estás seguro?',
      text: `Realmente deseas eliminar ${email}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, Eliminar!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        axios.delete('/api/admins?_id='+_id).then(() => {
          swal.fire({
            title: 'Admin Borrado!',
            icon: 'success',
          });
          loadAdmins();
        });
      }
    });
  }
  function loadAdmins() {
    setIsLoading(true);
    axios.get('/api/admins').then(res => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold text-center text-blue mt-4 font-serif">Administradores</h1>
      <h2 className="mb-2">Agregar nuevo admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            className="mb-0"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            placeholder="google email"/>
          <button
            type="submit"
            className="btn-primary py-1 whitespace-nowrap">
            Agregar admin
          </button>
        </div>
      </form>

      <h2 className="mb-2">Admins existentes</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Admin</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 && adminEmails.map(adminEmail => (
            <tr>
              <td>{adminEmail.email}</td>
              <td>
                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
              </td>
              <td>
                <button
                  onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} 
                  disabled={adminEmail.email === "lurita1308@gmail.com"} 
                  className={adminEmail.email === "lurita1308@gmail.com" ? "btn-gray" : "btn-red"}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <AdminsPage swal={swal} />
));