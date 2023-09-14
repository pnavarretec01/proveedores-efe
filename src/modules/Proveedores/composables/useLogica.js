import { ref } from "vue";

export const useLogica = (data, abrirDialog, abrirDialogEliminar) => {
  const itemEditar = ref({
    nombreProveedor: "",
    referencia: "",
    codSAP: "",
    nroIdentificacion: "",
    ps: "",
    poblacion: "",
    calle: "",
    direccion: "",
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
    const { id, categoria } = itemEditar.value;

    if (servicioExiste(categoria, id)) {
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
        licitacion: servicio,
      };
      data.value.unshift(newItem);
    }
  };

  const abrirEditarItem = (item) => {
    itemEditar.value = {
      id: item.raw.id,
      nombreProveedor: item.raw.nombreProveedor,
      referencia: item.raw.referencia,
      codSAP: item.raw.codSAP,
      nroIdentificacion: item.raw.nroIdentificacion,
      ps: item.raw.ps,
      poblacion: item.raw.poblacion,
      calle: item.raw.calle,
      direccion: item.raw.direccion,
    };
    abrirDialog.value = true;
  };

  const crearServicio = () => {
    itemEditar.value = {
      nombreProveedor: "",
      referencia: "",
      codSAP: "",
      nroIdentificacion: "",
      ps: "",
      poblacion: "",
      calle: "",
      direccion: "",
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
