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
  emit('guardarCategoria', props.item);
};
</script>

<template>
  <VDialog v-model="localDialog" width="500" @click:outside="close">
    <DialogCloseBtn @click="close" />

    <VCard :title="item && item.id ? 'Editar Categoría' : 'Crear Categoría'">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="12" md="12">
            <VTextField v-model="item.categoria" label="Categoría" />
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
