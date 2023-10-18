<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'
import { useSubCategorias } from '../composables/useSubCategorias';
import { useSubCategoriaLogica } from '../composables/useSubCategoriaLogica';
import { useCategorias } from '../composables/useCategorias';
import { useCategoriaLogica } from '../composables/useCategoriaLogica';
import categoriasDialog from './Dialog-Agregar-Categorias.vue'
import categoriasDialogEliminar from './Dialog-Eliminar.vue'
import subCategoriasDialog from './Dialog-Agregar-SubCategorias.vue'
import subCategoriasDialogEliminar from './Dialog-Eliminar-SubCategorias.vue'

const search = ref('')
const abrirDialog = ref(false);
const abrirDialogEliminar = ref(false);
const abrirDialogSubCategoria = ref(false);
const abrirDialogEliminarSubCategoria = ref(false);
const snackbar = ref(false);
const snackbarColor = ref("succes");
const snackbarMessage = ref("");

//categorias
const { data: categoriasData,
  fetchItems,
  createItem,
  deleteItemApi,
  editItem, } = useCategorias(snackbar, snackbarColor, snackbarMessage);
const {
  itemEditar,
  guardar,
  abrirEditarCategoria,
  crearCategoria,
  close,
  deleteItem,
  confirmarEliminarCategoria,
  closeDelete,
  abrirEliminarCategoria
} = useCategoriaLogica(categoriasData, abrirDialog, abrirDialogEliminar, snackbar, snackbarColor, snackbarMessage, createItem, deleteItemApi, editItem);

onMounted(() => {
  fetchItems();
});

//subcategorias
const {
  dataSubCategorias,
  createSubCategoriaApi,
  deleteSubCategoriaApi,
  editSubCategoriaApi, } = useSubCategorias(snackbar, snackbarColor, snackbarMessage);
const {
  subcategoriaEditar,
  guardarSubCategoria,
  abrirEditarSubCategoria,
  crearSubCategoria,
  closeSubCategoria,
  confirmarEliminarSubCategoria,
  closeDeleteSubCategoria,
  abrirEliminarSubCategoria,
} = useSubCategoriaLogica(dataSubCategorias, abrirDialogSubCategoria, abrirDialogEliminarSubCategoria, snackbar, snackbarColor, snackbarMessage, createSubCategoriaApi, deleteSubCategoriaApi, editSubCategoriaApi, categoriasData, fetchItems);

const headers = [
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: 'Categorías',
    key: 'categorias',
  },
  {
    title: 'Acciones',
    key: 'actions',
  },
]
// const headers = [
//   {
//     title: 'Categoría',
//     key: 'data-table-group',
//     sortable: true,
//   },
//   { title: 'Sub Categorías', key: 'SubCategorias' },
// ]

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [''],
  sortDesc: [false],
});
const groupBy = [{ key: 'Categoria' }]
const totalPages = computed(() => Math.ceil(data.value.length / options.value.itemsPerPage));
const computedItems = computed(() => {
  const start = (options.value.page - 1) * options.value.itemsPerPage;
  const end = start + options.value.itemsPerPage;
  return data.value.slice(start, end);
});
watch(options, newVal => {
  if (newVal.itemsPerPage <= 0) {
    options.value.itemsPerPage = 1
  }
});
function customSearch(value, item) {
  if (!item || !item.Categoria) {
    return false;
  }
  return String(item.Categoria).toLowerCase().includes(value.toLowerCase());
}
const filteredCategoriasData = computed(() => {
  if (!search.value) return categoriasData.value;
  return categoriasData.value.filter(item => {
    return customSearch(search.value, item);
  });
});
</script>

<template>
  <div>
    <div class="me-3 d-flex gap-3 mb-4 mt-1">
      <VBtn prepend-icon="tabler-plus" @click="crearCategoria">
        Crear Nueva Categoría
      </VBtn>
    </div>
    <VCardText>
      <VRow>
        <VCol cols="12" offset-md="8" md="4">
          <AppTextField v-model="search" density="compact" placeholder="Buscar" append-inner-icon="tabler-search"
            single-line hide-details dense outlined />
        </VCol>
      </VRow>
    </VCardText>
    <VDataTable :headers="headers" :items="filteredCategoriasData" :custom-filter="customSearch" :items-per-page="5"
      class="text-no-wrap" @update:options="options = $event" hover sticky expand-on-click fixed-header>
      <template v-slot:item.categorias="{ item }">
        <span>{{ item.value.Categoria }}</span>
        <span> ({{ item.value.SubCategorias.length }})</span>
      </template>
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td>
            <ul class="subcategorias-list">
              <VBtn class="mt-1 mb-1" prepend-icon="tabler-plus"
                @click="crearSubCategoria(slotProps.item.value.CategoriaID)">Agregar SubCategoría</VBtn>
              <h3>Subcategorías</h3>

              <li v-for="(subcat, index) in slotProps.item.raw.SubCategorias" :key="subcat.SubCategoriaID">
                <span class="subcat-icon">
                  <VIcon icon="tabler-avatar" size="24"></VIcon>
                </span>
                <span class="subcat-title">
                  {{ subcat.SubCategoria }}
                </span>
                <span class="subcat-actions">
                  <IconBtn>
                    <VIcon icon="tabler-edit" @click="abrirEditarSubCategoria(subcat)" />
                  </IconBtn>
                  <IconBtn>
                    <VIcon color="error" icon="tabler-trash" @click="abrirEliminarSubCategoria(subcat)" />
                  </IconBtn>
                </span>
              </li>
              <li v-if="!slotProps.item.raw.SubCategorias || !slotProps.item.raw.SubCategorias.length">
                No hay subcategorías disponibles.
              </li>
            </ul>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        No hay datos disponibles.
      </template>
      <template v-slot:item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="abrirEditarCategoria(item)" />
        </IconBtn>
        <IconBtn @click="abrirEliminarCategoria(item.value)">
          <VIcon color="error" icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTable>
    <subCategoriasDialog :item="subcategoriaEditar" :dialog="abrirDialogSubCategoria" @close="closeSubCategoria"
      @guardarCategoria="guardarSubCategoria" />
    <subCategoriasDialogEliminar :item="subcategoriaEditar" :dialog="abrirDialogEliminarSubCategoria"
      @close="closeDeleteSubCategoria" @confirmarEliminarSubCategoria="confirmarEliminarSubCategoria" />

    <categoriasDialog :item="itemEditar" :dialog="abrirDialog" @close="close" @guardarCategoria="guardar" />
    <categoriasDialogEliminar :item="itemEditar" :dialog="abrirDialogEliminar" @close="closeDelete"
      @confirmarEliminar="confirmarEliminarCategoria" />
    <VSnackbar v-model="snackbar" :color="snackbarColor" location="top end" :timeout="2000">
      {{ snackbarMessage }}
    </VSnackbar>
  </div>
</template>
<style scoped>
h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-block-end: 10px;
}

.subcategorias-list {
  list-style-type: none;
  padding-inline-start: 0;
}

.subcategorias-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-block-end: 1px solid #eee;
}

.subcat-icon {
  margin-inline-end: 15px;
}

.subcat-title {
  flex-grow: 1;
}

.subcat-actions {
  display: flex;
  gap: 10px;
}
</style>
