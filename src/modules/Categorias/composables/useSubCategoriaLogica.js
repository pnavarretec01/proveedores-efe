import { ref } from "vue";

export const useSubCategoriaLogica = (
  data,
  abrirDialogSubCategoria,
  abrirDialogEliminarSubCategoria,
  snackbar,
  snackbarColor,
  snackbarMessage,
  createSubCategoriaApi,
  deleteSubCategoriaApi,
  editSubCategoriaApi,
  categoriasData
) => {
  const subcategoriaEditar = ref({
    SubCategoria: "",
  });

  function validateForm(item) {
    if (!item.SubCategoria) {
      snackbarMessage.value = "Por favor, ingrese una Sub Categoría.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return false;
    }

    return true;
  }

  const servicioExiste = (nombre, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.SubCategoriaID === excludeId) {
        return false;
      }
      return item.SubCategoria.toLowerCase() === nombre.toLowerCase();
    });
  };

  const guardarSubCategoria = async () => {
    if (!validateForm(subcategoriaEditar.value)) {
      return;
    }
    const { SubCategoriaID, SubCategoria, CategoriaID } =
      subcategoriaEditar.value;
    if (servicioExiste(SubCategoria, SubCategoriaID)) {
      snackbarMessage.value = "Ya existe una Sub Categoría con este nombre.";
      snackbarColor.value = "info";
      snackbar.value = true;
      return;
    }
    try {
      if (SubCategoriaID) {
        await editSubCategoriaApi(subcategoriaEditar.value);
        const cat = categoriasData.value.find(
          (c) => c.CategoriaID === subcategoriaEditar.value.Categoria
        );
        if (cat) {
          const subCatIndex = cat.SubCategorias.findIndex(
            (s) => s.SubCategoriaID === SubCategoriaID
          );
          if (subCatIndex !== -1) {
            cat.SubCategorias[subCatIndex] = {
              ...subcategoriaEditar.value,
            };
          }
        }
      } else {
        const newItem = await createSubCategoriaApi(subcategoriaEditar.value);
        const cat = categoriasData.value.find(
          (c) => c.CategoriaID === subcategoriaEditar.value.CategoriaID
        );
        if (cat) {
          cat.SubCategorias.unshift(newItem);
        }
      }
      closeSubCategoria();
    } catch (error) {
      console.error("Hubo un error al guardar el servicio.", error);
    }
  };

  const abrirEditarSubCategoria = (item) => {
    abrirDialogSubCategoria.value = true;
    subcategoriaEditar.value = {
      SubCategoriaID: item.SubCategoriaID,
      SubCategoria: item.SubCategoria,
      Categoria: item.CategoriaID,
    };
  };

  const crearSubCategoria = (categoriaId) => {
    subcategoriaEditar.value = {
      SubCategoria: "",
      CategoriaID: categoriaId,
    };
    abrirDialogSubCategoria.value = true;
  };

  const closeSubCategoria = () => {
    abrirDialogSubCategoria.value = false;
    subcategoriaEditar.value = {};
  };
  const closeDeleteSubCategoria = () => {
    abrirDialogEliminarSubCategoria.value = false;
    subcategoriaEditar.value = {};
  };

  const abrirEliminarSubCategoria = (item) => {
    subcategoriaEditar.value = {
      SubCategoriaID: item,
    };
    abrirDialogEliminarSubCategoria.value = true;
  };

  const confirmarEliminarSubCategoria = async (itemId) => {
    try {
      await deleteSubCategoriaApi(itemId.SubCategoriaID.SubCategoriaID);

      const categoria = categoriasData.value.find((cat) =>
        cat.SubCategorias.some(
          (sub) => sub.SubCategoriaID === itemId.SubCategoriaID.SubCategoriaID
        )
      );

      // 2. Si encontramos la categoría, eliminamos la subcategoría de su lista
      if (categoria) {
        const subIndex = categoria.SubCategorias.findIndex(
          (sub) => sub.SubCategoriaID === itemId.SubCategoriaID.SubCategoriaID
        );
        if (subIndex !== -1) {
          categoria.SubCategorias.splice(subIndex, 1);
        }
      }

      // 3. Elimina la subcategoría de la lista data
      const index = data.value.findIndex(
        (item) => item.SubCategoriaID === itemId.SubCategoriaID.SubCategoriaID
      );
      if (index !== -1) {
        data.value.splice(index, 1);
      }

      closeDeleteSubCategoria();
    } catch (error) {
      console.error("Hubo un error al eliminar el servicio.", error);
    }
  };

  return {
    subcategoriaEditar,
    guardarSubCategoria,
    abrirEditarSubCategoria,
    crearSubCategoria,
    closeSubCategoria,
    confirmarEliminarSubCategoria,
    closeDeleteSubCategoria,
    abrirEliminarSubCategoria,
  };
};
