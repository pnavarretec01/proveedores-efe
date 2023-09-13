import { ref } from "vue";

export const useCategoriaLogica = (data, abrirDialog) => {
  const categoriaEditar = ref({
    categoria: "",
  });

  const categoriaExiste = (nombreCategoria, excludeId = null) => {
    return data.value.some((item) => {
      if (excludeId && item.id === excludeId) {
        return false;
      }
      return item.categoria.toLowerCase() === nombreCategoria.toLowerCase();
    });
  };

  const guardar = async () => {
    const { id, categoria } = categoriaEditar.value;

    if (categoriaExiste(categoria, id)) {
      alert("Esta categoría ya existe!");
      return;
    }

    if (id) {
      const index = data.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        data.value[index] = { ...categoriaEditar.value };
      }
    } else {
      const ultimoID = Math.max(...data.value.map((item) => item.id), 1);
      const nuevoId = ultimoID + 1;

      const newItem = {
        id: nuevoId,
        categoria: categoria,
      };
      data.value.unshift(newItem);
    }
  };

  const abrirEditarCategoria = (item) => {
    categoriaEditar.value = {
      id: item.raw.id,
      categoria: item.raw.categoria,
    };
    abrirDialog.value = true;
  };

  const crearCategoria = () => {
    categoriaEditar.value = {
      categoria: "",
    };
    abrirDialog.value = true;
  };

  const close = () => {
    abrirDialog.value = false;
    categoriaEditar.value = {};
  };

  const deleteItem = (itemId) => {
    const index = data.value.findIndex((item) => item.id === itemId);
    data.value.splice(index, 1);
  };

  return {
    categoriaEditar,
    guardar,
    abrirEditarCategoria,
    crearCategoria,
    close,
    deleteItem,
  };
};
