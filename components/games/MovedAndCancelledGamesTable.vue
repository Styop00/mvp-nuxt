<template>
  <div class="min-w-full shadow-sm rounded-2xl overflow-hidden bg-surface-default border border-border-default transition-[background-color,border-color,box-shadow] duration-200 min-h-96 flex flex-col justify-between">
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border-default transition-[border-color] duration-200">
        <p
            class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-text-primary transition-colors duration-200"
        >
        <span
            class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"
        />
          {{ type === 'moves' ? 'Moves' : 'Cancellation / No-shows' }}
        </p>
      </div>
      <div class="w-full border-b border-border-default bg-bg-primary/30 transition-[background-color,border-color] duration-200 p-4">
        <div class="flex flex-col xl:flex-row gap-4 xl:gap-6 w-full items-stretch xl:items-center justify-between bg-gradient-to-br from-surface-default/40 via-bg-primary/30 to-surface-default/40 backdrop-blur-sm relative transition-[background-color,border-color] duration-200">
          <!-- Filters Section -->
          <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center flex-1">
            <!-- Filter Label -->
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 shadow-sm hover:shadow-sm hover:border-brand-primary/30 transition-all duration-200">
              <font-awesome :icon="['fas', 'filter']" class="text-brand-primary-color text-sm"/>
              <span class="text-nowrap text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider whitespace-nowrap transition-colors duration-200">Filters</span>
            </div>

            <!-- Tournament Group Filter -->
            <div class="flex items-center gap-3 w-full sm:w-auto group relative">
              <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                <font-awesome :icon="['fas', 'layer-group']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
              </div>
              <SelectMultiple
                  v-model:value="selectedTournament"
                  :options="tournaments"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  placeholder="Select Tournament Groups"
                  label="label"
                  track-by="value"
                  :preselect-first="true"
                  class="w-full sm:w-auto sm:min-w-[200px] flex-1"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>

            <!-- Tournament Filter -->
            <div class="flex items-center gap-3 w-full sm:w-auto group relative" v-if="tournamentOptions.length">
              <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                <font-awesome :icon="['fas', 'trophy']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
              </div>
              <SelectMultiple
                  v-model:value="selectedTournament"
                  :options="tournamentOptions"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  placeholder="Select Tournament"
                  label="label"
                  track-by="value"
                  :preselect-first="true"
                  class="w-full sm:w-auto sm:min-w-[200px] flex-1"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>

            <!-- Club Filter -->
            <div class="flex items-center gap-3 w-full sm:w-auto group relative">
              <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                <font-awesome :icon="['fas', 'landmark']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
              </div>
              <SelectMultiple
                  v-model:value="selectedClub"
                  :options="clubs"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  placeholder="Select Club"
                  label="label"
                  track-by="value"
                  :preselect-first="true"
                  class="w-full sm:w-auto sm:min-w-[200px] flex-1"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>

            <!-- Penalty Status Filter -->
            <div class="flex items-center gap-3 w-full sm:w-auto group relative">
              <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
                <font-awesome :icon="['fas', 'check-circle']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
              </div>
              <Select :options="penaltyStatusOptions" v-model:value="penaltyStatus" class="w-full sm:w-auto sm:min-w-[180px] flex-1"/>
            </div>
          </div>
        </div>
      </div>
      <div class="relative" style="z-index: 1;">
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto relative">
          <table class="bg-surface-default border border-border-default text-text-primary w-full border-t rounded-2xl min-w-full transition-[background-color,border-color,color] duration-200"
                 :class="{'opacity-30': loading}">
            <thead class="bg-surface-elevated">
            <template v-for="header in headers">
              <th
                  class="p-4 text-nowrap text-left text-text-primary font-semibold sticky top-0 bg-surface-elevated z-10 border-b border-border-default transition-[background-color,border-color,color] duration-200"
                  :class="{
                  'cursor-pointer': header.sortable,
                  [header.className as string]: !!header.className
                }"
                  @click="sort(header)"
              >
                <div
                    class="flex items-center gap-2 w-fit"
                    :class="{'cursor-pointer': header.sortable}"
                >
                  {{ header.label }}
                  <template v-if="header.sortable">
                    <font-awesome :icon="['fas', 'sort']" class="text-xs text-text-tertiary hover:text-brand-primary transition-colors"/>
                  </template>
                </div>
              </th>
            </template>
            <th class="p-4 text-text-primary font-semibold sticky top-0 bg-surface-elevated z-10 border-b border-border-default transition-[background-color,border-color,color] duration-200">Actions</th>
            </thead>
            <tbody>
            <template v-if="!tableData.length && !loading">
              <tr>
                <td :colspan="headers.length + 1" class="p-12">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <font-awesome :icon="['fas', 'inbox']" class="text-4xl text-text-tertiary opacity-50"/>
                    <p class="font-semibold text-base text-center text-text-tertiary">No data found.</p>
                    <p class="text-sm text-center text-text-tertiary opacity-75">Try adjusting your filters to see more results.</p>
                  </div>
                </td>
              </tr>
            </template>
            <template v-for="row in tableData" :key="row.id">
              <tr
                  class="hover:!bg-bg-hover border-y border-border-default transition-[background-color,border-color,color] duration-200"
              >
                <td class="p-4 text-nowrap lg:text-wrap break-words text-text-primary transition-colors duration-200" :class="headers[0].className">
                  {{ row.day }}
                </td>
                <td class="p-4 text-nowrap lg:text-wrap break-words text-text-primary transition-colors duration-200" :class="headers[1].className">
                  {{ row.dateTime }}
                </td>
                <td class="p-4 text-nowrap lg:text-wrap break-words text-text-primary transition-colors duration-200" :class="headers[2].className">
                  {{ row.number }}
                </td>
                <td class="p-4 text-nowrap lg:text-wrap break-words text-text-primary transition-colors duration-200" :class="headers[3].className">
                  {{ row.match }}
                </td>
                <td class="p-4 text-nowrap lg:text-wrap break-words transition-colors duration-200" :class="headers[4].className">
                  <TextInput
                      v-model:value="row.homePenalty1"
                      type="number"
                      class="w-full"
                      @focus-out="() => updatePenalty(row.id, row.homePenalty1, 'home')"
                  />
                </td>
                <td class="p-4 text-nowrap lg:text-wrap break-words transition-colors duration-200" :class="headers[5].className">
                  <TextInput
                      v-model:value="row.awayPenalty1"
                      type="number"
                      class="w-full"
                      @focus-out="() => updatePenalty(row.id, row.awayPenalty1, 'away')"
                  />
                </td>
                <td class="p-4 text-nowrap lg:text-wrap text-center transition-colors duration-200" :class="headers[6].className">
                  <CheckBox
                      v-model:value="row.penaltyStatus"
                      :name="`processed_${row.id}`"
                      @update:value="(value) => updatePenaltyStatus(row.id, value)"
                  />
                </td>
                <td class="p-3 h-full m-auto w-20">
                  <div class="flex justify-center items-center h-full gap-3">
                    <span class="relative group text-nowrap">
                      <font-awesome
                          :icon="['fas', 'up-right-from-square']"
                          class="text-base cursor-pointer text-text-tertiary hover:text-brand-primary-color transition-colors duration-200"
                          @click.stop="navigateTo(`${type}/${row.id}`)"
                      />
                      <span
                          class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-surface-default text-text-primary border border-border-default left-1/2 p-1.5 shadow-sm px-3 -translate-x-1/2 rounded-lg transition-[background-color,border-color,color,box-shadow] duration-200"
                      >
                        View
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
          <template v-if="loading">
            <div class="p-8 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-surface-default text-text-primary rounded-xl border border-border-default shadow-sm transition-[background-color,border-color,color,box-shadow] duration-200">
              <font-awesome
                  :icon="['fas', 'spinner']"
                  class="fa-spin text-3xl text-brand-primary mb-3"
              />
              <p class="text-text-secondary font-medium">Loading data...</p>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template v-if="tableData.length">
      <div class="flex flex-col sm:flex-row justify-between px-4 sm:px-6 items-start sm:items-center gap-4 py-4 border-t border-border-default bg-bg-primary/30 transition-[background-color,border-color] duration-200">
        <div>
          <p class="text-xs text-nowrap tracking-wider text-text-secondary font-medium transition-colors duration-200">
            {{ currentShowCount }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row justify-start sm:justify-end items-start sm:items-center gap-4 w-full sm:w-auto">
          <p class="flex items-center text-nowrap gap-2 sm:gap-4 text-sm text-text-secondary transition-colors duration-200">
            <span class="hidden sm:inline">Rows per page:</span>
            <span class="sm:hidden">Per page:</span>
            <Select :options="limitOptions" v-model:value="limit" direction="top" size="small" class="w-20"/>
          </p>
          <template v-if="count > (limit.value ?? 0)">
            <div class="w-full sm:w-auto">
              <TablePagination v-model:page="page" :page-count="pagesCount"/>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type Game from "~/interfaces/games/game";
import moment from "moment";
import Select from "~/components/inputs/Select.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import type TableHeader from "~/interfaces/table/tableHeader";
import CheckBox from "~/components/inputs/CheckBox.vue";
import type GamesEditableTable from "~/interfaces/games/gamesEditableTable";
import TextInput from "~/components/inputs/TextInput.vue";
import {useGamePenaltiesFetch} from "~/composables/useGamePenaltiesFetch/useGamePenaltiesFetch";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import type Penalty from "~/interfaces/games/penalty";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import type Tournament from "~/interfaces/tournament/tournament";
import SelectMultiple from "~/components/inputs/SelectMultiple.vue";

const props = defineProps({
  games: {
    type: Array<Game>,
    required: true
  },
  dataCount: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'moves',
  },
  showConflictsFilter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['sort', 'reFetch', 'ignoreConflict'])
const userStore = useUserStore()
const {fetchAllClubs} = useClubsFetch()
const {createOrUpdate} = useGamePenaltiesFetch()
const {updateGame} = useGamesFetch()
const {fetchTournamentsNames} = useTournamentFetch()

const tableData = ref([] as Array<GamesEditableTable>)
const count = ref(0 as Number)
const page = ref(1)
const clubs = ref([] as Array<SelectOptions>)
const tournaments = ref([] as Array<SelectOptions>)
const allTournaments = ref([] as Array<Tournament>)
const selectedClub = ref({} as SelectOptions)

const selectedTournament = ref({
  label: 'All Tournaments',
  value: null,
  disabled: false
} as SelectOptions)

const penaltyStatus = ref({
  label: 'Processed/Open',
  value: null,
  disabled: false,
} as SelectOptions)

const penaltyStatusOptions = [
  {
    label: 'Processed/Open',
    value: null,
    disabled: false,
  },
  {
    label: 'Open only',
    value: (props.type === 'moves' ? 0 : 1),
    disabled: false,
  },
  {
    label: 'Processed only',
    value: (props.type === 'moves' ? 1 : 2),
    disabled: false,
  },
] as SelectOptions[]

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
    label: 'Day',
    sortable: false,
    sortValue: '',
    className: 'w-20'
  },
  {
    label: 'Date && Time',
    sortable: true,
    sortValue: 'date',
    className: 'w-64'
  },
  {
    label: 'No',
    sortable: true,
    sortValue: 'number',
    className: 'w-20',
  },
  {
    label: 'Match',
    sortable: true,
    sortValue: 'homeTeam',
    className: 'w-72',
  },
  {
    label: 'Home team charges',
    sortable: false,
    className: 'w-48',
  },
  {
    label: 'Away team charges',
    sortable: false,
    className: 'w-48',
  },
  {
    label: 'Processed',
    sortable: true,
    sortValue: 'court',
    className: 'w-28',
  },
] as TableHeader[];

