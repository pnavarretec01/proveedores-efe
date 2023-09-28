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
    NombreProveedor: "",
    Referencia: "",
    CodSap: "",
    NroIdentificacion: "",
    Poblacion: "",
    Calle: "",
    Direccion: "",
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.ProveedorID === excludeId) {
        return false;
      }
      return item.NombreProveedor.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    const { ProveedorID, NombreProveedor } = itemEditar.value;

    if (servicioExiste(NombreProveedor, ProveedorID)) {
      alert("Este Proveedor ya existe!");
      return;
    }

    try {
      if (ProveedorID) {
        await editItem(itemEditar.value);
        //await editar
        const index = data.value.findIndex(
          (item) => item.ProveedorID === ProveedorID
        );
        if (index !== -1) {
          data.value[index] = { ...itemEditar.value };
        }
      } else {
        const item = {
          ProveedorID: itemEditar.value.ProveedorID,
          NombreProveedor: itemEditar.value.NombreProveedor,
          Referencia: itemEditar.value.Referencia,
          CodSap: itemEditar.value.CodSap,
          NroIdentificacion: itemEditar.value.NroIdentificacion,
          Poblacion: itemEditar.value.Poblacion,
          Calle: itemEditar.value.Calle,
          Direccion: itemEditar.value.Direccion,
        };
        await createItem(item);
      }
      close();
    } catch (error) {
      console.error("Hubo un error al guardar el servicio.", error);
    }
  };

  const abrirEditarItem = (item) => {
    console.log(item.value);
    itemEditar.value = {
      ProveedorID: item.raw.ProveedorID,
      NombreProveedor: item.raw.NombreProveedor,
      Referencia: item.raw.Referencia,
      CodSap: item.raw.CodSap,
      NroIdentificacion: item.raw.NroIdentificacion,
      Poblacion: item.raw.Poblacion,
      Calle: item.raw.Calle,
      Direccion: item.raw.Direccion,
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    itemEditar.value = {
      NombreProveedor: "",
      Referencia: "",
      CodSap: "",
      NroIdentificacion: "",
      Poblacion: "",
      Calle: "",
      Direccion: "",
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
      ProveedorID: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminar = async (itemId) => {
    try {
      await deleteItemApi(itemId.ProveedorID.ProveedorID);
      const index = data.value.findIndex(
        (item) => item.ProveedorID === itemId.ProveedorID.ProveedorID
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
