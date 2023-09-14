<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'
import { useApis } from '../composables/useApis';
import { useLogica } from '../composables/useLogica';
import serviciosDialog from './Dialog-Agregar.vue'
import serviciosDialogEliminar from './Dialog-Eliminar.vue'

const search = ref('')
const abrirDialog = ref(false);
const abrirDialogEliminar = ref(false);

const { data } = useApis();
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
} = useLogica(data, abrirDialog, abrirDialogEliminar);

const headers = [
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: 'Nombre Proveedor',
    key: 'nombreProveedor',
  },
  {
    title: 'Referencia',
    key: 'referencia',
  },
  {
    title: 'Cod SAP',
    key: 'codSAP',
  },
  {
    title: 'Nro_identificacion',
    key: 'nroIdentificacion',
  },
  {
    title: 'Ps',
    key: 'ps',
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
  sortBy: [''],
  sortDesc: [false],
});
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
      <VBtn prepend-icon="tabler-plus" @click="crearServicio">
        Crear Nueva Licitacion
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

    <VDataTable :headers="headers" :items="computedItems" :search="search" :items-per-page="5" class="text-no-wrap"
      @update:options="options = $event" expand-on-click>
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <p class="my-1">
              Población: {{ slotProps.item.raw.poblacion }}
            </p>
            <p class="my-1">
              Calle: {{ slotProps.item.raw.calle }}
            </p>
            <p class="my-1">
              Dirección: {{ slotProps.item.raw.direccion }}
            </p>
            <p class="my-1">
              Contacto: {{ slotProps.item.raw.direccion }}
            </p>
            <p class="my-1">
              Categorías: {{ slotProps.item.raw.direccion }}
            </p>
            <p class="my-1">
              Servicios: {{ slotProps.item.raw.direccion }}
            </p>
            <p class="my-1">
              Licitaciones: {{ slotProps.item.raw.direccion }}
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
      <template #bottom>
        <VCardText class="pt-2">
          <VRow>
            <VCol lg="2" cols="3">
              <VTextField v-model="options.itemsPerPage" label="Items por página:" type="number" min="1" max="15"
                hide-details variant="underlined" />
            </VCol>
            <VCol lg="10" cols="9" class="d-flex justify-end">
              <VPagination v-model="options.page" total-visible="5"
                :length="Math.ceil(data.length / options.itemsPerPage)" />
            </VCol>
          </VRow>
        </VCardText>
      </template>
    </VDataTable>
    <serviciosDialog :item="itemEditar" :dialog="abrirDialog" @close="close" @guardarItem="guardar" />
    <serviciosDialogEliminar :item="itemEditar" :dialog="abrirDialogEliminar" @closeDelete="closeDelete"
      @confirmarEliminar="confirmarEliminar" />
  </div>
</template>
