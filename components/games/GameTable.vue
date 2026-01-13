<template>
  <TableStriped
      :headers="headers"
      :clickable="true"
      :data="tableData"
      title="Games"
      class="bg-surface-default min-h-96 flex flex-col justify-between"
      :loading="loading"
      :show-actions="type === 'conflicts'"
      @sorted="(column) => emit('sort', {column: column, data: emitData})"
      @rowClicked="(id) => navigateTo(`${type ? type : 'games'}/${id}`)"
      @dataClicked="handleDataClick"
      :fixed-table="false"
  >
    <template #headerBottom>
      <div class="flex flex-col xl:flex-row gap-4 xl:gap-6 w-full items-stretch xl:items-center justify-between bg-gradient-to-br from-surface-default/40 via-bg-primary/30 to-surface-default/40 backdrop-blur-sm relative transition-[background-color,border-color] duration-200">
        <!-- Filters Section -->
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center flex-1">
          <!-- Filter Label and Type Select -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center min-w-0 flex-shrink-0 relative">
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 shadow-sm hover:shadow-sm hover:border-brand-primary/30 transition-all duration-200">
              <font-awesome :icon="['fas', 'filter']" class="text-brand-primary-color text-sm"/>
              <span class="text-nowrap text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider whitespace-nowrap transition-colors duration-200">Filters</span>
            </div>
            <Select
                :options="filterOptions"
                v-model:value="filter"
                v-show="filterOptions.length > 1"
                class="w-full sm:w-auto sm:min-w-[140px]"
            />
          </div>

          <!-- Visual Separator (Desktop) -->
          <div class="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-border-default to-transparent mx-1 transition-colors duration-200"></div>

          <!-- Club Filter (Conditional) -->
          <div class="flex items-center gap-3 w-full sm:w-auto group relative" v-if="tournamentGroupId || tournamentId">
            <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
              <font-awesome :icon="['fas', 'landmark']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
            </div>
            <FilterSelect 
              :options="clubs" 
              v-model:value="selectedClub" 
              class="w-full sm:w-auto sm:min-w-[180px] flex-1"
            />
          </div>

          <!-- Court Filter -->
          <div class="flex items-center gap-3 w-full sm:w-auto group relative">
            <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
              <font-awesome :icon="['fas', 'location-dot']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
            </div>
            <FilterSelect 
              :options="courts" 
              v-model:value="selectedCourt" 
              class="w-full sm:w-auto sm:min-w-[200px] flex-1"
            />
          </div>

          <!-- Date Filter -->
          <div class="flex items-center gap-3 w-full sm:w-auto group relative">
            <div class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
              <font-awesome :icon="['fas', 'calendar']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
            </div>
            <div class="relative flex-1 w-full sm:w-auto sm:min-w-[200px]">
              <TextInput
                  :value="range.join(' - ') || ''"
                  placeholder="Select Date Range"
                  @click.prevent="showDatePicker"
                  :prevent-input="true"
                  :required="true"
                  :input-classes="'cursor-pointer pr-10'"
                  class="w-full"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none lg:hidden">
                <font-awesome :icon="['fas', 'calendar']" class="text-sm text-text-tertiary transition-colors"/>
              </div>
            </div>
            <div 
              class="absolute top-full left-0 lg:left-1/2 lg:-translate-x-1/2 bg-surface-default border border-border-default shadow-sm rounded-xl mt-3 backdrop-blur-md animate-scale-in transition-[background-color,border-color] duration-200"
              @click.stop
              v-if="showRangeCalendar"
              style="z-index: 99999 !important; position: absolute !important;">
              <div class="p-3 border-b border-border-default flex items-center justify-between bg-surface-elevated transition-[background-color,border-color] duration-200">
                <p class="text-sm font-semibold text-text-primary flex items-center gap-2 transition-colors duration-200">
                  <font-awesome :icon="['fas', 'calendar']" class="text-brand-primary-color"/>
                  Select Date Range
                </p>
                <BaseButton
                    class="!py-1 !px-3 text-xs"
                    @click="() => {range = []; showRangeCalendar = false}"
                >
                  Clear
                </BaseButton>
              </div>
              <RangePicker
                  @close="showRangeCalendar = false"
                  v-model:model-value="range"
                  color="blue"
              />
            </div>
          </div>
        </div>

        <!-- Visual Separator (Desktop) -->
        <div class="hidden xl:block w-px h-8 bg-gradient-to-b from-transparent via-border-default to-transparent mx-2 transition-colors duration-200"></div>

        <!-- Search Section -->
        <div class="w-full xl:w-auto xl:min-w-[300px] flex-shrink-0">
          <div class="flex items-center gap-3 group relative">
            <div class="hidden xl:flex items-center justify-center w-9 h-9 rounded-lg bg-surface-elevated border border-border-default group-hover:border-brand-primary-color/50 group-hover:bg-brand-primary-color/10 transition-all duration-200 flex-shrink-0">
              <font-awesome :icon="['fas', 'magnifying-glass']" class="text-xs text-text-tertiary group-hover:text-brand-primary-color transition-colors"/>
            </div>
            <div class="relative flex-1">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors xl:hidden group-focus-within:text-brand-primary-color">
                <font-awesome :icon="['fas', 'magnifying-glass']" class="text-text-tertiary text-sm transition-colors"/>
              </div>
              <SearchInput
                  v-model="searchQuery"
                  placeholder="Search by game number"
                  class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions="{ row }" v-if="type === 'conflicts'">
      <span class="relative group text-nowrap">
        <font-awesome
            :icon="['fas', 'xmark']"
            @click.stop="() => emit('ignoreConflict', row.id)"
            class="p-1.5 text-base rounded-full hover:text-red-500 transition text-red-600 cursor-pointer"/>
        <span
            class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-surface-default left-1/2 p-px shadow-sm px-3 -translate-x-1/2 border border-border-default transition-[background-color,border-color] duration-200">
          Ignore conflicts
        </span>
      </span>
    </template>
    <template #footer>
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
  </TableStriped>
  <ChangeTeams
      v-model:game="selectedGameToChangeTeams"
      v-model:visible="showChangeTeamsModal"
      @reFetch="emitReFetch"
  />
