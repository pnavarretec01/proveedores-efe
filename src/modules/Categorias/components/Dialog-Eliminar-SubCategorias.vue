<script setup>
import { ref, watch } from 'vue';

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

const close = () => {
  emit('closeDelete');
};

const confirm = () => {

  emit('confirmarEliminarSubCategoria', props.item);
};

</script>
<template>
  <VDialog v-model="localDialog" max-width="550px" @click:outside="close">
    <DialogCloseBtn @click="close" />
    <VCard>
      <VCardTitle>
        ¿Estás seguro que deseas eliminar esta Sub-Caterogoría?
      </VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="close">Cancelar</VBtn>
        <VBtn color="success" variant="elevated" @click="confirm">Aceptar</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