const emitData = computed(() => {
  return {
    limit: limit.value?.value,
    page: page.value,
    ...(selectedClub.value.value ? {
      clubId: selectedClub.value.value,
    } : {}),
    ...(selectedTournament.value.value ? {
      tournamentId: selectedTournament.value.value,
    } : {}),
    ...(selectedTournament.value.value ? {
      tournamentId: selectedTournament.value.value,
    } : {}),
    ...(penaltyStatus.value.value !== null ? {
      penaltyStatusId: penaltyStatus.value.value,
    } : {}),
  }
})

const tournamentOptions = computed(() => {
  let tournaments = [] as SelectOptions[]

  if (selectedTournament.value.value) {

    const selectedGroup = allTournaments.value.find(tournament => tournament.id === selectedTournament.value.value)
    if (selectedGroup && selectedGroup.tournaments?.length) {
      tournaments = selectedGroup.tournaments.map(tournament => {
        return {
          label: tournament.alias,
          value: tournament.id,
        } as SelectOptions
      })

      tournaments.unshift({
        label: 'All Tournaments',
        value: null,
        disabled: false,
      } as SelectOptions)

    }
  }
  return tournaments
})

const emitReFetch = () => {
  emit('reFetch', emitData.value)
}

watch(() => props.games, () => {
  tableData.value = props.games?.map(game => {
    let homePenalty1 = 0
    let awayPenalty1 = 0

    if (game.penalties?.length) {
      const home1 = game.penalties.find((penalty: Penalty) => (penalty.side === 'home' && penalty.number === (props.type === 'moves' ? 1 : 2)))
      if (home1?.value) {
        homePenalty1 = home1.value
      }
      const away1 = game.penalties.find((penalty: Penalty) => (penalty.side === 'away' && penalty.number === (props.type === 'moves' ? 1 : 2)))
      if (away1?.value) {
        awayPenalty1 = away1.value
      }
    }

    return {
      id: game.id,
      day: moment(game.date).format('ddd'),
      dateTime: game.date + ' ' + moment(game.time, 'HH:mm').format('HH:mm'),
      number: game.number,
      match: `${game.home_team.tournament_name}-${game.guest_team.tournament_name} ${game.tournament?.short_name}`,
      homePenalty1: homePenalty1,
      awayPenalty1: awayPenalty1,
      penaltyStatus: !!game.penalty_status_id,
      view: '',
    } as GamesEditableTable
  })
}, {
  deep: true,
  immediate: true
})

