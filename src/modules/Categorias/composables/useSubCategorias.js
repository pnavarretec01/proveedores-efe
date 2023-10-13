import axios from "axios";
import { ref } from "vue";

const apiBaseURL = import.meta.env.VITE_API_URL;

export function useSubCategorias(snackbar, snackbarColor, snackbarMessage) {
  const dataSubCategorias = ref([]);
  const dataCategorias = ref([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(apiBaseURL + "subcategorias");
      dataSubCategorias.value = response.data.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  };
  const fetchItemsCategorias = async () => {
    try {
      const response = await axios.get(apiBaseURL + "categorias");
      dataCategorias.value = response.data.data;
    } catch (err) {
      snackbarMessage.value = err.response.data.message;
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  };

  const createSubCategoriaApi = async (item) => {
    try {
      const response = await axios.post(apiBaseURL + "subcategorias", {
        SubCategoria: item.SubCategoria,
        CategoriaID: item.CategoriaID,
      });
      dataSubCategorias.value.unshift(response.data.data);
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

  const editSubCategoriaApi = async (item) => {
    try {
      const response = await axios.put(
        apiBaseURL + "subcategorias/" + item.SubCategoriaID,
        {
          SubCategoriaID: item.SubCategoriaID,
          SubCategoria: item.SubCategoria,
          CategoriaID: item.Categoria,
        }
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

  const deleteSubCategoriaApi = async (id) => {
    try {
      await axios.delete(apiBaseURL + "subcategorias/" + id);
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

  onMounted(() => {
    fetchItems();
    fetchItemsCategorias();
  });

  return {
    dataSubCategorias,
    dataCategorias,
    fetchItems,
    createSubCategoriaApi,
    deleteSubCategoriaApi,
    editSubCategoriaApi,
  };
}
