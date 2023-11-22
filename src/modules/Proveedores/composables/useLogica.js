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
      Estado: 0,
      Observacion: "",
      Ariba: "",
    },
    licitaciones: [],
    contactos: [],
    categoriasProveedor: [],
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.ProveedorID === excludeId) {
        return false;
      }
      return item.NombreProveedor.toLowerCase() === nombre.toLowerCase();
    });
  };

  function validateForm(proveedor) {
    if (!proveedor.NombreProveedor) {
      snackbarMessage.value = "Por favor, ingrese un Nombre Proveedor.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    if (!proveedor.Referencia) {
      snackbarMessage.value = "Por favor, ingrese una Referencia.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    if (!proveedor.CodSap) {
      snackbarMessage.value = "Por favor, ingrese un CodSap.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    if (!proveedor.NroIdentificacion) {
      snackbarMessage.value = "Por favor, ingrese un Nro Identificación.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    // if (!proveedor.Poblacion) {
    //   snackbarMessage.value = "Por favor, ingrese una Población.";
    //   snackbarColor.value = "info";
    //   snackbar.value = true;
    //   return false;
    // }
    if (!proveedor.Calle) {
      snackbarMessage.value = "Por favor, ingrese una Calle.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }
    // if (!proveedor.Ariba) {
    //   snackbarMessage.value = "Por favor, ingrese el código Ariba.";
    //   snackbarColor.value = "info";
    //   snackbar.value = true;
    //   return false;
    // }

    return true;
  }

  function mapDatosEditarToDataValue(datos) {
    return {
      ...datos.proveedor,
      Licitaciones: datos.licitaciones,
      Contactos: datos.contactos,
      CategoriasProveedor: datos.categoriasProveedor,
    };
  }

  const guardarItem = async (datos) => {
    const { proveedor, licitaciones, contactos } = datosEditar.value;
    if (!validateForm(proveedor)) {
      return;
    }
    const { ProveedorID, NombreProveedor } = proveedor;

    if (servicioExiste(NombreProveedor, ProveedorID)) {
      snackbarMessage.value = "Ya existe un Proveedor con este nombre.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return;
    }

    const proveedorCompleto = {
      ...proveedor,
      licitaciones: licitaciones,
      contactos: contactos,
    };

    try {
      if (ProveedorID) {
        await editItem(proveedorCompleto);
        const index = data.value.findIndex(
          (item) => item.ProveedorID === ProveedorID
        );
        if (index !== -1) {
          data.value[index] = mapDatosEditarToDataValue(datosEditar.value);
          close();
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
        Estado: item.raw.Estado,
        Observacion: item.raw.Observacion,
        Ariba: item.raw.Ariba,
      },
      licitaciones: item.raw.Licitaciones || [],
      contactos: item.raw.Contactos || [],
      categoriasProveedor: item.raw.CategoriasProveedor || [],
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
        Estado: 0,
        Observacion: "",
        Ariba: "",
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
        Estado: 0,
        Observacion: "",
        Ariba: "",
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
        Estado: 0,
        Observacion: "",
        Ariba: "",
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
      await deleteItemApi(itemId.ProveedorID);
      const index = data.value.findIndex(
        (item) => item.ProveedorID === itemId.ProveedorID
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
