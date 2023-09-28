<script setup>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { useApis } from '../composables/useApis';
import { useLogica } from '../composables/useLogica';
import serviciosDialog from './Dialog-Agregar.vue'
import serviciosDialogEliminar from './Dialog-Eliminar.vue'
import { onMounted } from 'vue';

const search = ref('')
const abrirDialog = ref(false);
const abrirDialogEliminar = ref(false);

const loading = ref(true);

const snackbar = ref(false);
const snackbarColor = ref("succes");
const snackbarMessage = ref("");

const filters = ref({
  NombreProveedor: '',
  Referencia: '',
  CodSap: '',
  NroIdentificacion: '',
  Poblacion: '',
  Calle: '',
  Direccion: '',
});

const { data, totalItems, fetchItems, createItem, deleteItemApi, editItem } = useApis(snackbar, snackbarColor, snackbarMessage);

onMounted(() => fetchItems(filters.value, options.value.page, options.value.itemsPerPage));
const {
  itemEditar,
  guardar,
  abrirEditarItem,
  crearServicio,
  close,
  deleteItem,
  confirmarEliminar,
  closeDelete,
  abrirEliminarItem
} = useLogica(data, abrirDialog, abrirDialogEliminar, snackbar, snackbarColor, snackbarMessage, createItem, deleteItemApi, editItem);

const headers = [
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: 'ID',
    key: 'ProveedorID',
  },
  {
    title: 'Nombre Proveedor',
    key: 'NombreProveedor',
  },
  {
    title: 'Referencia',
    key: 'Referencia',
  },
  {
    title: 'Cod SAP',
    key: 'CodSap',
  },
  {
    title: 'Nro_identificacion',
    key: 'NroIdentificacion',
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: ['ProveedorID'],
  sortDesc: [true],
});
watch(options, newVal => {
  if (newVal.itemsPerPage <= 0) {
    options.value.itemsPerPage = 1
  }
});
watch([options, filters], async () => {
  loading.value = true;
  await fetchItems(filters.value, options.value.page, options.value.itemsPerPage);
  loading.value = false;
}, { deep: true });

function fetchWithFilters() {
  fetchItems(filters.value);
}

function clearFilters() {
  filters.value = {
    NombreProveedor: '',
    Referencia: '',
    CodSap: '',
    NroIdentificacion: '',
    Poblacion: '',
    Calle: '',
    Direccion: '',
  };
}
function loadItems(newOptions) {
  loading.value = true;
  options.value = newOptions;
  fetchItems(filters.value, options.value.page, options.value.itemsPerPage)
    .then(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div>
    <div class="me-3 d-flex gap-3 mb-4 mt-1">
      <VBtn prepend-icon="tabler-plus" @click="crearServicio">
        Crear Nuevo Proveedor
      </VBtn>
    </div>
    <!-- <VCardText>
      <VRow>
        <VCol cols="12" offset-md="8" md="4">
          <AppTextField v-model="search" density="compact" placeholder="Buscar" append-inner-icon="tabler-search"
            single-line hide-details dense outlined />
        </VCol>
      </VRow>
    </VCardText> -->
    <VRow>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.NombreProveedor" label="Nombre Proveedor" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.Referencia" label="Referencia" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.CodSap" label="Cod Sap" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.NroIdentificacion" label="Nro Identificación" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.Poblacion" label="Poblacion" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.Calle" label="Calle" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <AppTextField v-model="filters.Direccion" label="Direccion" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2" class="d-flex flex-column justify-space-between">
        <VBtn class="mb-1" @click="fetchWithFilters">Buscar</VBtn>
        <VBtn @click="clearFilters">Limpiar</VBtn>
      </VCol>
    </VRow>


    <VDataTableServer class="text-no-wrap" :headers="headers" :items="data" :items-length="totalItems" :loading="loading"
      @update:options="loadItems" :search="search" hover sticky expand-on-click>
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <p class="my-1">
              Población: {{ slotProps.item.raw.Poblacion }}
            </p>
            <p class="my-1">
              Calle: {{ slotProps.item.raw.Calle }}
            </p>
            <p class="my-1">
              Dirección: {{ slotProps.item.raw.Direccion }}
            </p>
          </td>
        </tr>
      </template>
      <template v-slot:item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="abrirEditarItem(item)" />
        </IconBtn>
        <IconBtn @click="abrirEliminarItem(item.value)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
      <template v-slot:no-data>
        No hay datos disponibles.
      </template>
      <!-- <template #bottom></template> -->
    </VDataTableServer>
    <serviciosDialog :item="itemEditar" :dialog="abrirDialog" @close="close" @guardarItem="guardar" />
    <serviciosDialogEliminar :item="itemEditar" :dialog="abrirDialogEliminar" @closeDelete="closeDelete"
      @confirmarEliminar="confirmarEliminar" />
    <VSnackbar v-model="snackbar" :color="snackbarColor" location="top end" :timeout="2000">
      {{ snackbarMessage }}
    </VSnackbar>
  </div>
</template>
