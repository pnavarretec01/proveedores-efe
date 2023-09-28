import axios from "axios";
import { onMounted, ref } from "vue";

const apiBaseURL = import.meta.env.VITE_API_URL;

export function useLicitacionesProveedores(
  snackbar,
  snackbarColor,
  snackbarMessage
) {
  const licitaciones = ref([]);

  const fetchLicitaciones = async () => {
    try {
      const response = await axios.get(apiBaseURL + "licitaciones");
      licitaciones.value = response.data.data;
      return response.data.data;
    } catch (err) {
      console.error("Error al obtener los items", err);
      snackbarMessage.value = "Error al obtener los items";
      snackbarColor.value = "error";
      snackbar.value = true;
    }
  };

  onMounted(fetchLicitaciones)

  return {
    fetchLicitaciones,
    licitaciones,
  };
}
