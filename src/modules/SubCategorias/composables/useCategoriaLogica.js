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
    SubCategoria: "",
  });

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.SubCategoriaID === excludeId) {
        return false;
      }
      return item.Categoria.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardar = async () => {
    const { SubCategoriaID, SubCategoria, Categoria } = itemEditar.value;
    // const { CategoriaID } = Categoria.value;

    // if (servicioExiste(Categoria, CategoriaID)) {
    //   alert("Esta Categoria ya existe!");
    //   return;
    // }

    try {
      if (SubCategoriaID) {
        await editItem(itemEditar.value);
        //await editar
        const index = data.value.findIndex(
          (item) => item.SubCategoriaID === SubCategoriaID
        );
        if (index !== -1) {
          data.value[index] = { ...itemEditar.value };
        }
      } else {
        const item = {
          SubCategoriaID: itemEditar.value.SubCategoriaID,
          SubCategoria: itemEditar.value.SubCategoria,
          CategoriaID: Categoria.CategoriaID
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
      SubCategoriaID: item.raw.SubCategoriaID,
      SubCategoria: item.raw.SubCategoria,
      Categoria: item.raw.Categoria,
    };
    abrirDialog.value = true;
  };

  const crearCategoria = () => {
    itemEditar.value = {
      SubCategoria: "",
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
      SubCategoriaID: item,
    };
    abrirDialogEliminar.value = true;
  };

  const confirmarEliminarCategoria = async (itemId) => {
    try {
      await deleteItemApi(itemId.SubCategoriaID.SubCategoriaID);
      const index = data.value.findIndex(
        (item) => item.SubCategoriaID === itemId.SubCategoriaID.SubCategoriaID
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
