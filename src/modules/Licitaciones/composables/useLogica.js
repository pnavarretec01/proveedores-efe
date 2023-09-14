import { ref } from "vue";

export const useLogica = (data, abrirDialog, abrirDialogEliminar) => {
  const itemEditar = ref({
    licitacion: "",
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.id === excludeId) {
        return false;
      }
      return item.categoria.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    const { id, licitacion } = itemEditar.value;

    if (servicioExiste(licitacion, id)) {
      alert("Este Servicio ya existe!");
      return;
    }

    if (id) {
      const index = data.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        data.value[index] = { ...itemEditar.value };
      }
    } else {
      const ultimoID = Math.max(...data.value.map((item) => item.id), 1);
      const nuevoId = ultimoID + 1;

      const newItem = {
        id: nuevoId,
        licitacion: licitacion,
      };
      data.value.unshift(newItem);
    }
  };

  const abrirEditarItem = (item) => {
    itemEditar.value = {
      id: item.raw.id,
      categoria: item.raw.categoria,
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    itemEditar.value = {
      categoria: "",
    };
    abrirDialog.value = true;
  };

  const close = () => {
    abrirDialog.value = false;
    itemEditar.value = {};
  };
  const closeDelete = () => {
    abrirDialogEliminar.value = false;
    itemEditar.value = {};
  };

  const abrirEliminarItem = (item) => {
    itemEditar.value = {
      id: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminar = (itemId) => {
    const index = data.value.findIndex((item) => item.id === itemId.id);
    data.value.splice(index, 1);
    closeDelete();
  };

  return {
    itemEditar,
    guardar,
    abrirEditarItem,
    crearServicio,
    close,
    confirmarEliminar,
    closeDelete,
    abrirEliminarItem,
  };
};
