<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :loading="loading"
            :headers="headers"
            :clickable="false"
            :data="blockedPeriodsData"
            :title="$t('blocked periods')"
            class="bg-dark-surface-default min-h-96 flex flex-col justify-between"
            :show-edit="true"
            :show-delete="true"
            @sorted="sort"
            @edit-icon-clicked="(rowId) => showEditBlockedPeriod(rowId)"
            @delete-icon-clicked="(rowId) => showDeleteConfirmation(rowId)"
            :show-actions="true"
            :fixed-table="false"
            action-column-classes="w-28"
        >
          <template #header>
            <div class="flex gap-4 items-center justify-end ml-10">
              <div class="flex gap-6 items-center">
                <BaseButton
                    class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                    @onClick="() => showEditPeriodModal = true"
                >
                  Create Blocked Period
                </BaseButton>
              </div>
            </div>
          </template>
          <template #headerBottom>
            <div class="flex w-full gap-4 ml-4 items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex gap-4 items-center">
                  <span class="text-nowrap text-sm font-bold">Filter by</span>
                  <FilterSelect :options="groupOptions" v-model:value="filter" class="!w-72"/>
                </div>
                <div class="relative">
                  <TextInput
                      :value="range.join(' - ')"
                      placeholder="Date"
                      @click.prevent="() => showCalendar()"
                      :prevent-input="true"
                      :required="true"
                      class="min-w-52"
                  />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                       @click.stop
                       v-if="showRangeCalendar"
                       style="z-index: 99999 !important; position: absolute !important;">
                    <BaseButton
                        class="!py-1 !px-1 mx-auto mt-2 text-xs sm:text-base sm:!px-8 block"
                        @click="() => {range = []; showRangeCalendar = false}"
                    >
                      Clear Date Filter
                    </BaseButton>
                    <RangePicker
                        @close="showRangeCalendar = false"
                        v-model:model-value="range"
                        color="blue"
                    />
                  </div>
                </div>
              </div>
              <SearchInput
                  v-model="searchQuery"
                  placeholder="Search"
                  class="xl:min-w-48 ml-4 min-w-44"
              />
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
                  class="flex justify-start m-2 lg:justify-end items-center gap-6"
              >
                <p class="flex items-center text-nowrap gap-4">
                  Rows per page:
                  <Select
                      :options="limitOptions"
                      v-model:value="limit"
                      direction="top"
                      size="small"
                  />
                </p>
                <template v-if="count > +(limit.value ?? 0)">
                  <div class="my-2 mr-2">
                    <TablePagination
                        v-model:page="page"
                        :page-count="pagesCount"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteBlockedPeriod
        v-model:blocked-period-id="periodIdForDelete"
        v-model:visible="showConfirmModal"
        @deleted="fetchPeriods"
    />
    <CreateOrUpdateBlockedPeriod
        v-model:visible="showEditPeriodModal"
        v-model:blocked-period-id="periodIdForUpdate"
        :tournaments="tournaments"
        @re-fetch="fetchPeriods"
    />
  </div>
</template>
<script setup lang="ts">
import Select from "~/components/inputs/Select.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import TableStriped from "~/components/tables/TableStriped.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import RangePicker from "~/components/datePicker/RangePicker.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import SearchInput from "~/components/inputs/SearchInput.vue";
import {useBlockedPeriodsFetch} from "~/composables/useBlockedPeriodsFetch/useBlockedPeriodsFetch";
import type BlockedPeriod from "~/interfaces/blockedPeriods/blockedPeriod";
import type BlockedPeriodsTable from "~/interfaces/blockedPeriods/blockedPeriodsTable";
import CreateOrUpdateBlockedPeriod from "~/components/modals/blocked-periods/CreateOrUpdateBlockedPeriod.vue";
import DeleteBlockedPeriod from "~/components/modals/blocked-periods/DeleteBlockedPeriod.vue";
import type Tournament from "~/interfaces/tournament/tournament";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import {useUserStore} from "~/store/user";
import FilterSelect from "~/components/inputs/FilterSelect.vue";

const userStore = useUserStore()

const tournaments = ref([] as Array<any>)
const orderBy = ref('title')
const orderDirection = ref('asc')
const page = ref(1)
const blockedPeriods = ref([] as Array<BlockedPeriod>)
const blockedPeriodsData = ref([] as Array<BlockedPeriodsTable>)
const count = ref(0 as number)
const loading = ref(false)
const range = ref([])

const searchQuery = ref('')
const periodIdForDelete = ref(0)
const periodIdForUpdate = ref(0)
const showConfirmModal = ref(false)
const showEditPeriodModal = ref(false)
const showRangeCalendar = ref(false)
const filter = ref({
  label: '--- Select Tournament ---',
  value: null,
  disabled: false,
} as SelectOptions)

