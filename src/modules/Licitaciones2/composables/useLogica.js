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
    Licitacion: "",
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.LicitacionID === excludeId) {
        return false;
      }
      return item.Licitacion.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    const { LicitacionID, Licitacion } = itemEditar.value;

    if (servicioExiste(Licitacion, LicitacionID)) {
      alert("Esta Licitacion ya existe!");
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
