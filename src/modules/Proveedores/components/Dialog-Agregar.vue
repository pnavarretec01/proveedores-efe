<script setup>
import { ref, watch, isRef } from 'vue';
const emit = defineEmits();

const props = defineProps({
  item: {
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
</script>
<template>
  <VDialog v-model="localDialog" width="500" @click:outside="close">
    <DialogCloseBtn @click="close" />

    <VCard :title="item && item.ProveedorID ? 'Editar Proveedor' : 'Crear Proveedor'">
      <VCardText>
        <VRow>
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
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="close">Cancelar</VBtn>
        <VBtn color="success" variant="elevated" @click="guardar">Guardar</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
