<template>
  <div class="p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
          :headers="headers"
          :clickable="true"
          :data="clubs"
          title="Clubs"
          :loading="loading"
          :show-edit="isAdmin"
          :show-delete="isAdmin"
          :fixed-table="false"
          action-column-classes="w-56"
          class="bg-dark-surface-default "
          @sorted="sort"
          @editIconClicked="editClub"
          @deleteIconClicked="showDeleteConfirmation"
          @rowClick="onRowClick"
      >
        <template #header v-if="isAdmin">
          <div class="flex gap-6 items-center justify-end">
            <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="createClub"
            >
              Create Club
            </BaseButton>
          </div>
        </template>
        <template #headerBottom>
          <div class="flex gap-6 w-full items-center justify-end">
            <SearchInput
                v-model="searchQuery"
                placeholder="Search..."
                class="min-w-48 ml-4"
            />
          </div>
        </template>
        <template #actions="{ row }">
          <span class="relative group text-nowrap">
              <font-awesome
                  :icon="['fas', 'user-group']"
                  @click="() => navigateTo(`clubs/${row.id}/users`)"
                  class="p-1.5 text-base rounded-full hover:text-fuchsia-500 transition text-fuchsia-600 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Users
              </span>
          </span>
          <span class="relative group text-nowrap">
            <font-awesome
                :icon="['fas', 'users']"
                @click="() => navigateTo(`clubs/${row.id}/teams`)"
                class="p-1.5 text-base rounded-full hover:text-orange-300 transition text-orange-400 cursor-pointer"
            />
            <span
                class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
            >
              Teams
            </span>
          </span>
          <span class="relative group text-nowrap">
            <font-awesome
                :icon="['fas', 'volleyball']"
                @click="() => navigateTo(`clubs/${row.id}/games`)"
                class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"
            />
            <span
                class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
            >
              Games
            </span>
          </span>
          <span class="relative group text-nowrap">
            <font-awesome
                :icon="['fas', 'bars']"
                @click="showCourtPriority(row.id)"
                class="p-1.5 text-base rounded-full hover:text-purple-400 transition text-purple-500 cursor-pointer"
            />
            <span
                class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
            >
              Courts
            </span>
          </span>
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
                    @page-changed="fetchClubs"
                />
              </template>
            </div>
          </div>
        </template
        >
      </TableStriped>

      <CourtPriorities
          v-model:visible="showCourtPriorityModal"
          v-model:id="selectedClubId"
      />
      <ConfirmationDeleteModal
          v-model:visible="showConfirmModal"
          message="Are you sure you want to delete this venue?"
          @confirm="deleteClubCustom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TableStriped from '~/components/tables/TableStriped.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch"
import {useUserStore} from '~/store/user';
import {useRouter} from 'vue-router';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import BaseButton from '~/components/buttons/BaseButton.vue';
import TablePagination from '~/components/pagination/TablePagination.vue';
import ConfirmationDeleteModal from '~/components/modals/clubs/ConfirmationDeleteModal.vue';
import Select from '~/components/inputs/Select.vue';
import SearchInput from '~/components/inputs/SearchInput.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import CourtPriorities from '~/components/modals/clubs/CourtPriorities.vue';

const headers = [
  {label: 'Name', sortable: true, sortValue: 'name', dataKey: 'name', className: 'w-96'},
  {label: 'License', sortable: true, sortValue: 'license', dataKey: 'license', className: 'w-32'},
  {label: 'Managers', sortable: false, sortValue: '', dataKey: 'managers'},
  {label: 'Status', sortable: false, sortValue: 'is_active', dataKey: 'isActive', className: 'w-32'},
] as Array<TableHeader>;
const router = useRouter();
const showConfirmModal = ref(false);
const showCourtPriorityModal = ref(false);
const clubToDeleteId = ref<number | null>(null);

const limitOptions = ref([
  {label: "10", value: 10, disabled: false},
  {label: "20", value: 20, disabled: false},
  {label: "50", value: 50, disabled: false},
] as SelectOptions[]);

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number));
});

const {
  clubs,
  fetchClubs,
  sort,
  deleteClub,
  page,
  limit,
  count,
  searchQuery,
  loading,
} = useClubsFetch()

const currentShowCount = computed(() => {
  if (!count.value || count.value === 0) {
    return '0 of 0';
  }

  const currentPage = +page.value;
  const perPage = +limit.value.value;

  const currentPageMaxValue = currentPage * perPage;
  const currentPageMinValue = (currentPage - 1) * perPage + 1;

  const maxValue = currentPageMaxValue > Number(count.value) ? count.value : currentPageMaxValue;

  return `${currentPageMinValue} - ${maxValue} of ${count.value}`;
});

const userStore = useUserStore();
const isAdmin = computed(() => userStore.getUserRoleNames().includes('Super Admin', 'Association Admin'));

function editClub(id: number) {
  router.push(`/tournament/clubs/${id}`);
}

function createClub() {
  router.push(`/tournament/clubs/create`);
}

const selectedClubId = ref()

async function showCourtPriority(id: number) {
  showCourtPriorityModal.value = true;
  selectedClubId.value = id
}

function showDeleteConfirmation(id: number) {
  clubToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteClubCustom() {
  if (clubToDeleteId.value !== null) {
    await deleteClub(clubToDeleteId.value);
    fetchClubs();
    clubToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}

function onRowClick(row: any) {
  editClub(row.id);
}

watch(page, () => {
  fetchClubs();
});

watch([limit, searchQuery], () => {
  if (page.value === 1) {
    fetchClubs();
  } else {
    page.value = 1;
  }
});

onMounted(() => {
  fetchClubs();
});
</script>
