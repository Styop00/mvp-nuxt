<template>
  <div class="p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4 ">
      <TableStriped
          :headers="headers"
          :clickable="true"
          :data="coaches"
          title="Coaches"
          :loading="loading"
          :show-edit="isAdmin"
          :show-delete="isAdmin"
          class="bg-dark-surface-default min-h-[60vh]"
          @sorted="sort"
          @editIconClicked="editCoach"
          @deleteIconClicked="showDeleteConfirmation"
          :fixed-table="false"
      >
        <template #header>
          <div class="w-full flex gap-6 items-center justify-end">
            <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="() => navigateTo('/coaches/coaches/import-course')"
            >
              Import Course
            </BaseButton>
            <BaseButton
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                @onClick="createCoachModalShow"
            >
              Create Coach
            </BaseButton>
          </div>
        </template>
        <template #headerBottom>
          <div class="flex flex-nowrap justify-between w-full mb-4 items-end ">
            <div class="ml-4 flex items-center gap-4">
              <div class="flex gap-2 items-center my-3">
                <label for="roles" class="text-sm whitespace-nowrap">
                  Filter by
                </label>
                <div class="w-1/2">
                  <FilterSelect
                      :options="tournamentGroupNames"
                      v-model:value="selectedTournamentGroup"
                      class="min-w-64 w-full mr-3"
                  />
                </div>
              </div>
              <div class="flex gap-2 items-center my-3">
                <div class="w-1/2">
                  <FilterSelect
                      :options="ageOptions"
                      v-model:value="selectedAgeGroup"
                      class="min-w-48 w-full mr-3"
                  />
                </div>
              </div>
            </div>
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
                    @page-changed="fetchAllCoaches"
                />
              </template>
            </div>
          </div>
        </template>
      </TableStriped>
      <CreateCoachModal
          v-model:visible="isShowCreateModal"
          @refresh-data="fetchAllCoaches"
      />

      <ConfirmationDeleteModal
          v-model:visible="showConfirmModal"
          message="Are you sure you want to delete this coach?"
          @confirm="deleteCoachCustom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TableStriped from '~/components/tables/TableStriped.vue';
import type TableHeader from '~/interfaces/table/tableHeader';
import {useCoachesFetch} from "~/composables/useCoachesFetch/useCoachesFetch"
import {useUserStore} from '~/store/user';
import {useRouter} from 'vue-router';
import ConfirmationDeleteModal from '~/components/modals/coach/ConfirmationDeleteModal.vue';
import type SelectOptions from '~/interfaces/inputs/selectOptions';
import TablePagination from '~/components/pagination/TablePagination.vue';
import Select from '~/components/inputs/Select.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import SearchInput from '~/components/inputs/SearchInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import CreateCoachModal from '~/components/modals/coach/CreateCoachModal.vue';
import {useTournamentGroupFetch} from '~/composables/useTournamentGroupFetch/useTournamentGroupFetch';
import type TournamentConfigs from '~/interfaces/tournament/config/tournamentConfigs';
import {ageGroups} from '~/constants/ageGroups';
import FilterSelect from "~/components/inputs/FilterSelect.vue";

const {
  coaches,
  loading,
  fetchAllCoaches,
  sort,
  deleteCoach,
  count,
  limit,
  page,
  searchQuery,
  tournamentGroupId,
  ageGroup
} = useCoachesFetch();
const isShowCreateModal = ref(false)

function createCoachModalShow() {
  isShowCreateModal.value = true;
}

const router = useRouter();

const headers = [
  {label: 'Id', sortable: true, sortValue: 'id', dataKey: 'id', className: 'w-16'},
  {label: 'Name', sortable: true, sortValue: 'name', dataKey: 'name', className: 'w-48'},
  {label: 'License', sortable: true, sortValue: 'license', dataKey: 'license', className: 'w-16'},
  {label: 'Status', sortable: true, sortValue: 'end', dataKey: 'status', className: 'w-24'},
  {label: 'Email', sortable: true, sortValue: 'email', dataKey: 'email', className: 'w-24'},
  {label: 'Level', sortable: true, sortValue: 'level', dataKey: 'level', className: 'w-24'},
  {label: 'Active for Team', sortable: false, sortValue: '', dataKey: 'activeForTeam', className: 'min-w-36'},
  {label: 'Latest Course', sortable: false, sortValue: '', dataKey: 'latestCourse', className: 'w-48'},
] as Array<TableHeader>;

const userStore = useUserStore();
const isAdmin = computed(() => userStore.getUserRoleNames().includes('Super Admin', 'Association Admin'));

const tournamentGroupNames = ref([] as SelectOptions[]);

const {fetchTournamentGroupsNames} = useTournamentGroupFetch()

const selectedTournamentGroup = ref({
  label: "--- All Tournament Groups ---",
  value: null,
  disabled: false
} as unknown as SelectOptions)

const selectedAgeGroup = ref({
  label: '--- All Ages ---',
  value: null,
  disabled: false
} as unknown as SelectOptions)

const ageOptions = computed(() => {
  return [
    {
      label: '--- All Ages ---',
      value: null,
      disabled: false
    },
    ...ageGroups
  ]
})

async function fetchTournamentGroups() {
  const response = await fetchTournamentGroupsNames({
    season_sport_id: userStore.seasonSportId,
    is_active: true,
  }) as Array<TournamentConfigs>

  if (response.length) {
    tournamentGroupNames.value = response.map((group: any) => {
      return {
        label: group.name,
        value: group.id,
        disabled: false,
      }
    })
    tournamentGroupNames.value.unshift({
      label: '--- All Tournament Groups ---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }
}

function editCoach(id: number) {
  router.push(`/coaches/coaches/${id}`);
}

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

  return `${currentPageMinValue} - ${maxValue} of ${count.value}`;
});

const coachToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

function showDeleteConfirmation(id: number) {
  coachToDeleteId.value = id;
  showConfirmModal.value = true;
}

async function deleteCoachCustom() {
  if (coachToDeleteId.value !== null) {
    await deleteCoach(coachToDeleteId.value);
    fetchAllCoaches();
    coachToDeleteId.value = null;
  }
  showConfirmModal.value = false;
}

const limitOptions = ref([
  {label: "10", value: 10, disabled: false},
  {label: "20", value: 20, disabled: false},
  {label: "50", value: 50, disabled: false},
] as SelectOptions[]);

watch(page, () => {
  fetchAllCoaches();
});

watch(
    [tournamentGroupId, ageGroup, searchQuery, limit],
    debounce(() => {
      fetchAllCoaches();
    }, 500),
    {immediate: true}
);

watch(selectedTournamentGroup, () => {
  tournamentGroupId.value = selectedTournamentGroup.value.value
})

watch(selectedAgeGroup, () => {
  ageGroup.value = selectedAgeGroup.value.value
})

onMounted(() => {
  fetchTournamentGroups()
})
</script>
