<template>
  <div class="p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
          :headers="headers"
          :clickable="true"
          :data="venues"
          title="Venues"
          :loading="loading"
          :show-edit="isAdmin"
          :show-delete="isAdmin"
          class="bg-white"
          :fixed-table="false"
          action-column-classes="w-40"
          @sorted="sort"
          @editIconClicked="editVenue"
          @deleteIconClicked="showDeleteConfirmation"
          @rowClick="onRowClick"
      >
        <template #header v-if="isAdmin">
          <div class="flex gap-6 items-center justify-end">
            <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="createVenue"
            >
              Create Venue
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
              <font-awesome :icon="['fas', 'volleyball']"
                            @click="() => navigateTo(`venues/${row.id}/games`)"
                            class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Games
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
                    @page-changed="fetchVenues"
                />
              </template>
            </div>
          </div>
        </template>
      </TableStriped>
    </div>
    <ConfirmationModal
        v-model:visible="showConfirmModal"
        message="Are you sure you want to delete this venue?"
        @confirm="deleteVenueCustom"
    />
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useVenuesFetch} from '~/composables/useVenuesFetch/useVenuesFetch';
import BaseButton from '~/components/buttons/BaseButton.vue';
import ConfirmationModal from '~/components/modals/venues/ConfirmationDeleteModal.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import TablePagination from '~/components/pagination/TablePagination.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import Select from "~/components/inputs/Select.vue";
import SearchInput from '~/components/inputs/SearchInput.vue';
import {useUserStore} from '~/store/user';
import TableStriped from "~/components/tables/TableStriped.vue";
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

const {venues, fetchVenues, sort, deleteVenue, page, limit, count, searchQuery, loading} = useVenuesFetch();

const headers = [
  {label: 'Id', sortable: true, sortValue: 'id', dataKey: 'id', className: 'w-32'},
  {label: 'Name', sortable: true, sortValue: 'name', dataKey: 'name'},
  {label: 'Country', sortable: true, sortValue: 'country', dataKey: 'country', className: 'w-72'},
  {label: 'Courts', sortable: false, sortValue: 'courts', dataKey: 'courts', className: 'w-96'},
] as TableHeader[];
const showConfirmModal = ref(false);
const venueToDeleteId = ref<number | null>(null);
const router = useRouter();


const userStore = useUserStore();
const isAdmin = computed(() => userStore.getUserRoleNames().includes('Super Admin', 'Association Admin'));

const limitOptions = ref([
  {label: "10", value: 10, disabled: false},
  {label: "20", value: 20, disabled: false},
  {label: "50", value: 50, disabled: false},
] as SelectOptions[]);

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number));
});

onMounted(() => {
  fetchVenues();
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

  return `${currentPageMinValue} - ${maxValue} of ${count.value}`;
});

watch(page, () => {
  fetchVenues();
});

watch([limit, searchQuery], () => {
  if (page.value === 1) {
    fetchVenues();
  } else {
    page.value = 1;
  }
});

function editVenue(id: number) {
  router.push(`/tournament/venues/${id}`);
}

function createVenue() {
  router.push(`/tournament/venues/create`);
}

function showDeleteConfirmation(id: number) {
  venueToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteVenueCustom() {
  if (venueToDeleteId.value !== null) {
    await deleteVenue(venueToDeleteId.value);
    fetchVenues();
    venueToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}

function onRowClick(row: any) {
  editVenue(row.id);
}
</script>
