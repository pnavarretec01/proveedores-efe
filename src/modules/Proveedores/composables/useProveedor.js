import axios from "axios";
import { ref } from "vue";

export default function useProveedor(snackbar, snackbarColor, snackbarMessage) {
  const loading = ref(false);
  const error = ref(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  const agregarEliminarDato = async (proveedorID, endpoint, method, data) => {
    loading.value = true;
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        data: {
          proveedorID,
          ...data,
        },
      });
      snackbarMessage.value = "Elemento creado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const eliminarContactoApi = async (proveedorID, endpoint, method, data) => {
    try {
      const response = await axios.delete(
        `${baseUrl}contactos/${data.ContactoID}`
      );
      snackbarMessage.value = "Elemento eliminado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const agregarContactoApi = async (proveedorID, endpoint, method, data) => {
    let response;

    try {
      if (data.ContactoID) {
        response = await axios.put(`${baseUrl}contactos/${data.ContactoID}`, {
          ProveedorID: proveedorID,
          NombreContacto: data.NombreContacto,
          Email: data.Email,
          Telefono: data.Telefono,
        });
      } else {
        response = await axios.post(`${baseUrl}contactos/`, {
          ProveedorID: proveedorID,
          NombreContacto: data.NombreContacto,
          Email: data.Email,
          Telefono: data.Telefono,
        });
      }
      snackbarMessage.value = "Proceso realizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;

      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  //licitaciones proveedor
  const agregarLicitacionApi = async (proveedorID, endpoint, method, data) => {
    loading.value = true;
    try {
      const response = await axios.post(`${baseUrl}licitacionesProveedor`, {
        LicitacionID: data.LicitacionID,
        ProveedorID: proveedorID,
        Adjudicado: false,
      });
      snackbarMessage.value = "Proceso realizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const eliminarLicitacionApi = async (data) => {
    try {
      const response = await axios.delete(
        `${baseUrl}licitacionesProveedor/${data.LicitacionProveedor.LicProvID}`
      );
      snackbarMessage.value = "Proceso realizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAdjudicadoStatusApi = async (LicProvID, estado) => {

    try {
      const response = await axios.put(
        `${baseUrl}licitacionesProveedor/${LicProvID}/adjudicado`,
        {
          Adjudicado: estado,
        }
      );
      snackbarMessage.value = "Estado adjudicado actualizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  //categorias proveedor

  const agregarCategoriaApi = async (ProveedorID, CategoriaID, SubCategoriaID) => {
    try {
      const response = await axios.post(`${baseUrl}categoriasProveedor`, {
        ProveedorID: ProveedorID,
        CategoriaID: CategoriaID,
        SubCategoriaID: SubCategoriaID
      });
      snackbarMessage.value = "Proceso realizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  const eliminarCategoriaApi = async (CatProID) => {
    try {
      const response = await axios.delete(
        `${baseUrl}categoriasProveedor/${CatProID}`
      );
      snackbarMessage.value = "Proceso realizado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data;
      return response.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  const getSubcategoriasByCategoria = async (categoriaID) => {
    try {
        const response = await axios.get(`${baseUrl}subcategorias/byCategoria/${categoriaID}`);
        console.log(response.data.data);
        return response.data.data;
    } catch (err) {
        snackbarMessage.value = err.response.data.message;
        snackbarColor.value = "error";
        snackbar.value = true;
        throw err;
    }
};


  return {
    loading,
    error,
    agregarEliminarDato,
    eliminarContactoApi,
    agregarContactoApi,
    agregarLicitacionApi,
    eliminarLicitacionApi,
    agregarCategoriaApi,
    eliminarCategoriaApi,
    updateAdjudicadoStatusApi,
    getSubcategoriasByCategoria
  };
}
