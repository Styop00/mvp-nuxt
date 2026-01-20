<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
       <Breadcrumb />
        <TableStriped
            :headers="headers"
            :clickable="false"
            :data="tableData"
            :loading="loading"
            title="Tournaments"
            class="bg-dark-surface-default"
            :show-edit="canEdit"
            :show-delete="canEdit"
            @sorted="sort"
            @edit-icon-clicked="(rowId) => navigateTo(`tournaments/${rowId}`)"
            @delete-icon-clicked="(rowId) => {selectedTournamentIdForDelete = rowId; showDeleteTournamentConfirmation = true}"
            :show-actions="true"
            :fixed-table="false"
            action-column-classes="w-72"
        >
          <template #actions="{ row }">
            <span class="relative group text-nowrap" v-if="canEdit">
              <font-awesome :icon="['fas', 'users']"
                            @click="() => {selectedTournamentToShowTeams=row.id; showTournamentTeams = true}"
                            class="p-1.5 text-base rounded-full hover:text-orange-300 transition text-orange-400 cursor-pointer"/>
              <span
                  class="absolute z-10 bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-surface-elevated text-text-primary border-border-default left-1/2 p-1.5 shadow-sm px-3 -translate-x-1/2 border rounded-lg transition-[background-color,border-color,color,box-shadow] duration-200">
                Teams
              </span>
            </span>
            <span class="relative group text-nowrap">
              <font-awesome :icon="['fas', 'volleyball']"
                            @click="() => navigateTo(`tournaments/${row.id}/games`)"
                            class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"/>
              <span
                  class="absolute z-10 bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-surface-elevated text-text-primary border-border-default left-1/2 p-1.5 shadow-sm px-3 -translate-x-1/2 border rounded-lg transition-[background-color,border-color,color,box-shadow] duration-200">
                Games
              </span>
            </span>
          </template>
          <template #header>
            <div class="flex gap-6 items-center justify-end">
              <template v-if="canEdit">
                <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                            @onClick="() => navigateTo('tournaments/create')">
                  Create Tournament
                </BaseButton>
              </template>
            </div>
          </template>
          <template #headerBottom>
            <div class="flex items-center justify-end w-full">
              <SearchInput
                  v-model="searchQuery"
                  placeholder="Search..."
                  class="min-w-48 ml-4"
              />
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between ml-4 items-center gap-6">
              <div>
                <p class="text-xs text-nowrap tracking-wider text-gray-400 font-bold">
                  {{ currentShowCount }}
                </p>
              </div>
              <div class="flex justify-start mx-2 lg:justify-end items-center gap-6">
                <p class="flex items-center text-nowrap gap-4">
                  Rows per page:
                  <Select :options="limitOptions" v-model:value="limit" direction="top" size="small"/>
                </p>
                <template v-if="count > (limit.value ?? 0)">
                  <div class="my-2 mr-2">
                    <TablePagination v-model:page="page" :page-count="pagesCount"/>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteTournament v-model:visible="showDeleteTournamentConfirmation"
                           v-model:tournamentId="selectedTournamentIdForDelete"/>
    <ShowTeams :tournament-id="selectedTournamentToShowTeams" v-model:visible="showTournamentTeams"/>
  </div>
</template>

<script setup lang="ts">
import TableStriped from "~/components/tables/TableStriped.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type Tournament from "~/interfaces/tournament/tournament";
import type TournamentTableData from "~/interfaces/tournament/tournamentTableData";
import {useUserStore} from "~/store/user";
import moment from "moment";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import DeleteTournament from "~/components/modals/tournaments/DeleteTournament.vue";
import SearchInput from "~/components/inputs/SearchInput.vue";
import ShowTeams from "~/components/modals/tournaments/ShowTeams.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";
import type League from "~/interfaces/league/leagues";
import type TableHeader from "~/interfaces/table/tableHeader";

