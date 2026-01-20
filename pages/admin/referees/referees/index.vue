<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4 ">
      <TableStriped
        :headers="headers"
        :clickable="true"
        :data="referees"
        title="Referees"
        :loading="loading"
        :show-edit="isAdmin"
        :show-delete="isAdmin"
        class="bg-dark-surface-default min-h-[60vh]"
        @sorted="sort"
        @editIconClicked="editReferee"
        @deleteIconClicked="showDeleteConfirmation"
        :fixed-table="false"
      >
        <template #header>
          <div class="flex gap-6 items-center">
            <template v-if="isAdmin">
              <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="() => navigateTo('/referees/referees/create')"
              >
                Create Referee
              </BaseButton>
            </template>
          </div>
        </template>
        <template #headerBottom>
          <div class="flex mb-4 flex-wrap justify-end w-full items-end ">
            <div class="flex items-end">
              <SearchInput
                v-model="searchQuery"
                placeholder="Search..."
                class="min-w-48 "
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between ml-4 items-center gap-6">
            <div>
              <p
                class="text-xs text-nowrap tracking-wider text-gray-400 font-bold"
              >
                {{ currentShowCount }}
              </p>
            </div>
            <div
              class="flex justify-start mx-2 lg:justify-end items-center gap-6"
            >
              <p class="flex items-center text-nowrap gap-4 my-3 text-sm">
                Rows per page:
                <Select
                  :options="limitOptions"
                  v-model:value="limit"
                  direction="top"
                />
              </p>
              <template v-if="count > limit.value">
                <TablePagination
                  v-model:page="page"
                  :page-count="pagesCount"
                  @page-changed="fetchAllReferees"
                />
              </template>
            </div>
          </div>
        </template>
      </TableStriped>
      <ConfirmationDeleteModal
        v-model:visible="showConfirmModal"
        message="Are you sure you want to delete this referee?"
        @confirm="deleteCoachCustom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TableStriped from '~/components/tables/TableStriped.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import TablePagination from '~/components/pagination/TablePagination.vue';
import Select from '~/components/inputs/Select.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import SearchInput from '~/components/inputs/SearchInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useRefereesFetch } from "~/composables/useRefereeFetch/useRefereeFetch"
import ConfirmationDeleteModal from '~/components/modals/referee/ConfirmationDeleteModal.vue';

const router = useRouter();

const { referees, loading, fetchAllReferees, sort, count, limit, page, searchQuery, deleteReferee } = useRefereesFetch();
const userStore = useUserStore();

const refereeToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);
const headers = [
  { label: 'Id', sortable: true, sortValue: 'id', dataKey: 'id', className: 'w-16' },
  { label: 'Name', sortable: true, sortValue: 'name', dataKey: 'name', className: 'w-48' },
  { label: 'Address', sortable: false, sortValue: '', dataKey: 'address', className: 'min-w-24' },
  { label: 'No', sortable: true, sortValue: 'license', dataKey: 'no', className: 'w-24' },
  { label: 'Email', sortable: true, sortValue: 'email', dataKey: 'email', className: 'min-w-24' },
  { label: 'Level', sortable: false, sortValue: '', dataKey: 'level', className: 'w-24' },
] as Array<TableHeader>;

const limitOptions = ref([
  { label: "10", value: 10, disabled: false },
  { label: "20", value: 20, disabled: false },
  { label: "50", value: 50, disabled: false },
] as SelectOptions[]);

const isAdmin = computed(() => userStore.getUserRoleNames().includes('Super Admin', 'Association Admin'));

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number));
});

const currentShowCount = computed(() => {
  if (!count.value || count.value === 0) {
    return '0 of 0';
  }

  const currentPage = +page.value;
  const perPage = +limit.value.value;

  const currentPageMaxValue = currentPage * perPage;
  const currentPageMinValue = (currentPage - 1) * perPage + 1;

  const maxValue = currentPageMaxValue > Number(count.value) ? count.value : currentPageMaxValue;

  return `${currentPageMinValue} - ${maxValue} of ${count.value }`;
});

function editReferee(id: number) {
  router.push(`/referees/referees/${id}`);
}

function showDeleteConfirmation(id: number) {
  refereeToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteCoachCustom() {
  if (refereeToDeleteId.value !== null) {
    await deleteReferee(refereeToDeleteId.value);
    fetchAllReferees();
    refereeToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}

watch(page, () => {
  fetchAllReferees();
});

watch(
  [searchQuery, limit],
  debounce(() => {
    fetchAllReferees();
  }, 500),
  { immediate: true }
);
</script>
