<script setup>
import { ref, watch, isRef } from 'vue';
const emit = defineEmits();

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  licitaciones: {
    type: Object,
    required: true
  },
  dialog: {
    type: Boolean,
    required: true
  },
});
const localDialog = ref(props.dialog);

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
  emit('guardarItem', props.item);
};
const currentTab = ref(0)

const contactos = ref(props.item.Contactos ? props.item.Contactos : [{ NombreContacto: "", Email: "", Telefono: "" }]);

watch(() => props.item.Contactos, newVal => {
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

</script>
<template>
  <VDialog v-model="localDialog" width="720" @click:outside="close">
    <DialogCloseBtn @click="close" />

    <VCard :title="item && item.ProveedorID ? 'Editar Proveedor' : 'Crear Proveedor'">

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
                <VTextField v-model="item.NombreProveedor" label="Nombre Proveedor" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.Referencia" label="Referencia" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.CodSap" label="Código SAP" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.NroIdentificacion" label="N° Identificación" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.Poblacion" label="Población" />
              </VCol>
              <VCol cols="12" sm="12" md="12">
                <VTextField v-model="item.Calle" label="Calle" />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <VTextField v-model="item.Direccion" label="Dirección" />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem key="1">
            <AppAutocomplete small-chips item-title="Licitacion" :items="licitaciones"
              placeholder="Seleccionar Licitación" chips closable-chips multiple eager return-object>
              <template v-slot:no-data>
                <div class="px-4">No existen datos</div>
              </template>
            </AppAutocomplete>
          </VWindowItem>
          <VWindowItem key="2">
            <VRow class="mt-1" v-for="(contacto, index) in contactos" :key="index">
              <VCol cols="4">
                <VTextField v-model="contacto.NombreContacto" label="Nombre Contacto" />
              </VCol>
              <VCol cols="3">
                <VTextField v-model="contacto.Email" label="Email" />
              </VCol>
              <VCol cols="3">
                <VTextField v-model="contacto.Telefono" label="Teléfono" />
              </VCol>
              <VCol cols="2">
                <VBtn small icon color="error" @click="eliminarContacto(index)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </VCol>
            </VRow>
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