const route = useRoute()
const id = route.params.leagueId
const count = ref(0 as Number)
const tournaments = ref([] as Array<Tournament>)
const tableData = ref([] as Array<TournamentTableData>)
const orderBy = ref('name')
const orderDirection = ref('asc')
const page = ref(1 as Number)
const showDeleteTournamentConfirmation = ref(false)
const selectedTournamentIdForDelete = ref(0)
const searchQuery = ref('')
const loading = ref(false)
const showTournamentTeams = ref(false)
const selectedTournamentToShowTeams = ref(0)
const league = ref({} as League)

const {fetchTournaments} = useTournamentFetch()
const {fetchLeagueById} = useLeagueFetch()

const userStore = useUserStore()

const limit = ref({
  label: '10',
  value: 10,
  disabled: false
} as SelectOptions)

const limitOptions = ref([{
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
    label: 'Id',
    sortable: true,
    sortValue: 'id',
    dataKey: 'id',
    className: 'w-28'
  },
  {
    label: 'Name',
    sortable: true,
    sortValue: 'name',
    dataKey: 'name',
    className: 'w-96'
  },
  {
    label: 'Short Name',
    sortable: true,
    sortValue: 'short_name',
    dataKey: 'shortName',
    className: 'w-48'
  },
  {
    label: 'Age/Sex',
    sortable: false,
    sortValue: '',
    dataKey: 'ageAndGender',
    className: 'w-48',
  },
  {
    label: 'Period',
    sortable: true,
    dataKey: 'period',
    sortValue: 'start_date',
  },
] as TableHeader[]

const canEdit = computed(() => {
  if (!league.value?.club_id) {
    return userStore.isAdmin
  }
  const user_roles = userStore.user?.user_roles.filter((role: any) => ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(role.roleId) && role.clubId))
  const clubIds = user_roles?.map((userRole: any) => userRole.club_id);
  return clubIds.includes(league.value.club_id)
})

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number))
})

const currentShowCount = computed(() => {
  if (count.value === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * +(limit.value.value ?? 0)
  let currentPageMinValue = (+page.value - 1) * +(limit.value.value ?? 0) + 1
  return currentPageMinValue + ' - ' + ((+count.value > currentPageMaxValue) ? currentPageMaxValue : count.value) + ' of ' + count.value
})

watch(page, () => {
  fetchTournamentsList()
})

watch([searchQuery, limit], () => {
  if (page.value === 1) {
    fetchTournamentsList()
  } else {
    page.value = 1
  }
})

watch(showDeleteTournamentConfirmation, () => {
  if (!showDeleteTournamentConfirmation.value) {
    fetchTournamentsList()
  }
})

onMounted(() => {
  fetchLeague()
  fetchTournamentsList()
})

async function fetchLeague() {
  league.value = await fetchLeagueById(+id)
}

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchGroups()
}

async function fetchTournamentsList() {
  if (loading.value) {
    return
  }
  tournaments.value = []
  loading.value = true

  const response = await fetchTournaments(+id, orderBy.value, orderDirection.value, +page.value, +(limit.value.value ?? 0), searchQuery.value)

  if (!response) {
    loading.value = false
    return
  }

  const res = response as { count: Number, rows: Array<Tournament> }
  count.value = res.count
  tournaments.value = res.rows

  tableData.value = []

  tournaments.value.forEach(tournament => {
    let period = ''
    if (tournament.start_date) {
      period = moment(tournament.start_date + '').format('DD-MM-YYYY').toString() + ' - '
    }

    if (tournament.end_date) {
      period = !period ? moment(tournament.end_date + '').format('DD-MM-YYYY').toString() : period + moment(tournament.end_date + '').format('DD-MM-YYYY').toString()
    }

    tableData.value.push({
      id: tournament.id,
      name: tournament.name,
      shortName: tournament.short_name,
      ageAndGender: (tournament.age_group ?? '-') + ' ' + (tournament.gender ?? '-'),
      period: period
    })
  })

  loading.value = false
}
</script>

