import { ref } from "vue";

export const useServicioLogica = (data, abrirDialog, abrirDialogEliminar) => {
  const servicioEditar = ref({
    servicio: "",
  });

  const servicioExiste = (nombreServicio, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.id === excludeId) {
        return false;
      }
      return item.categoria.toLowerCase() === nombreServicio.toLowerCase();
    });
  };

  const guardar = async () => {
    const { id, categoria } = servicioEditar.value;

    if (servicioExiste(categoria, id)) {
      alert("Este Servicio ya existe!");
      return;
    }

    if (id) {
      const index = data.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        data.value[index] = { ...servicioEditar.value };
      }
    } else {
      const ultimoID = Math.max(...data.value.map((item) => item.id), 1);
      const nuevoId = ultimoID + 1;

      const newItem = {
        id: nuevoId,
        servicio: servicio,
      };
      data.value.unshift(newItem);
    }
  };

  const abrirEditarServicio = (item) => {
    servicioEditar.value = {
      id: item.raw.id,
      categoria: item.raw.categoria,
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    servicioEditar.value = {
      categoria: "",
    };
    abrirDialog.value = true;
  };

  const close = () => {
    abrirDialog.value = false;
    servicioEditar.value = {};
  };
  const closeDelete = () => {
    abrirDialogEliminar.value = false;
    servicioEditar.value = {};
  };

  const abrirEliminarServicio = (item) => {
    servicioEditar.value = {
      id: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminarServicio = (itemId) => {
    const index = data.value.findIndex((item) => item.id === itemId.id);
    data.value.splice(index, 1);
    closeDelete();
  };

  return {
    servicioEditar,
    guardar,
    abrirEditarServicio,
    crearServicio,
    close,
    confirmarEliminarServicio,
    closeDelete,
    abrirEliminarServicio,
  };
};