watch(() => props.dataCount, () => {
  count.value = props.dataCount
}, {
  deep: true,
  immediate: true
})

watch(page, () => {
  emitReFetch()
})

watch([limit, selectedClub, selectedTournament, penaltyStatus], () => {
  if (page.value === 1) {
    emitReFetch()
  } else {
    page.value = 1
  }
})

watch(selectedTournament, () => {
  if (selectedTournament.value.value) {
    selectedTournament.value = {
      label: 'All Tournaments',
      value: null,
      disabled: false,
    }
  } else {
    if (page.value === 1) {
      emitReFetch()
    } else {
      page.value = 1
    }
  }
})

const currentShowCount = computed(() => {
  if (count.value === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * (limit.value?.value ? +limit.value?.value : 10)
  let currentPageMinValue = (+page.value - 1) * (limit.value?.value ? +limit.value?.value : 10) + 1
  return currentPageMinValue + ' - ' + ((+count.value > currentPageMaxValue) ? currentPageMaxValue : count.value) + ' of ' + count.value
})

const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number))
})

async function fetchClubs() {
  const res = await fetchAllClubs({seasonSportId: userStore.seasonSportId})
  clubs.value.push({
    label: 'All Clubs',
    value: null,
    disabled: false
  } as SelectOptions)

  res.map(club => {
    clubs.value.push({
      label: `${club.name}`,
      value: club.id,
      disabled: false
    } as SelectOptions)
  })

  selectedClub.value = clubs.value[0]
}

