<script setup>
import { ref, watch, isRef } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import useProveedor from '../composables/useProveedor'

const snackbar = ref(false);
const snackbarColor = ref("succes");
const snackbarMessage = ref("");

const { agregarEliminarDato, eliminarContactoApi, agregarContactoApi, agregarLicitacionApi,
  eliminarLicitacionApi, agregarCategoriaApi,
  eliminarCategoriaApi, updateAdjudicadoStatusApi, getSubcategoriasByCategoria
} = useProveedor(snackbar, snackbarColor, snackbarMessage);
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
  categoriasCargadas: {
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
const internalCategorias = ref([...(props.item.categoriasProveedor ? props.item.categoriasProveedor.map(cat =>
  cat.Categoria) : [])]);
watch(() => props.item.categoriasProveedor, newVal => {
  if (newVal && newVal.length) {
    internalCategorias.value = [...newVal.map(cat => {
      let subCategoriasWithID = [];
      if (cat.Categoria.SubCategoriasByCategoria) {
        subCategoriasWithID = cat.Categoria.SubCategoriasByCategoria.map(subCat => {
          const catProID = subCat.CategoriasProveedor && subCat.CategoriasProveedor.length > 0
            ? subCat.CategoriasProveedor[0].CatProID
            : null;

          return {
            ...subCat,
            CatProID: catProID
          }
        });
      }

      return {
        ...cat.Categoria,
        CatProID: cat.CatProID,
        SubCategoria: cat.SubCategoria,
        SubCategoriasByCategoria: subCategoriasWithID
      }
    })];
  } else {
    internalCategorias.value = [];
  }
}, { immediate: true });


const agruparCategorias = (data) => {
  const agrupado = {};

  data.forEach(item => {
    if (!agrupado[item.CategoriaID]) {
      agrupado[item.CategoriaID] = {
        Categoria: item.Categoria,
        SubCategorias: [],
        CatProID: item.CatProID
      };
    }

    if (item.SubCategoria) {
      agrupado[item.CategoriaID].SubCategorias.push(item.SubCategoria);
    }
  });

  return Object.values(agrupado);
};

const categoriasProcesadas = ref([]);

watch(() => props.item.categoriasProveedor, newVal => {
  console.log(newVal);
  if (newVal && newVal.length) {
    categoriasProcesadas.value = agruparCategorias(newVal);
  } else {
    categoriasProcesadas.value = [];
  }
}, { deep: true, immediate: true });




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
const categoriasSeleccionadas = computed({
  get: () => internalCategorias.value,
  set: (newVal) => internalCategorias.value = newVal
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
  licitacionesSeleccionadas.value = []
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
  const contacto = contactos.value[index];
  if (contacto.ContactoID) {
    eliminarContactoApi(props.item.proveedor.ProveedorID, 'contactos', 'DELETE', contacto).then(() => {
      contactos.value.splice(index, 1);
    }).catch(error => {
      console.error("Hubo un error al eliminar el contacto", error);
    });
  } else {
    contactos.value.splice(index, 1);
  }
};

const guardarContacto = (contacto) => {
  agregarContactoApi(props.item.proveedor.ProveedorID, 'contactos', 'POST', contacto).then(response => {
    if (contacto.ContactoID) {
      const index = contactos.value.findIndex(c => c.ContactoID === contacto.ContactoID);
      if (index !== -1) {
        contactos.value[index] = response.data;
      }
    } else {
      contactos.value.unshift(response.data);
    }
    contactos.value = [{ NombreContacto: "", Email: "", Telefono: "" }];
    emit('updateData');
  }).catch(error => {
    console.error("Hubo un error al guardar el contacto", error);
  });
};


const licitacionSeleccionada = ref(null);

const guardarLicitacion = (licitacion) => {
  agregarLicitacionApi(props.item.proveedor.ProveedorID, 'licitacionesProveedor', 'PUT', licitacion).then(response => {
    if (response.success) {
      const data = response.data;

      licitacionesSeleccionadas.value.unshift(data);
      emit('updateData');
    }
  }).catch(error => {
    console.error("Hubo un error al guardar la licitación", error);
  });
};


const agregarLicitacion = () => {
  if (licitacionSeleccionada.value) {
    guardarLicitacion(licitacionSeleccionada.value);
    licitacionSeleccionada.value = null;
  }
};

const eliminarLicitacion = (item, index) => {
  const licitacion = licitacionesSeleccionadas.value[index];

  eliminarLicitacionApi(licitacion).then(() => {
    licitacionesSeleccionadas.value.splice(index, 1);
    emit('updateData');
  }).catch(error => {
    console.error("Hubo un error al eliminar el contacto", error);
  });

};

const licitacionesDisponibles = computed(() => {
  return props.licitacionesCargadas.filter(licitacion =>
    !licitacionesSeleccionadas.value.some(seleccionada =>
      seleccionada.LicitacionID === licitacion.LicitacionID
    )
  );
});
const categoriasDisponibles = computed(() => {
  return props.categoriasCargadas.filter(categoria =>
    !categoriasSeleccionadas.value.some(seleccionada =>
      seleccionada.CategoriaID === categoria.CategoriaID
    )
  );
});

const updateAdjudicadoStatus = (licitacionProveedor) => {
  updateAdjudicadoStatusApi(licitacionProveedor.value.LicitacionProveedor.LicProvID,
    licitacionProveedor.value.LicitacionProveedor.Adjudicado)
    .then(response => {
      emit('updateData');
    })
    .catch(error => {
      console.error("Hubo un error al actualizar el estado adjudicado", error);
    });
};


const categoriaSeleccionada = ref(null);

const agregarCategoria = () => {
  if (categoriaSeleccionada.value) {
    agregarCategoriaApi(props.item.proveedor.ProveedorID, categoriaSeleccionada.value.CategoriaID).then(response => {
      if (response.success) {
        const data = response.data;
        categoriasSeleccionadas.value.unshift(data);
        // props.item.categoriasProveedor.unshift(data)
        emit('updateData');
      }
    }).catch(error => {
      console.error("Hubo un error al guardar la categoría", error);
    });
  }
};
const refreshKey = ref(0);

// En algún método o lugar donde quieras forzar el renderizado:

const eliminarCategoria = (CatProID) => {
  const index = categoriasSeleccionadas.value.findIndex(cat => cat.CatProID === CatProID);

  if (index !== -1) {
    const categoria = categoriasSeleccionadas.value[index];

    eliminarCategoriaApi(CatProID).then(() => {
      categoriasSeleccionadas.value.splice(index, 1);
      emit('updateData');
      refreshKey.value++;
    }).catch(error => {
      console.error("Hubo un error al eliminar la categoría", error);
    });
  } else {
    console.error("No se pudo encontrar la categoría con CatProID:", CatProID);
  }
};

const valorExpanded = ref([]);
const subCategoriaSeleccioandaPorCategoria = ref([]);

const agregarSubCategoria = async () => {
  const categoriaID = Object.keys(subCategoriaSeleccioandaPorCategoria.value)[0];
  const subCategoriaSeleccionada = subCategoriaSeleccioandaPorCategoria.value[categoriaID];

  agregarCategoriaApi(props.item.proveedor.ProveedorID, subCategoriaSeleccionada.CategoriaID,
    subCategoriaSeleccionada.SubCategoriaID).then(response => {
      if (response.success) {
        const data = response.data;

        // Agregar la nueva subcategoría a la lista interna
        categoriasSeleccionadas.value.push(data);

        emit('updateData');
        refreshKey.value++;
      }
    }).catch(error => {
      console.error("Hubo un error al guardar la categoría", error);
    });
};
const categoriasAgrupadas = computed(() => {
  let agrupado = {};

  categoriasSeleccionadas.value.forEach(categoria => {
    if (!agrupado[categoria.CategoriaID]) {
      agrupado[categoria.CategoriaID] = {
        Categoria: categoria.Categoria,
        SubCategorias: [],
        SubCategoriasByCategoria: categoria.SubCategoriasByCategoria,
        CatProID: categoria.CatProID
      };
    }

    if (categoria.SubCategoria) {
      agrupado[categoria.CategoriaID].SubCategorias.push({
        SubCategoria: categoria.SubCategoria,
        CatProID: categoria.CatProID
      });
    }
  });

  return Object.values(agrupado);
});


const eliminarSubCategoria = (CatProID) => {
  const index = categoriasSeleccionadas.value.findIndex(cat => cat.CatProID === CatProID);
  if (index !== -1) {
    const subcategoria = categoriasSeleccionadas.value[index];

    eliminarCategoriaApi(CatProID).then(() => {
      // Eliminar la subcategoría de la lista interna
      categoriasSeleccionadas.value.splice(index, 1);

      emit('updateData');
      refreshKey.value++;
    }).catch(error => {
      console.error("Hubo un error al eliminar la subcategoría", error);
    });
  } else {
    console.error("No se pudo encontrar la subcategoría con CatProID:", CatProID);
  }
};
</script>
<template>
  <VDialog v-model="localDialog" width="720" @click:outside="close" style="overflow-y: auto;">
    <DialogCloseBtn @click="close" />
    <VCard :title="item.proveedor && item.proveedor.ProveedorID ? 'Editar Proveedor' : 'Crear Proveedor'">
      <VTabs v-model="currentTab">
        <VTab>Proveedor</VTab>
        <VTab v-if="item.proveedor && item.proveedor.ProveedorID">Licitaciónes</VTab>
        <VTab v-if="item.proveedor && item.proveedor.ProveedorID">Contactos</VTab>
        <VTab v-if="item.proveedor && item.proveedor.ProveedorID">Categorías</VTab>
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
              <VCol cols="12" sm="12" md="12">
                <VTextField v-model="item.proveedor.Direccion" label="Dirección" />
              </VCol>
              <VCol cols="12" sm="12" md="12">
                <AppTextarea v-model="item.proveedor.Observacion" label="Observación" rows="5" />
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
            <VDataTable :items="licitacionesSeleccionadas" :headers="[{ title: 'Licitacion', key: 'Licitacion' },
            { title: 'Adjudicado', key: 'adjudicado', sortable: false },
            { title: 'Acciones', key: 'actions', sortable: false }]" class="mt-3"
              style="max-height: 300px; overflow-y: auto;">
              <template v-slot:item.adjudicado="{ item, index }">
                <v-switch :label="item.value.LicitacionProveedor.Adjudicado ? 'Si' : 'No'"
                  v-model="item.value.LicitacionProveedor.Adjudicado" inset color="success" hide-details
                  @input="updateAdjudicadoStatus(item)" />
              </template>
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
                  <VBtn small icon color="success" @click="guardarContacto(contacto)">
                    <VIcon>mdi-content-save</VIcon>
                  </VBtn>
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
          <VWindowItem key="3">
            <VRow class="mt-1">
              <VCol cols="12" sm="12" md="10">
                <AppAutocomplete item-title="Categoria" :items="categoriasDisponibles" placeholder="Seleccionar Categoría"
                  return-object v-model="categoriaSeleccionada">
                  <template v-slot:no-data>
                    <div class="px-4">No existen datos</div>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12" sm="12" md="2">
                <VBtn @click="agregarCategoria" small color="primary" class="ml-2">
                  +
                </VBtn>
              </VCol>
            </VRow>
            <!-- <VDataTable :items="categoriasProcesadas" :headers="[
              { title: 'Categoría', key: 'Categoria' },
              { title: 'SubCategorías', key: 'SubCategorias' },
              { title: 'Acciones', key: 'actions', sortable: false }
            ]" class="mt-3" style="max-height: 300px; overflow-y: auto;" :key="refreshKey">
              <template v-slot:item.Categoria="{ item }">
                {{ item.value.Categoria.Categoria }}
              </template>
              <template v-slot:item.SubCategorias="{ item }">
                <ul>
                  <li v-for="sub in item.value.SubCategorias" :key="sub.SubCategoriaID">
                    {{ sub.SubCategoria }}
                  </li>
                </ul>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <VBtn small icon color="error" @click="eliminarCategoria(item.value.CatProID, index)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </template>
              <template v-slot:no-data>
                Sin categorías procesadas.
              </template>
            </VDataTable> -->


            <VDataTable :items="categoriasAgrupadas" :headers="[
              {
                title: '',
                key: 'data-table-expand',
              },
              { title: 'Categoría', key: 'Categoria' },
              { title: 'Acciones', key: 'actions', sortable: false }
            ]" class="mt-3" style="max-height: 300px; overflow-y: auto;" expand-on-click
              v-model:expanded="valorExpanded">
              <template #expanded-row="slotProps">

                <VRow class="mt-1 mb-1">
                  <VCol cols="12" sm="12" md="10">
                    {{slotProps.item.value.CatProID}}
                    <AppAutocomplete item-title="SubCategoria" :items="slotProps.item.value.SubCategoriasByCategoria"
                      placeholder="SubCategoría" return-object
                      v-model="subCategoriaSeleccioandaPorCategoria[slotProps.item.value.CatProID]">>
                      <template v-slot:no-data>
                        <div class="px-4">No existen datos</div>
                      </template>
                    </AppAutocomplete>
                  </VCol>
                  <VCol cols="12" sm="12" md="2">
                    <VBtn small color="primary" class="ml-2" @click="agregarSubCategoria">
                      +
                    </VBtn>
                  </VCol>
                </VRow>
                <strong>Sub Categorías: </strong>
                <VRow v-for="sub in slotProps.item.raw.SubCategorias" :key="sub.SubCategoriaID">
                  <VCol cols="10">{{ sub.SubCategoria.SubCategoria }}</VCol>
                  <VCol cols="2">
                    <IconBtn @click="eliminarSubCategoria(sub.CatProID)" color="error">
                      <VIcon icon="tabler-trash" />
                    </IconBtn>
                  </VCol>
                </VRow>
                <!-- <table>
                  <thead>
                    <tr>
                      <th>Subcategoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sub in slotProps.item.raw.SubCategorias" :key="sub.SubCategoriaID">
                      <td>{{ sub.SubCategoria }}</td>
                      <td>
                        <IconBtn @click="eliminarSubCategoria(sub.CatProID)" color="error">
                          <VIcon icon="tabler-trash" />
                        </IconBtn>
                      </td>
                    </tr>
                  </tbody>
                </table> -->

              </template>
              <template v-slot:item.actions="{ item, index }">
                <VBtn small icon color="error" @click="eliminarCategoria(item.value.CatProID, index)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </template>
              <template v-slot:no-data>
                Sin categorías seleccionadas.
              </template>
            </VDataTable>
          </VWindowItem>
        </VWindow>
      </VCardText>
      <VCardActions v-if="currentTab == 0">
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="close">Cancelar</VBtn>
        <VBtn color="success" variant="elevated" @click="guardar">Guardar</VBtn>
      </VCardActions>
      <VCardActions v-else>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="close">Cerrar</VBtn>
      </VCardActions>
    </VCard>
    <VSnackbar v-model="snackbar" :color="snackbarColor" location="top end" :timeout="2000">
      {{ snackbarMessage }}
    </VSnackbar>
  </VDialog>
</template>
<style scoped>
table {
  border-collapse: collapse;
  inline-size: 100%;
}

th,
td {
  padding: 8px;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}
</style>

