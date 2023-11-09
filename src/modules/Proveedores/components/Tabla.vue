<script setup>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { useApis } from '../composables/useApis';
import { useLogica } from '../composables/useLogica';
import { useLicitacionesProveedores } from '../composables/useLicitacionesProveedores';
import { useCategorias } from '../composables/useCategorias';
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
  Estado: '',
});

const { fetchLicitaciones,
  licitaciones } = useLicitacionesProveedores(snackbar, snackbarColor, snackbarMessage)
const { fetchCategorias,
  categorias } = useCategorias(snackbar, snackbarColor, snackbarMessage)

const { data, totalItems, fetchItems, createItem, deleteItemApi, editItem } = useApis(snackbar, snackbarColor, snackbarMessage);

onMounted(() => fetchItems(filters.value, options.value.page, options.value.itemsPerPage));
const {
  datosEditar,
  guardarItem,
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
  // {
  //   title: 'ID',
  //   key: 'ProveedorID',
  //   sortable: false,
  // },
  {
    title: 'Nombre Proveedor',
    key: 'NombreProveedor',
    sortable: false,
  },
  // {
  //   title: 'Referencia',
  //   key: 'Referencia',
  // },
  {
    title: 'Cod SAP',
    key: 'CodSap',
  },
  {
    title: 'Ariba',
    key: 'Ariba',
  },
  // {
  //   title: 'Nro_identificacion',
  //   key: 'NroIdentificacion',
  // },
  {
    title: 'Proponente',
    key: 'licitacionStatus',
    sortable: false,
  },
  {
    title: 'Participaciones',
    key: 'noAdjudicadas',
    sortable: false,
  },
  {
    title: 'Adjudicadas',
    key: 'adjudicadas',
    sortable: false,
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
    Ariba: '',
    NroIdentificacion: '',
    Poblacion: '',
    Calle: '',
    Direccion: '',
    Estado: '',
  };
}
function getChipColor(count) {
  if (count === 0) {
    return 'error';
  } else if (count > 0 && count <= 3) {
    return 'warning';
  } else {
    return 'success';
  }
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
    <VRow>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.NombreProveedor" label="Nombre Proveedor" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.Referencia" label="Referencia" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.CodSap" label="Cod Sap" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.Ariba" label="Ariba" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.NroIdentificacion" label="Nro Identificación" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.Poblacion" label="Poblacion" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.Calle" label="Calle" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VTextField v-model="filters.Direccion" label="Direccion" outlined />
      </VCol>
      <VCol cols="12" sm="6" md="2">
        <VSelect v-model="filters.Estado" :items="['Si', 'No']" label="Proponente" outlined clearable></VSelect>
      </VCol>
      <VCol cols="12" sm="6" md="2" class="d-flex flex-column justify-space-between">
        <VBtn class="mb-1" @click="fetchWithFilters">Buscar</VBtn>
        <VBtn @click="clearFilters">Limpiar</VBtn>
      </VCol>
    </VRow>
    <VDataTableServer class="text-no-wrap" :headers="headers" :items="data" :items-length="totalItems" :loading="loading"
      @update:options="loadItems" :search="search" hover sticky fixed-header>
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <p class="my-1">
              <strong>Referencia: </strong> {{ slotProps.item.raw.Referencia }}
            </p>
            <p class="my-1">
              <strong>Población: </strong> {{ slotProps.item.raw.Poblacion }}
            </p>
            <p class="my-1">
              <strong>Calle: </strong> {{ slotProps.item.raw.Calle }}
            </p>
            <p class="my-1">
              <strong>Dirección: </strong> {{ slotProps.item.raw.Direccion }}
            </p>
          </td>
        </tr>
      </template>
      <template v-slot:item.noAdjudicadas="{ item }">
        <VChip :color="getChipColor(item.raw.Licitaciones.filter(licit => !licit.LicitacionProveedor.Adjudicado).length)">
          {{ item.raw.Licitaciones.length}}
        </VChip>
      </template>


      <template v-slot:item.adjudicadas="{ item }">
        <VChip :color="getChipColor(item.raw.Licitaciones.filter(licit => licit.LicitacionProveedor.Adjudicado).length)">
          {{ item.raw.Licitaciones.filter(licit => licit.LicitacionProveedor.Adjudicado).length }}
        </VChip>
      </template>


      <template v-slot:item.licitacionStatus="{ item }">
        <VChip label color="success" v-if="item.value.Estado > 0">
          SI
        </VChip>
        <VChip label color="default" v-if="item.value.Estado == 0">
          NO
        </VChip>
      </template>
      <template v-slot:item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="abrirEditarItem(item)" />
        </IconBtn>
        <IconBtn @click="abrirEliminarItem(item.value)">
          <VIcon color="error" icon="tabler-trash" />
        </IconBtn>
      </template>
      <template v-slot:no-data>
        No hay datos disponibles.
      </template>
      <!-- <template #bottom></template> -->
    </VDataTableServer>
    <serviciosDialog :item="datosEditar" :licitacionesCargadas="licitaciones" :categoriasCargadas="categorias"
      :dialog="abrirDialog" @close="close" @guardarItem="guardarItem(datosEditar)" @updateData="fetchWithFilters" />
    <serviciosDialogEliminar :item="datosEditar" :dialog="abrirDialogEliminar" @closeDelete="closeDelete"
      @confirmarEliminar="confirmarEliminar" />
    <VSnackbar v-model="snackbar" :color="snackbarColor" location="top end" :timeout="2000">
      {{ snackbarMessage }}
    </VSnackbar>
  </div>
</template>
