import axios from "axios";
import { ref } from "vue";

const apiBaseURL = import.meta.env.VITE_API_URL;

export function useCategorias(snackbar, snackbarColor, snackbarMessage) {
  const data = ref([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(apiBaseURL + "categorias");
      data.value = response.data.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  };

  onMounted(() => {
    fetchItems();
  });
  const createItem = async (item) => {
    try {
      const response = await axios.post(apiBaseURL + "categorias", {
        Categoria: item.Categoria,
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
        apiBaseURL + "categorias/" + item.CategoriaID,
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
      await axios.delete(apiBaseURL + "categorias/" + id);
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
    fetchItems,
    createItem,
    deleteItemApi,
    editItem,
  };
}