</template>


<script setup lang="ts">
import TableStriped from "~/components/tables/TableStriped.vue";
import type Game from "~/interfaces/games/game";
import moment from "moment";
import type GamesTable from "~/interfaces/games/gamesTable";
import Select from "~/components/inputs/Select.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import SearchInput from "~/components/inputs/SearchInput.vue";
import {useUserStore} from "~/store/user";
import {useCourtsFetch} from "~/composables/useCourtsFetch/useCourtsFetch";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import ChangeTeams from "~/components/modals/games/ChangeTeams.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import RangePicker from "~/components/datePicker/RangePicker.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type TableHeader from "~/interfaces/table/tableHeader";
import FilterSelect from "~/components/inputs/FilterSelect.vue";

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
    default: '',
  },
  showConflictsFilter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['sort', 'reFetch', 'ignoreConflict'])
const route = useRoute()
const userStore = useUserStore()
const {fetchAllClubs} = useClubsFetch()
const {fetchAllCourts} = useCourtsFetch()

const tournamentId = route.params.tournamentId
const tournamentGroupId = route.params.tournamentGroupId
const tableData = ref([] as Array<GamesTable>)
const count = ref(0 as Number)
const page = ref(1)
const searchQuery = ref('')
const clubs = ref([] as Array<SelectOptions>)
const courts = ref([] as Array<SelectOptions>)
const selectedCourt = ref({
  label: 'All Courts',
  value: null,
  disabled: false
} as SelectOptions)
const selectedClub = ref({} as SelectOptions)
const showChangeTeamsModal = ref(false)
const selectedGameToChangeTeams = ref({} as Game)
const showRangeCalendar = ref(false)
const range = ref([])

