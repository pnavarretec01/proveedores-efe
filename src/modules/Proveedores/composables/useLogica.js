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
  const datosEditar = ref({
    proveedor: {
      ProveedorID: "",
      NombreProveedor: "",
      Referencia: "",
      CodSap: "",
      NroIdentificacion: "",
      Poblacion: "",
      Calle: "",
      Direccion: "",
    },
    licitaciones: [],
    contactos: [],
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.ProveedorID === excludeId) {
        return false;
      }
      return item.NombreProveedor.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardarItem = async (datos) => {
    console.log("Datos recibidos en guardar:", datos);

    const { proveedor, licitaciones, contactos } = datosEditar.value;
    const { ProveedorID, NombreProveedor } = proveedor;
    return;

    if (servicioExiste(NombreProveedor, ProveedorID)) {
      alert("Este Proveedor ya existe!");
      return;
    }

    const proveedorCompleto = {
      ...proveedor,
      licitaciones: licitaciones,
      contactos: contactos,
    };

    try {
      if (ProveedorID) {
        return;
        await editItem(proveedorCompleto);
        //await editar
        const index = data.value.findIndex(
          (item) => item.ProveedorID === ProveedorID
        );
        if (index !== -1) {
          data.value[index] = { ...itemEditar.value };
        }
      } else {
        await createItem(datosEditar.value);
      }
      close();
    } catch (error) {
      console.error("Hubo un error al guardar el servicio.", error);
    }
  };

  const abrirEditarItem = (item) => {
    datosEditar.value = {
      proveedor: {
        ProveedorID: item.raw.ProveedorID,
        NombreProveedor: item.raw.NombreProveedor,
        Referencia: item.raw.Referencia,
        CodSap: item.raw.CodSap,
        NroIdentificacion: item.raw.NroIdentificacion,
        Poblacion: item.raw.Poblacion,
        Calle: item.raw.Calle,
        Direccion: item.raw.Direccion,
      },
      licitaciones: item.raw.Licitaciones || [],
      contactos: item.raw.Contactos || [],
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    datosEditar.value = {
      proveedor: {
        NombreProveedor: "",
        Referencia: "",
        CodSap: "",
        NroIdentificacion: "",
        Poblacion: "",
        Calle: "",
        Direccion: "",
      },
      licitaciones: [],
      contactos: [],
    };
    abrirDialog.value = true;
  };

  const close = () => {
    abrirDialog.value = false;
    datosEditar.value = {
      proveedor: {
        NombreProveedor: "",
        Referencia: "",
        CodSap: "",
        NroIdentificacion: "",
        Poblacion: "",
        Calle: "",
        Direccion: "",
      },
      licitaciones: [],
      contactos: [],
    };
  };
  const closeDelete = () => {
    abrirDialogEliminar.value = false;
    datosEditar.value = {
      proveedor: {
        NombreProveedor: "",
        Referencia: "",
        CodSap: "",
        NroIdentificacion: "",
        Poblacion: "",
        Calle: "",
        Direccion: "",
      },
      licitaciones: [],
      contactos: [],
    };
  };

  const abrirEliminarItem = (item) => {
    datosEditar.value = {
      ProveedorID: item.ProveedorID,
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
    datosEditar,
    guardarItem,
    abrirEditarItem,
    crearServicio,
    close,
    confirmarEliminar,
    closeDelete,
    abrirEliminarItem,
  };
};
