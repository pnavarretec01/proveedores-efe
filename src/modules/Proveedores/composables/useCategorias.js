import axios from "axios";
import { onMounted, ref } from "vue";

const apiBaseURL = import.meta.env.VITE_API_URL;

export function useCategorias(snackbar, snackbarColor, snackbarMessage) {
  const categorias = ref([]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(apiBaseURL + "categorias");
      categorias.value = response.data.data;
      return response.data.data;
    } catch (err) {
      console.error("Error al obtener los items", err);
      snackbarMessage.value = "Error al obtener los items";
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  };

  onMounted(fetchCategorias);

  return {
    fetchCategorias,
    categorias,
  };
}