const filter = ref({
  label: 'All',
  value: null,
  disabled: false,
} as SelectOptions)

const limit = ref({
  label: '10',
  value: 10,
  disabled: false
} as SelectOptions)

const filterOptions = [
  {
    label: 'All',
    value: null,
    disabled: false,
  },
  ...(props.showConflictsFilter ? [{
    label: 'Conflicts',
    value: 'conflicts',
    disabled: false,
  }] : []),
  ...(!userStore.isAdmin ? [
    ...((props.type !== 'attention') ? [
      {
        label: 'Conflicts Ex. Halt Time',
        value: 'conflictsExcludeTimes',
        disabled: false,
      },
    ] : []),
    ...((props.type !== 'fighting' && props.type !== 'attention') ? [{
      label: 'Mine',
      value: 'mine',
      disabled: false,
    }] : []),
  ] : []),
] as Array<SelectOptions>

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
    dataKey: 'day',
    className: 'w-20'
  },
  {
    label: 'Date(YY-MD)',
    sortable: true,
    sortValue: 'date',
    dataKey: 'date',
    className: 'w-48'
  },
  {
    label: 'Time',
    sortable: true,
    sortValue: 'time',
    dataKey: 'time',
    className: 'w-48'
  },
  {
    label: 'No',
    sortable: true,
    dataKey: 'number',
    sortValue: 'number',
    className: 'w-20',
  },
  {
    label: 'At home',
    sortable: true,
    dataKey: 'teamIdHome',
    sortValue: 'homeTeam',
    clickable: userStore.isAdmin,
    className: 'w-48',
  },
  {
    label: 'Outside',
    sortable: true,
    dataKey: 'teamIdAway',
    sortValue: 'guestTeam',
    clickable: userStore.isAdmin,
    className: 'w-48',
  },
  {
    label: 'Tournament',
    sortable: true,
    dataKey: 'tournament',
    sortValue: 'tournament',
    className: 'w-48',
  },
  {
    label: 'Hal & Bane',
    sortable: true,
    dataKey: 'court',
    sortValue: 'court',
  },
  {
    label: 'Status',
    sortable: false,
    dataKey: 'status',
    sortValue: '',
    className: 'w-36'
  },
] as TableHeader[];

const filterType = computed(() => {
  return filter.value.value === 'conflicts' || filter.value.value === 'conflictsExcludeTimes' ? filter.value.value : null
})

const emitData = computed(() => {
  return {
    limit: limit.value?.value,
    page: page.value,
    searchTerm: searchQuery.value,
    type: filterType.value,
    ...(selectedCourt.value.value ? {
      courtId: selectedCourt.value.value,
    } : {}),
    ...(filter.value.value === 'mine' ? {
      mine: true
    } : {}),
    ...(selectedClub.value.value ? {
      clubId: selectedClub.value.value,
    } : {}),
    ...(range.value.length ? {
      period: range.value,
    } : {}),
  }
})

const emitReFetch = () => {
  emit('reFetch', emitData.value)
}

