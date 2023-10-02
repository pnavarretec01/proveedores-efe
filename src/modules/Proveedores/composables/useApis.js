import axios from "axios";
import { ref } from "vue";

const apiBaseURL = import.meta.env.VITE_API_URL;

export function useApis(snackbar, snackbarColor, snackbarMessage) {
  const data = ref([]);
  const licitaciones = ref([])
  const totalItems = ref(0);

  const fetchItems = async (filters = {}, page = 1, itemsPerPage = 10) => {
    try {
      const response = await axios.get(apiBaseURL + "proveedores/filters", {
        params: {
          ...filters,
          page,
          limit: itemsPerPage,
        },
      });
      data.value = response.data.data;
      totalItems.value = response.data.total;
      return {
        data: data.value,
        total: totalItems.value,
      };
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      return {
        data: [],
        total: 0,
      };
    }
  };

  const createItem = async (item) => {
    console.log(item);
    return
    try {
      const response = await axios.post(apiBaseURL + "proveedores", {
        NombreProveedor: item.NombreProveedor,
        Referencia: item.Referencia,
        CodSap: item.CodSap,
        NroIdentificacion: item.NroIdentificacion,
        Poblacion: item.Poblacion,
        Calle: item.Calle,
        Direccion: item.Direccion,
      });
      data.value.unshift(response.data.data);
      snackbarMessage.value = "Elemento creado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  const editItem = async (item) => {
    try {
      const response = await axios.put(
        apiBaseURL + "proveedores/" + item.ProveedorID,
        item
      );
      snackbarMessage.value = "Elemento editado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
      return response.data.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  const deleteItemApi = async (id) => {
    try {
      await axios.delete(apiBaseURL + "proveedores/" + id);
      snackbarMessage.value = "Elemento eliminado con éxito";
      snackbarColor.value = "success";
      snackbar.value = true;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
      throw err;
    }
  };

  return {
    data,
    totalItems,
    fetchItems,
    createItem,
    deleteItemApi,
    editItem
  };
}
