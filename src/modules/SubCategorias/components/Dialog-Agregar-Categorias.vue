<script setup>
import { ref, watch, isRef } from 'vue';
const emit = defineEmits();

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  categorias: {
    type: Object
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

const categoriaSeleccionada = ref([]);
watch(() => props.item.Categoria, newVal => {
  categoriaSeleccionada.value = newVal
});
</script>

<template>
  <VDialog v-model="localDialog" width="500" @click:outside="close">
    <DialogCloseBtn @click="close" />

    <VCard :title="item && item.SubCategoriaID ? 'Editar Sub-Categoría' : 'Crear Sub-Categoría'">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="12" md="12">
            <VTextField v-model="item.SubCategoria" label="Sub-Categoría" />
          </VCol>
          <VCol cols="12" sm="12" md="12">
            <AppAutocomplete item-title="Categoria" :items="categorias" placeholder="Seleccionar Licitación" return-object
              v-model="item.Categoria">
              <template v-slot:no-data>
                <div class="px-4">No existen datos</div>
              </template>
            </AppAutocomplete>
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