function sort(header: TableHeader) {
  if (header.sortable) {
    emit('sort', {column: header.sortValue, data: emitData.value})
  }
}

async function updatePenalty(gameId: number, value: number | string, side: string) {
  await createOrUpdate({
    side,
    gameId,
    value: value ? value : null,
    number: (props.type === 'moves' ? 1 : 2),
  })
}

async function updatePenaltyStatus(gameId: number, value: boolean) {
  await updateGame(gameId, {
    penaltyStatusId: value ? (props.type === 'moves' ? 1 : 2) : 0,
  })
}

async function fetchTournaments() {
  const res = await fetchTournamentsNames({seasonSportId: userStore.seasonSportId})
  allTournaments.value = res
  tournaments.value = res.map(tournament => {
    return {
      label: tournament.name,
      value: tournament.id,
      disabled: false
    } as SelectOptions
  })
  tournaments.value.unshift({
    label: 'All Tournaments ',
    value: null,
    disabled: false
  } as SelectOptions)

  selectedTournament.value = tournaments.value[0]
}

onMounted(() => {
  fetchClubs()
  fetchTournaments()
})
</script>

<style scoped>
/* Theme-aware striped rows - using CSS variables */
tbody tr:nth-of-type(odd) {
  background-color: var(--color-bg-tertiary);
}

tbody tr:hover {
  background-color: var(--color-bg-hover) !important;
}

td, th {
  vertical-align: middle;
}

tr {
  height: auto;
}
</style>
