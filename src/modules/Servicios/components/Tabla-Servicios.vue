<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import axios from '@axios'
import { useServicios } from '../composables/useServicios';
import { useServicioLogica } from '../composables/useServicioLogica';
import serviciosDialog from './Dialog-Agregar-Servicios.vue'
import serviciosDialogEliminar from './Dialog-Eliminar.vue'

const search = ref('')
const abrirDialog = ref(false);
const abrirDialogEliminar = ref(false);

const { data } = useServicios();
const {
  servicioEditar,
  guardar,
  abrirEditarServicio,
  crearServicio,
  close,
  deleteItem,
  confirmarEliminarServicio,
  closeDelete,
  abrirEliminarServicio
} = useServicioLogica(data, abrirDialog, abrirDialogEliminar);

const headers = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'Servicio',
    key: 'servicio',
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
        Crear Nuevo Servicio
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
      @update:options="options = $event">
      <template v-slot:item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="abrirEditarServicio(item)" />
        </IconBtn>
        <IconBtn @click="abrirEliminarServicio(item.value)">
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
    <serviciosDialog :item="servicioEditar" :dialog="abrirDialog" @close="close" @guardarServicio="guardar" />
    <serviciosDialogEliminar :item="servicioEditar" :dialog="abrirDialogEliminar" @closeDelete="closeDelete"
      @confirmarEliminar="confirmarEliminarServicio" />
  </div>
</template>
