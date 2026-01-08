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
            @delete-icon-clicked="(rowId) => {selectedTournamentIdIdForDelete = rowId; showDeleteTournamentConfirmation = true}"
            :show-actions="true"
        >
          <template #actions="{ row }">
            <span class="relative group text-nowrap" v-if="canEdit">
              <font-awesome :icon="['fas', 'users']"
                            @click="() => {selectedTournamentToShowTeams=row.id; showTournamentTeams = true}"
                            class="p-1.5 text-base rounded-full hover:text-orange-300 transition text-orange-400 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Teams
              </span>
            </span>
            <span class="relative group text-nowrap">
              <font-awesome :icon="['fas', 'volleyball']"
                            @click="() => navigateTo(`tournaments/${row.id}/games`)"
                            class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Games
              </span>
            </span>
          </template>
          <template #header>
            <div class="flex gap-6 items-center">
              <template v-if="canEdit">
                <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                            @onClick="() => navigateTo('tournaments/create')">
                  Create Tournament
                </BaseButton>
              </template>
            </div>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteTournament v-model:tournament-id="selectedTournamentIdIdForDelete"
                      v-model:visible="showDeleteTournamentConfirmation"/>
    <ShowTeams :tournament-id="selectedTournamentToShowTeams" v-model:visible="showTournamentTeams"/>
  </div>
</template>

<script setup lang="ts">

import TableStriped from "~/components/tables/TableStriped.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useUserStore} from "~/store/user";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import moment from "moment/moment";
import type Tournament from "~/interfaces/tournament/tournament";
import type TournamentTableData from "~/interfaces/tournament/tournamentTableData";
import DeleteTournament from "~/components/modals/tournament/DeleteTournament.vue";
import ShowTeams from "~/components/modals/tournament/ShowTeams.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import type League from "~/interfaces/league/leagues";
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";

const route = useRoute()
const id = route.params.tournamentGroupId
const leagueId = route.params.leagueId
const orderBy = ref('alias')
const orderDirection = ref('asc')
const count = ref(0 as Number)
const selectedTournamentIdIdForDelete = ref(0)
const showDeleteTournamentConfirmation = ref(false)
const tableData = ref([] as Array<TournamentTableData>)
const tournaments = ref([] as Array<Tournament>)
const selectedTournamentToShowTeams = ref(0)
const showTournamentTeams = ref(false)
const loading = ref(false)
const league = ref({} as League)

const userStore = useUserStore()

const {fetchTournaments} = useTournamentFetch()
const {fetchLeagueById} = useLeagueFetch()

const headers = [
  {
    label: 'Name',
    sortable: true,
    sortValue: 'alias',
    dataKey: 'alias',
  },
  {
    label: 'Short Name',
    sortable: true,
    sortValue: 'shortName',
    dataKey: 'shortName',
  },
  {
    label: 'Pools',
    sortable: true,
    sortValue: 'pools',
    dataKey: 'pools',
  },
  {
    label: 'Period',
    sortable: true,
    dataKey: 'period',
    sortValue: 'startDate',
  },
]

watch(showDeleteTournamentConfirmation, () => {
  if (!showDeleteTournamentConfirmation.value) {
    fetchData()
  }
})

onMounted(() => {
  fetchLeague()
  fetchData()
})

const canEdit = computed(() => {
  if (!league.value?.clubId) {
    return userStore.isAdmin
  }
  const user_roles = userStore.user?.user_roles.filter((role: any) => ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(role.roleId) && role.clubId))
  const clubIds = user_roles?.map((userRole: any) => userRole.clubId);
  return clubIds.includes(league.value.clubId)
})


async function fetchLeague() {
  league.value = await fetchLeagueById(+leagueId)
}

function sort(column: string) {
  tableData.value = []
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchData()
}


async function fetchData() {
  loading.value = true
  tournaments.value = []

  const response = await fetchTournaments(+id, orderBy.value, orderDirection.value)

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
    if (tournament.startDate) {
      period = moment(tournament.startDate).format('DD-MM-YYYY').toString() + ' - '
    }

    if (tournament.endDate) {
      period = !period ? moment(tournament.endDate).format('DD-MM-YYYY').toString() : period + moment(tournament.endDate).format('DD-MM-YYYY').toString()
    }

    tableData.value.push({
      id: tournament.id,
      alias: tournament.alias,
      shortName: tournament.shortName,
      pools: tournament.poolCount,
      period: period
    })
  })
  loading.value = false

}

</script>
