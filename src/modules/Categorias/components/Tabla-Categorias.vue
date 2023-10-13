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

    <VDataTable :headers="headers" :items="categoriasData" :search="search" :items-per-page="5" class="text-no-wrap"
      @update:options="options = $event" hover sticky expand-on-click fixed-header>
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
                    <VIcon icon="tabler-trash" @click="abrirEliminarSubCategoria(subcat)" />
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
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTable>
    <!-- <VDataTable :headers="headers" :items="data" :search="search" :items-per-page="10" :group-by="groupBy">
      <template #data-table-group="{ props, item }">
        <td>
          <VBtn v-bind="props" variant="text" density="comfortable">
            <VIcon class="flip-in-rtl" :icon="props.icon" />
          </VBtn>
          <span>{{ item.value }}</span>
          <span>({{ item.items[0].raw.SubCategorias.length }})</span>

          <IconBtn>
            <VIcon icon="tabler-edit" @click="abrirEditarCategoria(item.items[0])" />
          </IconBtn>
          <IconBtn @click="abrirEliminarCategoria(item.items[0].raw)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </td>
      </template>
      <template #item.Categoria="{ item }">
        {{ item.raw.Categoria }}
      </template>
      <template #item.SubCategorias="{ item }">
        <td>
          <VList v-if="item.raw.SubCategorias && item.raw.SubCategorias.length">
            <VListItem>
              <template #append>
                <VBtn prepend-icon="tabler-plus" @click="crearSubCategoria">Agregar SubCategoría</VBtn>
              </template>
            </VListItem>
            <template v-for="(subcat, index) in item.raw.SubCategorias">
              <VListItem>
                <VListItemTitle>
                  {{ subcat.SubCategoria }}
                </VListItemTitle>
                <template #append>
                  <IconBtn>
                    <VIcon icon="tabler-edit" @click="abrirEditarSubCategoria(subcat)" />
                  </IconBtn>
                  <IconBtn>
                    <VIcon icon="tabler-trash" />
                  </IconBtn>
                </template>
              </VListItem>
              <VDivider v-if="index !== item.raw.SubCategorias.length - 1" />
            </template>
          </VList>
          <div v-else>
            No hay subcategorías disponibles.
          </div>
        </td>
      </template>
      <template v-slot:no-data>
        No hay datos disponibles.
      </template>
    </VDataTable> -->
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
<style>
.v-table th .v-data-table-header__content {
  font-weight: 900 !important;
}

.v-table th {
  font-size: 0.9125rem !important;
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
