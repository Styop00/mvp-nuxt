<template>
  <TableStriped
      :headers="headers"
      :clickable="true"
      :data="tableData"
      title="Games"
      class="bg-white min-h-96 flex flex-col justify-between"
      :loading="loading"
      :show-actions="type === 'conflicts'"
      @sorted="(column) => emit('sort', {column: column, data: emitData})"
      @rowClicked="(id) => navigateTo(`${type ? type : 'games'}/${id}`)"
      @dataClicked="handleDataClick"
      :fixed-table="false"
  >
    <template #headerBottom>
      <div class="flex gap-3 w-full  items-center justify-between ml-2">
        <div class="flex gap-3 items-center">
          <div class="flex gap-4 items-center">
            <span class="text-nowrap text-sm font-bold">Filter by</span>
            <Select
                :options="filterOptions"
                v-model:value="filter"
                v-show="filterOptions.length > 1"
                class="min-w-40"
            />
          </div>
          <div class="flex gap-4 items-center" v-if="tournamentGroupId || tournamentId">
            <FilterSelect :options="clubs" v-model:value="selectedClub" class="min-w-52"/>
          </div>
          <div class="flex gap-4 items-center">
            <FilterSelect :options="courts" v-model:value="selectedCourt" class="min-w-60"/>
          </div>
          <div class="relative">
            <TextInput
                :value="range.join(' - ')"
                placeholder="Date"
                @click.prevent="showDatePicker"
                :prevent-input="true"
                :required="true"
                class="min-w-52"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow"
                 @click.stop
                 v-if="showRangeCalendar">
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
            placeholder="Search by game number"
            class="min-w-48 ml-4"
        />
      </div>
    </template>
    <template #actions="{ row }" v-if="type === 'conflicts'">
      <span class="relative group text-nowrap">
        <font-awesome
            :icon="['fas', 'xmark']"
            @click.stop="() => emit('ignoreConflict', row.id)"
            class="p-1.5 text-base rounded-full hover:text-red-500 transition text-red-600 cursor-pointer"/>
        <span
            class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
          Ignore conflicts
        </span>
      </span>
    </template>
    <template #footer>
      <div class="flex justify-between ml-4 items-center gap-6">
        <div>
          <p class="text-xs text-nowrap tracking-wider text-gray-400 font-bold">
            {{ currentShowCount }}
          </p>
        </div>
        <div class="flex justify-start m-2 lg:justify-end items-center gap-6">
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
      date: game.date,
      time: game.time ? moment(game.time, 'HH:mm:ss').format('HH:mm') : '<span class="text-red-600">time is missing</span>',
      number: game.number,
      teamIdHome: game.homeTeam?.tournamentName ?
          `<span class="${userStore.isAdmin ? 'hover:text-brand-secondary-color' : ''}">${game.homeTeam?.tournamentName}</span>`
          :
          '',
      teamIdAway: game.guestTeam?.tournamentName ?
          `<span class="${userStore.isAdmin ? 'hover:text-brand-secondary-color' : ''}">${game.guestTeam?.tournamentName}</span>`
          :
          '',
      tournament: game.tournament?.shortName ? game.tournament?.shortName : '',
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
  let status = `<span  class="mx-2 bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Ok</span>`;
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
    status = `<p  class="bg-yellow-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap"> ${status} </p>`
  } else {
    switch (game.statusId) {
      case 1 :
        status = `<span  class="mx-2 bg-red-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Time missing</span>`;
        break;
      case 2 :
        status = `<span  class="mx-2 bg-red-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Venue missing</span>`;
        break;
      case 3 :
        status = `<span  class="mx-2 bg-yellow-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Must be moved</span>`;
        break;
      case 4 :
        status = `<span  class="mx-2 bg-amber-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Moving in progress</span>`;
        break;
      case 5 :
        status = `<span  class="mx-2 bg-amber-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Awaiting association</span>`;
        break;
      case 6 :
        status = `<span  class="mx-2 bg-indigo-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Awaiting sync</span>`;
        break;
      case 7 :
        status = `<span  class="mx-2 bg-green-400 w-fit rounded-xl p-2 text-white text-xs text-nowrap">Ok</span>`;
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