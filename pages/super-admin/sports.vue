<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
        :headers="headers"
        :clickable="false"
        :data="sports"
        :loading="loading"
        title="Sports"
        :show-edit="isAdmin"
        :show-delete="isAdmin"
        class="bg-dark-surface-default"
        @sorted="sort"
        @editIconClicked="editSport"
        @deleteIconClicked="showDeleteConfirmation"
      >
        <template #header>
          <BaseButton
            class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block"
            @click="() => showCreateModal = true"
          >
            Create Sport
          </BaseButton>
        </template>
      </TableStriped>
    </div>
    <CreateOrUpdateSportModal
      v-model:visible="showCreateModal"
      :id="editData.id"
      :name="editData.name"
      @refreshData="fetchSports"
    />
    <ConfirmationModal
      v-model:visible="showConfirmModal"
      message="Are you sure you want to delete this sport?"
      @confirm="deleteSportCustom"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useSportsFetch } from '~/composables/useSportsFetch/useSportsFetch';
import TableStriped from '~/components/tables/TableStriped.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import CreateOrUpdateSportModal from '~/components/modals/sports/CreateOrUpdate.vue';
import ConfirmationModal from '~/components/modals/sports/ConfirmationDeleteModal.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import { useUserStore } from '~/store/user';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

const { sports, originalData, fetchSports, sort, deleteSport, loading } = useSportsFetch();
const headers = ref([] as Array<TableHeader>);
const showCreateModal = ref(false);
const showConfirmModal = ref(false);
const editData = ref({
  id: 0,
  name: '',
});

const userStore = useUserStore();

const isAdmin = computed(() => {
  return userStore.getUserRoleNames().includes('Super Admin');
});

onMounted(() => {
  fetchSports();

  headers.value = [
    {
      label: 'Name',
      sortable: true,
      sortValue: 'name',
      dataKey: 'name',
    },
  ];
});

let sportToDeleteId = ref<number | null>(null);

watch(showCreateModal, (newVal) => {
  if (!newVal) {
    editData.value = {
      id: 0,
      name: '',
    };
  }
});

function editSport(id: number) {
  const sport = originalData.value.find((sport: { id: number }) => sport.id === id);

  if (sport) {
    editData.value = {
      id: sport.id,
      name: sport.name,
    };
    showCreateModal.value = true;
  }
}

function showDeleteConfirmation(id: number) {
  sportToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteSportCustom() {
  if (sportToDeleteId.value !== null) {
    await deleteSport(sportToDeleteId.value);
    sportToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}
</script>
