<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { VDataTable } from 'vuetify/labs/VDataTable'
import data from '../data/datatable2'

const editDialog = ref(false)
const deleteDialog = ref(false)

const defaultItem = ref({
  responsive_id: '',
  id: -1,
  avatar: '',
  full_name: '',
  post: '',
  email: '',
  city: '',
  start_date: '',
  salary: -1,
  age: '',
  experience: '',
  status: -1,
})

const search = ref('')

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [''],
  sortDesc: [false],
})

const editedItem = ref(defaultItem.value)
const editedIndex = ref(-1)
const userList = ref(data)

const selectedOptions = [
  {
    text: 'Current',
    value: 1,
  },
  {
    text: 'Professional',
    value: 2,
  },
  {
    text: 'Rejected',
    value: 3,
  },
  {
    text: 'Resigned',
    value: 4,
  },
  {
    text: 'Applied',
    value: 5,
  },
]

// headers
const headers = [
  {
    title: 'NAME',
    key: 'full_name',
  },
  {
    title: 'EMAIL',
    key: 'email',
  },
  {
    title: 'DATE',
    key: 'start_date',
  },
  {
    title: 'SALARY',
    key: 'salary',
  },
  {
    title: 'AGE',
    key: 'age',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]

const resolveStatusVariant = status => {
  if (status === 1)
    return {
      color: 'primary',
      text: 'Current',
    }
  else if (status === 2)
    return {
      color: 'success',
      text: 'Professional',
    }
  else if (status === 3)
    return {
      color: 'error',
      text: 'Rejected',
    }
  else if (status === 4)
    return {
      color: 'warning',
      text: 'Resigned',
    }
  else
    return {
      color: 'info',
      text: 'Applied',
    }
}

const editItem = item => {
  editedIndex.value = userList.value.indexOf(item)
  editedItem.value = { ...item }
  editDialog.value = true
}

const deleteItem = item => {
  editedIndex.value = userList.value.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const close = () => {
  editDialog.value = false
  editedIndex.value = -1
  editedItem.value = { ...defaultItem.value }
}

const closeDelete = () => {
  deleteDialog.value = false
  editedIndex.value = -1
  editedItem.value = { ...defaultItem.value }
}

const save = () => {
  if (editedIndex.value > -1)
    Object.assign(userList.value[editedIndex.value], editedItem.value)
  else
    userList.value.push(editedItem.value)
  close()
}

const deleteItemConfirm = () => {
  userList.value.splice(editedIndex.value, 1)
  closeDelete()
}

watch(options, newVal => {
  if (newVal.itemsPerPage <= 0) {
    options.value.itemsPerPage = 1
  }
})
</script>

<template>
  <div>
    <div class="me-3 d-flex gap-3 mb-4 mt-1">
      <VBtn prepend-icon="tabler-plus" :to="{ name: 'checklist' }">
        Crear Nuevo Checklist
      </VBtn>
    </div>
    <VRow>
      <VCol cols="12" offset-md="8" md="4">
        <AppTextField v-model="search" density="compact" placeholder="Buscar" append-inner-icon="tabler-search"
          single-line hide-details dense outlined />
      </VCol>
    </VRow>
    <VDataTable :headers="headers" :items="userList" :items-per-page="options.itemsPerPage" :page="options.page"
      :search="search" @update:options="options = $event">
      <template #item.full_name="{ item }">
        <div class="d-flex align-center">
          <VAvatar size="32" :color="item.raw.avatar ? '' : 'primary'"
            :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.raw.avatar ? 'tonal' : undefined">
            <VImg v-if="item.raw.avatar" :src="item.raw.avatar" />
            <span v-else>{{ avatarText(item.raw.full_name) }}</span>
          </VAvatar>

          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text--primary text-truncate">{{ item.raw.full_name }}</span>
            <small>{{ item.raw.post }}</small>
          </div>
        </div>
      </template>

      <!-- status -->
      <template #item.status="{ item }">
        <VChip :color="resolveStatusVariant(item.raw.status).color" size="small">
          {{ resolveStatusVariant(item.raw.status).text }}
        </VChip>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn @click="editItem(item.raw)">
            <VIcon icon="mdi-pencil-outline" />
          </IconBtn>
          <IconBtn @click="deleteItem(item.raw)">
            <VIcon icon="mdi-delete-outline" />
          </IconBtn>
        </div>
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
                :length="Math.ceil(userList.length / options.itemsPerPage)" />
            </VCol>
          </VRow>
        </VCardText>
      </template>
    </VDataTable>
  </div>

  <!-- 👉 Edit Dialog  -->
  <VDialog v-model="editDialog" max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="headline">Edit Item</span>
      </VCardTitle>

      <VCardText>
        {{ editedItem?.full_name }}
        <VContainer>
          <VRow>
            <!-- full_name -->
            <VCol cols="12" sm="6" md="4">
              <VTextField v-model="editedItem.full_name" label="User name" />
            </VCol>

            <!-- email -->
            <VCol cols="12" sm="6" md="4">
              <VTextField v-model="editedItem.email" label="Email" />
            </VCol>

            <!-- salary -->
            <VCol cols="12" sm="6" md="4">
              <VTextField v-model="editedItem.salary" label="Salary" prefix="$" type="number" />
            </VCol>

            <!-- age -->
            <VCol cols="12" sm="6" md="4">
              <VTextField v-model="editedItem.age" label="Age" type="number" />
            </VCol>

            <!-- start date -->
            <VCol cols="12" sm="6" md="4">
              <VTextField v-model="editedItem.start_date" label="Date" />
            </VCol>

            <!-- status -->
            <VCol cols="12" sm="6" md="4">
              <VSelect v-model="editedItem.status" :items="selectedOptions" item-title="text" item-value="value"
                label="Standard" variant="underlined" readonly />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="close">
          Cancel
        </VBtn>

        <VBtn color="success" variant="elevated" @click="save">
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- 👉 Delete Dialog  -->
  <VDialog v-model="deleteDialog" max-width="500px">
    <VCard>
      <VCardTitle>
        Are you sure you want to delete this item?
      </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="closeDelete">
          Cancel
        </VBtn>

        <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
          OK
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
