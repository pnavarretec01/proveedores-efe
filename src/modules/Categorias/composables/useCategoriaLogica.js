import { ref } from "vue";

export const useCategoriaLogica = (
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
    categoria: "",
  });

  function validateForm(item) {
    if (!item.Categoria) {
      snackbarMessage.value = "Por favor, ingrese una Categoría.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }

    return true;
  }

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.CategoriaID === excludeId) {
        return false;
      }
      return item.Categoria.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    if (!validateForm(itemEditar.value)) {
      return;
    }
    const { CategoriaID, Categoria } = itemEditar.value;

    if (servicioExiste(Categoria, CategoriaID)) {
      snackbarMessage.value = "Ya existe una Categoría con este nombre.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return;
    }

    try {
      if (CategoriaID) {
        await editItem(itemEditar.value);
        //await editar
        const index = data.value.findIndex(
          (item) => item.CategoriaID === CategoriaID
        );
        if (index !== -1) {
          data.value[index] = { ...itemEditar.value };
        }
      } else {
        const item = {
          CategoriaID: itemEditar.value.CategoriaID,
          Categoria: itemEditar.value.Categoria,
        };
        await createItem(item);
      }
      close();
    } catch (error) {
      console.error("Hubo un error al guardar el servicio.", error);
    }
  };

  const abrirEditarCategoria = (item) => {
    itemEditar.value = {
      CategoriaID: item.raw.CategoriaID,
      Categoria: item.raw.Categoria,
    };
    abrirDialog.value = true;
  };

  const crearCategoria = () => {
    itemEditar.value = {
      Categoria: "",
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

  const abrirEliminarCategoria = (item) => {
    itemEditar.value = {
      CategoriaID: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminarCategoria = async (itemId) => {
    try {
      await deleteItemApi(itemId.CategoriaID.CategoriaID);
      const index = data.value.findIndex(
        (item) => item.CategoriaID === itemId.CategoriaID.CategoriaID
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
    abrirEditarCategoria,
    crearCategoria,
    close,
    confirmarEliminarCategoria,
    closeDelete,
    abrirEliminarCategoria,
  };
};
