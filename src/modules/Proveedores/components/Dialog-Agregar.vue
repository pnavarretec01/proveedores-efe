<script setup>
import { ref, watch, isRef } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import useProveedor from '../composables/useProveedor'

const snackbar = ref(false);
const snackbarColor = ref("succes");
const snackbarMessage = ref("");
const refreshKey = ref(0);

const { agregarEliminarDato, eliminarContactoApi, agregarContactoApi, agregarLicitacionApi,
  eliminarLicitacionApi, agregarCategoriaApi,
  eliminarCategoriaApi, updateAdjudicadoStatusApi, getSubcategoriasByCategoria, eliminarCategoriaPorCatYProvApi
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

const guardarContacto = (contacto, indexContacto) => {
  agregarContactoApi(props.item.proveedor.ProveedorID, 'contactos', 'POST', contacto).then(response => {
    if (contacto.ContactoID) {
      const index = contactos.value.findIndex(c => c.ContactoID === contacto.ContactoID);
      if (index !== -1) {
        contactos.value[index] = response.data;
      }
    } else {
      contactos.value[indexContacto] = { NombreContacto: "", Email: "", Telefono: "" };
      contactos.value.splice(indexContacto, 1);
      contactos.value.push(response.data);
    }

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

const disabledEliminarLicitacion = ref(false)
const eliminarLicitacion = (item, index) => {
  disabledEliminarLicitacion.value = true
  const licitacion = licitacionesSeleccionadas.value[index];

  eliminarLicitacionApi(licitacion).then(() => {
    disabledEliminarLicitacion.value = false
    licitacionesSeleccionadas.value.splice(index, 1);
    emit('updateData');
  }).catch(error => {
    disabledEliminarLicitacion.value = false
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

const disabledSwitchLicitacion = ref(false)
const updateAdjudicadoStatus = (licitacionProveedor) => {
  disabledSwitchLicitacion.value = true
  updateAdjudicadoStatusApi(licitacionProveedor.value.LicitacionProveedor.LicProvID,
    licitacionProveedor.value.LicitacionProveedor.Adjudicado)
    .then(response => {
      disabledSwitchLicitacion.value = false
      emit('updateData');
    })
    .catch(error => {
      disabledSwitchLicitacion.value = false
      console.error("Hubo un error al actualizar el estado adjudicado", error);
    });
};


const categoriaSeleccionada = ref(null);
const eliminarCatBoton = ref(false)
const agregarCatBoton = ref(false)

const agregarCategoria = () => {
  if (categoriaSeleccionada.value) {
    agregarCatBoton.value = true    
    agregarCategoriaApi(props.item.proveedor.ProveedorID, categoriaSeleccionada.value.CategoriaID).then(response => {
      if (response.success) {
        const data = response.data;
        //console.log(data);
        categoriasSeleccionadas.value.unshift(data);
        categoriaSeleccionada.value = null
        // props.item.categoriasProveedor.unshift(data)
        emit('updateData');
        agregarCatBoton.value = false
      }
    }).catch(error => {
      agregarCatBoton.value = false
      console.error("Hubo un error al guardar la categoría", error);
    });
  }
};

const eliminarCategoria = (CatProID, subcat, indexTabla, item) => {
  const CategoriaID = item.value.CategoriaID;
  const ProveedorID = props.item.proveedor.ProveedorID;

  eliminarCatBoton.value = true;

  eliminarCategoriaPorCatYProvApi(CategoriaID, ProveedorID).then(() => {

    const index = categoriasSeleccionadas.value.findIndex(cat => cat.CatProID === CatProID);
    categoriasSeleccionadas.value.splice(index, 1);
    // if (index !== -1) {
    //   categoriasSeleccionadas.value.splice(index, 1);
    // }

    emit('updateData');
    setTimeout(() => {
      eliminarCatBoton.value = false;
    }, 1000);


  }).catch(error => {
    console.error("Hubo un error al eliminar la categoría", error);
    setTimeout(() => {
      eliminarCatBoton.value = false;
    }, 1000);
  });
};


const valorExpanded = ref([]);
const subCategoriaSeleccioandaPorCategoria = ref([]);
const agregarSubCatBoton = ref(false)

const agregarSubCategoria = async (slotProps, cat) => {
  agregarSubCatBoton.value = true
  const categoriaID = Object.keys(subCategoriaSeleccioandaPorCategoria.value)[0];
  const subCategoriaSeleccionada = subCategoriaSeleccioandaPorCategoria.value[categoriaID];

  if (!subCategoriaSeleccioandaPorCategoria.value[categoriaID]) {
    snackbarMessage.value = "Selecciona una Sub Categoría para agregar";
    snackbarColor.value = "error";
    snackbar.value = true;
    return
  }
  agregarCategoriaApi(props.item.proveedor.ProveedorID, slotProps.item.raw.CategoriaID,
    cat.SubCategoriaID).then(response => {
      if (response.success) {
        const data = response.data;

        //estructura de NuevaSubCategoria
        const formattedSubCategoria = {
          CatProID: data.NuevaSubCategoria.CatProID,
          SubCategoria: {
            SubCategoriaID: data.NuevaSubCategoria.SubCategoriaID,
            SubCategoria: data.NuevaSubCategoria.SubCategoria,
            CategoriaID: data.NuevaSubCategoria.CategoriaID
          }
        };

        // Si `slotProps.item.raw.SubCategorias` no existe o es null, inicializo como un array vacío.
        if (!slotProps.item.raw.SubCategorias) {
          slotProps.item.raw.SubCategorias = [];
        }

        // agrego la nueva subcateogira a la tabla visualmente
        slotProps.item.raw.SubCategorias.unshift(formattedSubCategoria);
        subCategoriaSeleccioandaPorCategoria.value[categoriaID] = []

        subCategoriaSeleccioandaPorCategoria.value = []
        emit('updateData');
        agregarSubCatBoton.value = false
      }
    }).catch(error => {
      agregarSubCatBoton.value = false
      console.error("Hubo un error al guardar la subcategoría", error);
    });
};

const computeAgruparCategorias = (data) => {
  let agrupado = {};

  data.forEach(categoria => {
    if (!agrupado[categoria.CategoriaID]) {
      agrupado[categoria.CategoriaID] = {
        CategoriaID: categoria.CategoriaID,
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
};

const categoriasAgrupadas = computed(() => computeAgruparCategorias(categoriasSeleccionadas.value));
watch(
  () => categoriasAgrupadas.value,
  (newValue, oldValue) => {
    //console.log('categoriasAgrupadas ha cambiado');
    // console.log('Valor antiguo: ', oldValue);
    // console.log('Valor nuevo: ', newValue);
  },
  { deep: true }
);



const eliminarSubCategoria = (CatProID, subcat, indexTabla, slotProps) => {
  let index = slotProps.item.raw.SubCategorias.findIndex(cat => cat.CatProID === CatProID);
  let sourceArray;

  if (index !== -1) {
    sourceArray = slotProps.item.raw.SubCategorias;
  } else {
    index = categoriasSeleccionadas.value.findIndex(cat => cat.CatProID === CatProID);
    if (index !== -1) {
      sourceArray = categoriasSeleccionadas.value;
    }
  }

  // Si encontramos el índice en alguno de los dos arrays, procedemos a eliminar
  if (index !== -1) {
    eliminarCategoriaApi(CatProID).then(() => {
      // Eliminar la subcategoría del array correspondiente
      sourceArray.splice(index, 1);

      emit('updateData');
      refreshKey.value++;
    }).catch(error => {
      console.error("Hubo un error al eliminar la subcategoría", error);
    });
  } else {
    console.error("No se pudo encontrar la subcategoría con CatProID:", CatProID);
  }
};

//filtro select subcategorias
const subcategoriasDisponibles = computed(() => {
  return categoriasAgrupadas.value.map(categoriaAgrupada => {
    const subcategoriasYaAgregadas = categoriaAgrupada.SubCategorias.map(subCat => subCat.SubCategoriaID);
    const subCategoriasDisponibles = categoriaAgrupada.SubCategoriasByCategoria.filter(subCatByCat => {
      return !subcategoriasYaAgregadas.includes(subCatByCat.SubCategoriaID);
    });

    return {
      CategoriaID: categoriaAgrupada.CatProID,
      SubCategorias: subCategoriasDisponibles
    };
  });
});

const getSubCategoriasDisponibles = (categoriaID, slotProps) => {
  const categoria = subcategoriasDisponibles.value.find(cat => cat.CategoriaID === categoriaID);

  if (!categoria) return [];

  const subcategoriasEnSlot = slotProps.item.raw.SubCategorias.map(subCat => subCat.SubCategoria.SubCategoriaID);

  return categoria.SubCategorias.filter(subCat => !subcategoriasEnSlot.includes(subCat.SubCategoriaID));
};
function truncateLicitacion(item) {
  return item.Licitacion.length > 45 ? item.Licitacion.substring(0, 45) + '...' : item.Licitacion;
}
</script>
<template>
  <VDialog v-model="localDialog" width="720" @click:outside="close" style="overflow-y: auto;">
    <DialogCloseBtn @click="close" />
    <VCard :title="item.proveedor && item.proveedor.ProveedorID ? 'Editar Proveedor' : 'Crear Proveedor'">
      <VTabs v-model="currentTab">
        <VTab>Proveedor</VTab>
        <VTab v-if="item.proveedor && item.proveedor.ProveedorID">Licitaciones</VTab>
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
                <AppAutocomplete v-if="licitacionesDisponibles && licitacionesDisponibles.length"
                  :item-title="truncateLicitacion"
                  :hint="licitacionSeleccionada ? licitacionSeleccionada.Licitacion : 'Selecciona una licitación'"
                  :items="licitacionesDisponibles" placeholder="Seleccionar Licitación" return-object
                  v-model="licitacionSeleccionada" prepend-inner-icon="mdi-magnify" rounded theme="light" variant="solo"
                  center-affix="true" density="compact">
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
                  @input="updateAdjudicadoStatus(item)" :disabled="disabledSwitchLicitacion"/>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <VBtn small icon color="error" @click="eliminarLicitacion(item, index)" :disabled="disabledEliminarLicitacion">
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
                  <VBtn small icon color="success" @click="guardarContacto(contacto, index)">
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
                  return-object v-model="categoriaSeleccionada" prepend-inner-icon="mdi-magnify" rounded theme="light"
                  variant="solo">
                  <template v-slot:no-data>
                    <div class="px-4">No existen datos</div>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12" sm="12" md="2">
                <VBtn @click="agregarCategoria" small color="primary" class="ml-2" :disabled="agregarCatBoton">
                  +
                </VBtn>
              </VCol>
            </VRow>
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
                <tr class="v-data-table__tr">
                  <td>
                    <ul class="subcategorias-list">
                      <span class="subcat-actions mt-1">
                        <AppAutocomplete class="autocompleteSub" item-title="SubCategoria"
                          :items="getSubCategoriasDisponibles(slotProps.item.value.CatProID, slotProps)"
                          placeholder="SubCategoría" return-object
                          v-model="subCategoriaSeleccioandaPorCategoria[slotProps.item.value.CatProID]"
                          prepend-inner-icon="mdi-magnify" rounded theme="light" variant="solo">
                          <template v-slot:no-data>
                            <div class="px-4">No existen datos</div>
                          </template>
                        </AppAutocomplete>
                        <VBtn small color="primary" class="ml-2"
                          @click="agregarSubCategoria(slotProps, subCategoriaSeleccioandaPorCategoria[slotProps.item.value.CatProID])"
                          :disabled="agregarSubCatBoton">
                          +
                        </VBtn>
                      </span>
                      <h3>Subcategorías</h3>

                      <li v-for="(subcat, index) in slotProps.item.raw.SubCategorias" :key="subcat.SubCategoriaID">
                        <span class="subcat-icon">
                          <VIcon icon="tabler-avatar" size="24"></VIcon>
                        </span>
                        <span class="subcat-title">
                          {{ subcat.SubCategoria.SubCategoria }}
                        </span>
                        <span class="subcat-actions">
                          <IconBtn @click="eliminarSubCategoria(subcat.CatProID, subcat, index, slotProps)" color="error">
                            <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </span>
                      </li>
                      <li v-if="!slotProps.item.raw.SubCategorias || !slotProps.item.raw.SubCategorias.length">
                        No hay subcategorías disponibles.
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>

              <template v-slot:item.actions="{ item, index }">
                <VBtn small icon color="error" @click="eliminarCategoria(item.value.CatProID, subcat, index, item)"
                  :disabled="eliminarCatBoton">
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
.autocompleteSub {
  min-inline-size: 12em;
}

h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-block-end: 10px;
}

.subcategorias-list {
  inline-size: 100%;
  list-style-type: none;
  max-inline-size: none;
  padding-inline-start: 0;
}

.subcategorias-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-block-end: 1px dashed #ddd;
}

.subcat-icon {
  margin-inline-end: 15px;
}

.subcat-title {
  flex-grow: 1;
}

.subcat-actions {
  display: flex;
  gap: 10px;
}

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

.truncate-text {
  overflow: hidden;
  max-inline-size: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scrollable-text {
  max-inline-size: 200px;
  overflow-x: auto;
}
</style>

