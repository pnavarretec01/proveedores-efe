import { ref } from "vue";

export const useLogica = (
  data,
  abrirDialog,
  abrirDialogEliminar,
  snackbar,
  snackbarColor,
  snackbarMessage,
  createItem,
  deleteItemApi,
  editItem
) => {
  const itemEditar = ref({
    Solped: "",
    Licitacion: "",
  });

  function validateForm(item) {
    if (!item.Licitacion) {
      snackbarMessage.value = "Por favor, ingrese una Licitación.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    if (!item.Solped) {
      snackbarMessage.value = "Por favor, ingrese Solped.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }

    return true;
  }

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.LicitacionID === excludeId) {
        return false;
      }
      return item.Licitacion.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    if (!validateForm(itemEditar.value)) {
      return;
    }
    const { LicitacionID, Licitacion } = itemEditar.value;

    if (servicioExiste(Licitacion, LicitacionID)) {
      snackbarMessage.value = "Ya existe una Licitación con este nombre.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return;
    }

    try {
      if (LicitacionID) {
        await editItem(itemEditar.value);
        //await editar
        const index = data.value.findIndex(
          (item) => item.LicitacionID === LicitacionID
        );
        if (index !== -1) {
          data.value[index] = { ...itemEditar.value };
        }
      } else {
        const item = {
          LicitacionID: itemEditar.value.LicitacionID,
          Licitacion: itemEditar.value.Licitacion,
          Solped: itemEditar.value.Solped,
        };
        await createItem(item);
      }
      close();
    } catch (error) {
      console.error("Hubo un error al guardar el servicio.", error);
    }
  };

  const abrirEditarItem = (item) => {
    itemEditar.value = {
      LicitacionID: item.raw.LicitacionID,
      Licitacion: item.raw.Licitacion,
      Solped: item.raw.Solped,
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    itemEditar.value = {
      Licitacion: "",
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
      LicitacionID: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminar = async (itemId) => {
    try {
      await deleteItemApi(itemId.LicitacionID.LicitacionID);
      const index = data.value.findIndex(
        (item) => item.LicitacionID === itemId.LicitacionID.LicitacionID
      );
      if (index !== -1) {
        data.value.splice(index, 1);
      }
      closeDelete();
    } catch (error) {
      console.error("Hubo un error al eliminar el servicio.", error);
    }
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