const {fetchBlockedPeriods} = useBlockedPeriodsFetch()
const {fetchTournamentsNames} = useTournamentFetch()

const filterOptions = [
  {
    label: '--- Select Tournament Group ---',
    value: null,
    disabled: false,
  },
  {
    label: 'All',
    value: 'all',
    disabled: false,
  }
] as Array<SelectOptions>

const limit = ref({
  label: '10',
  value: 10,
  disabled: false
} as SelectOptions)

const limitOptions = ref([
  {
    label: '10',
    value: 10,
    disabled: false
  },
  {
    label: '20',
    value: 20,
    disabled: false
  },
  {
    label: '50',
    value: 50,
    disabled: false
  }
] as SelectOptions[])

const headers = [
  {
    label: 'Title',
    sortable: true,
    sortValue: 'title',
    dataKey: 'title',
    className: 'w-72'
  },
  {
    label: 'Description',
    sortable: true,
    sortValue: 'description',
    dataKey: 'description',
  },
  {
    label: 'Start Date',
    sortable: true,
    sortValue: 'startDate',
    dataKey: 'startDate',
    className: 'w-44',
  },
  {
    label: 'End Date',
    sortable: true,
    sortValue: 'endDate',
    dataKey: 'endDate',
    className: 'w-44'
  },
  {
    label: 'Tournaments',
    sortable: false,
    dataKey: 'tournamentsCount',
    sortValue: '',
    className: 'w-44'
  },
]

watch(page, () => {
  fetchPeriods()
})

watch([searchQuery, limit, range, filter], () => {
  if (page.value === 1) {
    fetchPeriods()
  } else {
    page.value = 1
  }
})

const groupOptions = computed(() => {
  const data = tournaments.value.map(tournament => {
    return {
      label: tournament.name,
      value: tournament.value,
      disabled: false,
    }
  })

  return [
    ...filterOptions,
    ...data,
  ]
})

const pagesCount = computed(() => {
  return Math.ceil(count.value / (limit.value.value as number))
})

const currentShowCount = computed(() => {
  if (count.value === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * +(limit.value.value ?? 0)
  let currentPageMinValue = (+page.value - 1) * +(limit.value.value ?? 0) + 1
  return currentPageMinValue + ' - ' + ((count.value > currentPageMaxValue) ? currentPageMaxValue : count.value) + ' of ' + count.value
})

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchPeriods()
}

function showDeleteConfirmation(id: number) {
  periodIdForDelete.value = id;
  showConfirmModal.value = true;
}

function showEditBlockedPeriod(id: number) {
  periodIdForUpdate.value = id;
  showEditPeriodModal.value = true;
}

function showCalendar() {
  setTimeout(() => showRangeCalendar.value = true)
}

async function fetchTournaments() {
  const response = await fetchTournamentsNames({
    season_sport_id: userStore.seasonSportId,
    is_active: true,
  }) as Array<Tournament>

  if (response.length) {
    tournaments.value = response.map((tournament: any) => {
      return {
        name: tournament.name,
        value: tournament.id,
      }
    })
  }
}

async function fetchPeriods() {
  loading.value = true
  const res = await fetchBlockedPeriods({
    page: page.value,
    limit: limit.value.value,
    orderBy: orderBy.value,
    orderDirection: orderDirection.value,
    searchTerm: searchQuery.value,
    ...(range.value ? {
      range: range.value
    } : {}),
    ...(filter.value.value ? filter.value.value === 'all' ? {blockAll: true} : {tournamentId: filter.value.value} : {})
  })

  blockedPeriods.value = res.rows
  count.value = +res.count
  blockedPeriodsData.value = blockedPeriods.value.map(period => {
    let tournamentsCount = 'All'
    if (!period.blockAll) {
      tournamentsCount = `
      <div> ${period.tournaments?.length || 0} tournaments
        <span class="relative group text-nowrap ">
          <span class="w-4 inline-block align-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#00d9c0" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
          </span>
          <span
              class="absolute z-[999] top-full text-xs mb-1 tracking-wider group-hover:!inline-block hidden inline-block w-fit !bg-dark-surface-default left-1/2 shadow-2xl -translate-x-1/2 p-3 ml-1 rounded-md"
          >
            ${period.tournaments?.map(tournament =>
          `
          <span class="text-nowrap flex items-center justify-start gap-2">
          <svg class="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#00d9c0" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
          ${tournament.name}
          </span>
          `
      ).join(' ') || ''}
          </span>
        </span>
        </div>
      `
    }
    return {
      id: period.id,
      title: period.title,
      description: period.description,
      startDate: period.startDate,
      endDate: period.endDate,
      tournamentsCount: tournamentsCount
    }
  })
  loading.value = false
}

onMounted(() => {
  document.body.addEventListener('click', () => showRangeCalendar.value = false)
  fetchPeriods()
  fetchTournaments()
})
</script>
