<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
        :headers="headers"
        :clickable="false"
        :data="federations"
        title="Federations"
        :loading="loading"
        :show-edit="isAdmin"
        :show-delete="isAdmin"
        class="bg-white"
        @sorted="sort"
        @editIconClicked="editFederation"
        @deleteIconClicked="showDeleteConfirmation"
      >
        <template #header>
          <BaseButton
            class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block"
            @click="() => showCreateModal = true"
          >
            Create Federation
          </BaseButton>
        </template>
      </TableStriped>
    </div>
    <CreateOrUpdateFederationModal
      v-model:visible="showCreateModal"
      :id="editData.id"
      :name="editData.name"
      :invoicePrefix="editData.invoicePrefix"
      @refreshData="fetchFederations"
    />
    <ConfirmationModal
      v-model:visible="showConfirmModal"
      message="Are you sure you want to delete this federation?"
      @confirm="deleteFederationCustom"
      @refreshData="fetchFederations"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFederationsFetch } from '~/composables/useFederationsFetch/useFederationsFetch';
import TableStriped from '~/components/tables/TableStriped.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import CreateOrUpdateFederationModal from '~/components/modals/fedeations/CreateOrUpdate.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import ConfirmationModal from '~/components/modals/fedeations/ConfirmationDeleteModal.vue';
import {useUserStore} from "~/store/user";
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

const { federations, originalData, fetchFederations, sort, deleteFederation, loading } = useFederationsFetch();
const headers = ref([] as Array<TableHeader>)
const showCreateModal = ref(false);
const showConfirmModal = ref(false);
const editData = ref({
  id: 0,
  name: '',
  invoicePrefix: '',
});

const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.getUserRoleNames().includes('Super Admin')
})

onMounted(() => {
  fetchFederations();

  headers.value = [
    {
      label: 'Name',
      sortable: true,
      sortValue: 'name',
      dataKey: 'name',
    },
    {
      label: 'Invoice Prefix',
      sortable: true,
      sortValue: 'invoicePrefix',
      dataKey: 'invoicePrefix',
    },

  ]
});

let federationToDeleteId = ref<number | null>(null);

watch(showCreateModal, (newVal) => {
  if (!newVal) {
    editData.value = {
      id: 0,
      name: '',
      invoicePrefix: '',
    };
  }
});

function editFederation(id: number) {
  const federation = originalData.value.find((federation: { id: number; }) => federation.id === id);

  if (federation) {
    editData.value = {
      id: federation.id,
      name: federation.name,
      invoicePrefix: federation.invoicePrefix,
    };
    showCreateModal.value = true;
  }
}

function showDeleteConfirmation(id: number) {
  federationToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteFederationCustom() {
  if (federationToDeleteId.value !== null) {
    await deleteFederation(federationToDeleteId.value);

    federationToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}
</script>
