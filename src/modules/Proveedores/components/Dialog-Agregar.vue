<script setup>
import { ref, watch, isRef } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
const emit = defineEmits();

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  licitacionesCargadas: {
    type: Object,
    required: true
  },
  dialog: {
    type: Boolean,
    required: true
  },
});
const localDialog = ref(props.dialog);

const internalLicitaciones = ref([...(props.item.licitaciones || [])]);
watch(() => props.item.licitaciones, newVal => {
  if (newVal && newVal.length) {
    internalLicitaciones.value = [...newVal];
  } else {
    internalLicitaciones.value = [];
  }
}, { immediate: true });

const licitacionesSeleccionadas = computed({
  get: () => internalLicitaciones.value,
  set: (newVal) => internalLicitaciones.value = newVal
});

const licitacionesAMostrar = computed(() => {
  return props.item.licitaciones || [];
});


watch(() => props.dialog, newVal => {
  localDialog.value = newVal;
});

if (isRef(props.dialog)) {
  watch(props.dialog, newVal => {
    localDialog.value = newVal;
  });
}

const close = () => {
  emit('close');
};

const guardar = () => {
  const datos = {
    proveedor: { ...props.item.proveedor },
    licitaciones: licitacionesSeleccionadas.value,
    contactos: { ...props.item.contactos }
  };
  emit('guardarItem', datos);
  licitacionesSeleccionadas = []
};


const currentTab = ref(0)

const contactos = computed({
  get: () => props.item.contactos || [{ NombreContacto: "", Email: "", Telefono: "" }],
  set: val => props.item.contactos = val
});


watch(() => props.item.contactos, newVal => {
  if (newVal && newVal.length) {
    contactos.value = newVal;
  } else {
    contactos.value = [{ NombreContacto: "", Email: "", Telefono: "" }];
  }
});

const agregarContacto = () => {
  contactos.value.push({ NombreContacto: "", Email: "", Telefono: "" });
};

const eliminarContacto = (index) => {
  contactos.value.splice(index, 1);
};
const licitacionSeleccionada = ref(null);

const agregarLicitacion = () => {
  if (licitacionSeleccionada.value) {
    licitacionesSeleccionadas.value.push(licitacionSeleccionada.value);
    licitacionSeleccionada.value = null;
  }
};


const eliminarLicitacion = (item, index) => {
  licitacionesSeleccionadas.value.splice(index, 1);
};


const licitacionesDisponibles = computed(() => {
  return props.licitacionesCargadas.filter(licitacion =>
    !licitacionesSeleccionadas.value.some(seleccionada =>
      seleccionada.LicitacionID === licitacion.LicitacionID
    )
  );
});
</script>
<template>
  <VDialog v-model="localDialog" width="720" @click:outside="close" style="overflow-y: auto;">
    <DialogCloseBtn @click="close" />
    <VCard :title="item.proveedor && item.proveedor.ProveedorID ? 'Editar Proveedor' : 'Crear Proveedor'">
      <VTabs v-model="currentTab">
        <VTab>Proveedor</VTab>
        <VTab>Licitaciónes</VTab>
        <VTab>Contactos</VTab>
      </VTabs>
      <VCardText>
        <VWindow v-model="currentTab">
          <VWindowItem key="0">
            <VRow class="mt-1">
              <VCol cols="12" sm="12" md="12">
                <VTextField v-model="item.proveedor.NombreProveedor" label="Nombre Proveedor" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.proveedor.Referencia" label="Referencia" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.proveedor.CodSap" label="Código SAP" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.proveedor.NroIdentificacion" label="N° Identificación" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.proveedor.Poblacion" label="Población" />
              </VCol>
              <VCol cols="12" sm="12" md="12">
                <VTextField v-model="item.proveedor.Calle" label="Calle" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.proveedor.Direccion" label="Dirección" />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem key="1">
            <VRow class="mt-1">
              <VCol cols="12" sm="12" md="10">
                <AppAutocomplete v-if="licitacionesDisponibles && licitacionesDisponibles.length" item-title="Licitacion"
                  :items="licitacionesDisponibles" placeholder="Seleccionar Licitación" return-object
                  v-model="licitacionSeleccionada">
                  <template v-slot:no-data>
                    <div class="px-4">No existen datos</div>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12" sm="12" md="2">
                <VBtn @click="agregarLicitacion" small color="primary" class="ml-2">
                  +
                </VBtn>
              </VCol>
            </VRow>
            <VDataTable :items="licitacionesSeleccionadas"
              :headers="[{ title: 'Licitacion', key: 'Licitacion' }, { title: 'Acciones', key: 'actions', sortable: false }]"
              class="mt-3" style="max-height: 300px; overflow-y: auto;">
              <template v-slot:item.actions="{ item, index }">
                <VBtn small icon color="error" @click="eliminarLicitacion(item, index)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </template>
              <template v-slot:no-data>
                Sin licitaciones seleccionadas.
              </template>
            </VDataTable>
          </VWindowItem>
          <VWindowItem key="2">
            <VContainer style="max-height: 400px; overflow-y: auto;">
              <VRow class="mt-1" v-for="(contacto, index) in contactos" :key="index">
                <VCol cols="12" sm="4" md="4">
                  <VTextField v-model="contacto.NombreContacto" label="Nombre Contacto" />
                </VCol>
                <VCol cols="12" sm="4" md="3">
                  <VTextField v-model="contacto.Email" label="Email" />
                </VCol>
                <VCol cols="12" sm="4" md="3">
                  <VTextField v-model="contacto.Telefono" label="Teléfono" />
                </VCol>
                <VCol cols="12" sm="12" md="2">
                  <VBtn small icon color="error" @click="eliminarContacto(index)">
                    <VIcon>mdi-delete</VIcon>
                  </VBtn>
                </VCol>
              </VRow>
            </VContainer>
            <VRow>
              <VCol>
                <VBtn @click="agregarContacto">Agregar Contacto</VBtn>
              </VCol>
            </VRow>
          </VWindowItem>

        </VWindow>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="close">Cancelar</VBtn>
        <VBtn color="success" variant="elevated" @click="guardar">Guardar</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

