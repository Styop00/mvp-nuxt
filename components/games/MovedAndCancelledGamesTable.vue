<template>
  <div class="min-w-full shadow-lg rounded-2xl overflow-x-auto bg-dark-surface-default min-h-96 flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-center px-2">
        <p
            class="text-base font-bold py-4 flex items-center justify-start tracking-widest"
        >
        <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
        />
          {{ type === 'moves' ? 'Moves' : 'Cancellation / No-shows' }}
        </p>
      </div>
      <div class="w-full flex justify-between">
        <div class="flex gap-6 w-full  items-center justify-between ml-2">
          <div class="flex gap-6 items-center my-3">
            <div class="flex gap-4 items-center">
              <span class="text-nowrap text-sm font-bold">Filter by</span>
              <SelectMultiple
                  v-model:value="selectedTournamentGroup"
                  :options="tournamentGroups"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  placeholder="Select Tournament Groups"
                  label="label"
                  track-by="value"
                  :preselect-first="true"
                  class="!w-64"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>
            <div class="flex gap-4 items-center" v-if="tournamentOptions.length">
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
                  class="!w-64"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>
            <div class="flex gap-4 items-center">
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
                  class="!w-64"
                  select-label=""
                  deselect-label=""
                  selected-label=""
              />
            </div>
            <div class="flex gap-4 items-center">
              <Select :options="penaltyStatusOptions" v-model:value="penaltyStatus" class="min-w-52"/>
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <table class="bg-dark-surface-default w-full border-t rounded-2xl"
               :class="{'opacity-30': loading}">
          <thead>
          <template v-for="header in headers">
            <th
                class="p-3 text-nowrap text-left"
                :class="{
                  'cursor-pointer': header.sortable,
                  'w-24': header.label === 'Status',
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
                  <font-awesome :icon="['fas', 'sort']" class="text-xs"/>
                </template>
              </div>
            </th>
          </template>
          </thead>
          <tbody>
          <template v-if="!tableData.length && !loading">
            <tr>
              <td :colspan="headers.length">
                <p class="p-4 font-bold text-xl text-center">No data founds.</p>
              </td>
            </tr>
          </template>
          <template v-for="row in tableData">
            <tr
                class="hover:!bg-[#f7f8f9] border-y border-gray-100"
            >
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                  <span>
                    {{ row.day }}
                  </span>
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                  <span>
                    {{ row.dateTime }}
                  </span>
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                  <span>
                    {{ row.number }}
                  </span>
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                  <span>
                    {{ row.match }}
                  </span>
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                <TextInput
                    v-model:value="row.homePenalty1"
                    type="number"
                    class="w-full"
                    @focus-out="() => updatePenalty(row.id, row.homePenalty1, 'home')"
                />
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words">
                <TextInput
                    v-model:value="row.awayPenalty1"
                    type="number"
                    class="w-full"
                    @focus-out="() => updatePenalty(row.id, row.awayPenalty1, 'away')"
                />
              </td>
              <td class="p-3 text-nowrap lg:text-wrap text-center">
                <CheckBox
                    v-model:value="row.penaltyStatus"
                    :name="`processed_${row.id}`"
                    @update:value="(value) => updatePenaltyStatus(row.id, value)"
                />
              </td>
              <td class="p-3 text-nowrap lg:text-wrap break-words w-20">
                <span class="relative group text-nowrap">
                    <font-awesome
                        :icon="['fas', 'up-right-from-square']"
                        class="text-base cursor-pointer"
                        @click="navigateTo(`${type}/${row.id}`)"
                    />
                    <span
                        class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-3 -translate-x-1/2 border"
                    >
                    View
                  </span>
                </span>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <template v-if="loading">
          <div class="p-4 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <font-awesome
                :icon="['fas', 'spinner']"
                class="fa-spin text-2xl"
            />
            <p>Loading data...</p>
          </div>
        </template>
      </div>
    </div>
    <template>
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
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
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
const {fetchTournamentGroupsNames} = useTournamentGroupFetch()

const tableData = ref([] as Array<GamesEditableTable>)
const count = ref(0 as Number)
const page = ref(1)
const clubs = ref([] as Array<SelectOptions>)
const tournamentGroups = ref([] as Array<SelectOptions>)
const allGroups = ref([] as Array<TournamentGroup>)
const selectedClub = ref({} as SelectOptions)

const selectedTournamentGroup = ref({} as SelectOptions)

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
  {
    label: '',
    sortable: false,
    sortValue: '',
    className: 'w-20'
  },
] as TableHeader[];

const emitData = computed(() => {
  return {
    limit: limit.value?.value,
    page: page.value,
    ...(selectedClub.value.value ? {
      clubId: selectedClub.value.value,
    } : {}),
    ...(selectedTournamentGroup.value.value ? {
      tournamentGroupId: selectedTournamentGroup.value.value,
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

  if (selectedTournamentGroup.value.value) {

    const selectedGroup = allGroups.value.find(group => group.id === selectedTournamentGroup.value.value)
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

watch(selectedTournamentGroup, () => {
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

async function fetchTournamentGroups() {
  const res = await fetchTournamentGroupsNames({seasonSportId: userStore.seasonSportId, withTournaments: true})
  allGroups.value = res
  tournamentGroups.value = res.map(group => {
    return {
      label: group.name,
      value: group.id,
      disabled: false
    } as SelectOptions
  })
  tournamentGroups.value.unshift({
    label: 'All Tournament Groups ',
    value: null,
    disabled: false
  } as SelectOptions)

  selectedTournamentGroup.value = tournamentGroups.value[0]
}

onMounted(() => {
  fetchClubs()
  fetchTournamentGroups()
})
</script>