watch(() => props.games, () => {
  tableData.value = props.games?.map(game => {
    let court = '';
    if (game.court?.name || game.court?.venue?.name) {
      court = (game.court?.name ? game.court?.name : '') + ' ' + (game.court?.venue?.name ? game.court?.venue?.name : '')
    } else {
      court = '<span  class="text-red-600">court is missing</span>'
    }
    let status = getStatus(game)

    return {
      id: game.id,
      day: moment(game.date).format('ddd'),
      date: moment(game.date).format('YYYY-MM-DD').toString(),
      time: game.time ? moment(game.time, 'HH:mm:ss').format('HH:mm') : '<span class="text-red-600">time is missing</span>',
      number: game.number,
      teamIdHome: game.home_team?.tournament_name ?
          `<span class="${userStore.isAdmin ? 'hover:text-brand-secondary-color' : ''}">${game.home_team?.tournament_name}</span>`
          :
          '',
      teamIdAway: game.guest_team?.tournament_name ?
          `<span class="${userStore.isAdmin ? 'hover:text-brand-secondary-color' : ''}">${game.guest_team?.tournament_name}</span>`
          :
          '',
      tournament: game.tournament?.short_name ? game.tournament?.short_name : '',
      court: court,
      status: status,
    } as GamesTable
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

watch([searchQuery, limit, range, filter, selectedCourt, selectedClub], (data) => {
  if (page.value === 1) {
    emitReFetch()
  } else {
    page.value = 1
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
  const res = await fetchAllClubs(tournamentId ?
      {
        tournamentId: +tournamentId
      } : {
        tournamentGroupId: +tournamentGroupId
      }
  )
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

async function fetchCourts() {
  if (!userStore.seasonSportId) return
  const res = await fetchAllCourts(userStore.seasonSportId)

  courts.value.push({
    label: 'All Courts',
    value: null,
    disabled: false
  } as SelectOptions)

  res.map(court => {
    courts.value.push({
      label: `${court.venue?.name} ${court.name} `,
      value: court.id,
      disabled: false
    } as SelectOptions)
  })
}

function handleDataClick(row: any) {
  selectedGameToChangeTeams.value = props.games?.find(game => game.id === row.id) as Game
  showChangeTeamsModal.value = true
}

function getStatus(game: Game) {
  let status = `<span  class="mx-2 bg-emerald-600 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Ok</span>`;
  if (props.type === 'conflicts') {
    status = '';
    if (game.conflict?.startTime) {
      status += `Start time`
    }
    if (game.conflict?.blockedAssociation) {
      status += `${status.length ? '<br>' : ''} Federation`
    }
    if (game?.conflict?.blockedTeam) {
      status += `${status.length ? '<br>' : ''} Team`
    }
    if (game?.conflict?.gamesToClose) {
      status += `${status.length ? '<br>' : ''} Rest days`
    }
    if (game?.conflict?.gamesOnCourt) {
      status += `${status.length ? '<br>' : ''} The track`
    }
    if (game?.conflict?.reservations) {
      status += `${status.length ? '<br>' : ''} Reservations`
    }
    if (game?.conflict?.coaches) {
      status += `${status.length ? '<br>' : ''} Trainers`
    }
    if (game?.conflict?.hasCourt) {
      status += `${status.length ? '<br>' : ''} Stop Time`
    }
    status = `<p  class="bg-amber-500 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md"> ${status} </p>`
  } else {
    switch (game.status_id) {
      case 1 :
        status = `<span  class="mx-2 bg-red-600 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Time missing</span>`;
        break;
      case 2 :
        status = `<span  class="mx-2 bg-red-600 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Venue missing</span>`;
        break;
      case 3 :
        status = `<span  class="mx-2 bg-yellow-500 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Must be moved</span>`;
        break;
      case 4 :
        status = `<span  class="mx-2 bg-amber-500 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Moving in progress</span>`;
        break;
      case 5 :
        status = `<span  class="mx-2 bg-amber-500 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Awaiting association</span>`;
        break;
      case 6 :
        status = `<span  class="mx-2 bg-indigo-600 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Awaiting sync</span>`;
        break;
      case 7 :
        status = `<span  class="mx-2 bg-emerald-600 w-fit rounded-lg px-3 py-1.5 text-white text-xs font-semibold text-nowrap shadow-md">Ok</span>`;
        break;
    }
  }

  return status
}

function showDatePicker() {
  setTimeout(() => showRangeCalendar.value = true, 1)
}

onMounted(() => {
  document.body.addEventListener('click', () => showRangeCalendar.value = false)
  if (tournamentId || tournamentGroupId) {
    fetchClubs()
  }

  fetchCourts()
})
</script>