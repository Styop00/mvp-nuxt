<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
          :headers="headers"
          :clickable="false"
          :data="tableData"
          title="Registrations"
          class="bg-dark-surface-default"
          :show-edit="isAdmin"
          @sorted="sort"
          :loading="loading"
          @edit-icon-clicked="(rowId) => navigateTo(`registration/${rowId}?clubId=${clubId.value}&clubName=${encodeURIComponent(clubId.label)}`)"
          :show-actions="true"
        >
          <template #header>
            <div class="flex gap-6 items-center">
              <template v-if="clubIds.length > 1" class="mb-4">
                <span class="text-nowrap">Select Club</span>
                <Select :options="clubOptions" v-model:value="clubId" />
              </template>
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
                <p
                  class="text-xs text-nowrap tracking-wider text-gray-400 font-bold"
                >
                  {{ currentShowCount }}
                </p>
              </div>
              <div
                class="flex justify-start mx-2 lg:justify-end items-center gap-6"
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
                <template v-if="count > limit.value">
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
  </div>
</template>

<script setup lang="ts">
import TableStriped from "~/components/tables/TableStriped.vue";
import type Tournament from "~/interfaces/tournament/tournament";
import {useUserStore} from "~/store/user";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import SearchInput from "~/components/inputs/SearchInput.vue";
import type RegistrationTableData from "~/interfaces/registration/registrationTableData";
import { useClubsFetch } from "~/composables/useClubsFetch/useClubsFetch";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";

const count = ref(0 as Number)
const tournaments = ref([] as Array<Tournament>)
const tableData = ref([] as Array<RegistrationTableData>)
const orderBy = ref('name')
const orderDirection = ref('asc')
const page = ref(1 as Number)
const showDeleteTournamentConfirmation = ref(false)
const searchQuery = ref('')

const { fetchTournamentsWithoutLeagueId, loading } = useTournamentFetch()

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
      label: 'Name',
      sortable: true,
      sortValue: 'name',
      dataKey: 'tournamentNames',
    },
    {
      label: 'Deadline',
      sortable: true,
      sortValue: 'endDate',
      dataKey: 'deadline',
    },
    {
      label: 'Your Subscribers',
      sortable: false,
      sortValue: 'yourSubscribers',
      dataKey: 'yourSubscribers',
    },
    {
      label: 'Other Registrants',
      sortable: false,
      dataKey: 'otherRegistants',
      sortValue: 'otherRegistants',
    }
]

const isAdmin = computed(() => {
  return userStore.getUserRoleNames().includes('Association Admin') || userStore.getUserRoleNames().includes('Club Manager')
})

const clubId = ref({
  label: '',
  value: '',
  disabled: false
} as SelectOptions);

const { fetchClubsByIds, fetchClubById } = useClubsFetch()
const clubOptions =  ref([] as SelectOptions[])


const pagesCount = computed(() => {
  return Math.ceil((count.value as number) / (limit.value.value as number))
})

const currentShowCount = computed(() => {
  if (count.value === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * (+limit.value.value)
  let currentPageMinValue = (+page.value - 1) * (+limit.value.value) + 1
  return currentPageMinValue + ' - ' + ((+count.value > currentPageMaxValue) ? currentPageMaxValue : count.value) + ' of ' + count.value
})

watch(page, () => {
  tableData.value = []
  fetchTournamentsNames()
})

watch([searchQuery, limit], () => {
  tableData.value = []

  if (page.value === 1) {
    fetchTournamentsNames()
  } else {
    page.value = 1
  }
})

watch(showDeleteTournamentConfirmation, () => {
  if (!showDeleteTournamentConfirmation.value) {
    fetchTournamentsNames()
  }
})

onMounted(() => {
  fetchTournamentsNames();
});

function sort(column: string) {
  tableData.value = []
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchTournamentsNames()
}
const clubIds = ref<string[]>([])

clubIds.value = userStore.user.user_roles.filter((role) => role.roleId === 1).map((item) => item.clubId);

if(clubIds.value.length > 1) {
    const clubs = await fetchClubsByIds(clubIds);
    clubs?.rows.forEach((club) => {
    clubOptions.value.push({
        label: club.name,
        value: club.id,
        disabled: false
      } as SelectOptions)
    })
    clubId.value = {...clubOptions.value[0]}
} else {
  const clubIdValue = userStore.user.user_roles.find((role) => role.roleId === 1).clubId
  const club = await fetchClubById(clubIdValue);

  if (club) {

    clubId.value = {
      value: clubIdValue,
      label: club.name,
      disabled: false
    };
  } else {
    console.error("Club not found for clubId:", clubIdValue);
  }
}
watch(clubId, () => {
  fetchTournamentsNames();
});

async function fetchTournamentsNames() {
  const response = await fetchTournamentsWithoutLeagueId( orderBy.value, orderDirection.value, +page.value, +limit.value.value, searchQuery.value)
  if (!response) {
    return
  }

  const res = response as { count: Number, rows: Array<Tournament> }
  count.value = res.count
  tournaments.value = res.rows

  tableData.value = []

  tournaments.value.forEach(tournament => {
  tableData.value.push({
    id: Number(tournament.id),
    tournamentNames: String(tournament.name),
    deadline: String(tournament.registration_dead_line),
    yourSubscribers: tournament.registrations
      ?.filter((item) => item.clubId === clubId.value.value)
      .reduce((acc, item) => acc + item.count, 0) || 0,
    otherRegistants: tournament.registrations?.reduce((acc, item) => acc += item.count, 0) || 0,
    })
  })
}
</script>
