<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :loading="loading"
            :headers="headers"
            :clickable="false"
            :data="teamsData"
            title="Teams"
            class="bg-dark-surface-default"
            :show-edit="true"
            :show-delete="userStore.isAdmin"
            @sorted="sort"
            @edit-icon-clicked="(rowId) => navigateTo(`teams/${rowId}`)"
            @delete-icon-clicked="(rowId) => showDeleteConfirmation(rowId)"
            :show-actions="true"
        >
          <template #header>
            <div class="flex gap-6 items-center">
              <template v-if="userStore.isAdmin">
                <BaseButton
                    class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                    @onClick="() => navigateTo('teams/create')"
                >
                  Create Team
                </BaseButton>
              </template>
            </div>
          </template>
          <template #headerBottom>
            <div class="flex gap-6 items-center justify-end w-full">
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
                <template v-if="count > (limit.value ?? 0)">
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
          <template #actions="{ row }">
            <span class="relative group text-nowrap">
              <font-awesome
                  :icon="['fas', 'user-group']"
                  @click="() => navigateTo(`teams/${row.id}/users`)"
                  class="p-1.5 text-base rounded-full hover:text-fuchsia-500 transition text-fuchsia-600 cursor-pointer"/>
              <span
                  class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-3 -translate-x-1/2 border">
                Users
              </span>
            </span>
            <span class="relative group text-nowrap">
              <font-awesome
                  :icon="['fas', 'volleyball']"
                  @click="() => navigateTo(`teams/${row.id}/games`)"
                  class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"/>
              <span
                  class="z-10 absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-3 -translate-x-1/2 border">
                Games
              </span>
            </span>
          </template>
        </TableStriped>
      </div>
    </div>
    <DeleteTeam
        v-model:team-id="teamIdForDelete"
        v-model:visible="showConfirmModal"
        @deleted="fetchTeamData"
    />
  </div>
</template>
<script setup lang="ts">
import SearchInput from "~/components/inputs/SearchInput.vue";
import Select from "~/components/inputs/Select.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import TableStriped from "~/components/tables/TableStriped.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import type Team from "~/interfaces/teams/team";
import type TeamsTable from "~/interfaces/teams/teamsTable";
import {useRoleStore} from "~/store/role";
import type Clubs from "~/interfaces/clubs/club";
import DeleteTeam from "~/components/modals/teams/DeleteTeam.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";

const userStore = useUserStore()

const count = ref(0 as Number)
const orderBy = ref('tournamentName')
const orderDirection = ref('desc')
const page = ref(1 as Number)
const searchQuery = ref('')
const loading = ref(false)
const teams = ref([] as Array<Team>)
const teamsData = ref([] as Array<TeamsTable>)
const teamIdForDelete = ref(0)
const showConfirmModal = ref(false)

const props = defineProps({
  clubs: {
    type: Array<Clubs>,
    default: []
  },
  teamIds: {
    type: Array<Number>,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  },
})

const rolesStore = useRoleStore()

const {fetchTeams} = useTeamsFetch()

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
    sortable: false,
    sortValue: '',
    dataKey: 'name',
  },
  {
    label: 'License',
    sortable: true,
    sortValue: 'license',
    dataKey: 'license',
  },
  {
    label: 'Local Name',
    sortable: true,
    sortValue: 'localName',
    dataKey: 'localName',
  },
  {
    label: 'Enough',
    sortable: false,
    sortValue: '',
    dataKey: 'enough',
  },
  {
    label: 'Coaches',
    sortable: false,
    dataKey: 'coaches',
    sortValue: '',
  },
]

watch(() => rolesStore.roles, () => {
  if (!rolesStore.roles.length) {
    rolesStore.fetchRoles()
  }
}, {
  deep: true,
  immediate: true
})

watch(() => [props.clubs, props.teamIds], () => {
  if (props.clubs?.length || props.teamIds.length || userStore.isAdmin) fetchTeamData()
}, {
  deep: true,
  immediate: true
})

watch(page, () => {
  if (props.clubs?.length || props.teamIds?.length) fetchTeamData()
})

watch([searchQuery, limit], () => {
  if (page.value === 1) {
    fetchTeamData()
  } else {
    page.value = 1
  }
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

async function fetchTeamData() {
  if ((!props.clubs?.length && !props.teamIds?.length && !userStore.isAdmin) || props.loading) return

  teamIdForDelete.value = 0
  teamsData.value = []
  loading.value = true
  const res = await fetchTeams(
      props.clubs.length ? props.clubs?.map(club => club.id) : null,
      orderBy.value, orderDirection.value,
      +page.value,
      +(limit.value.value ?? 10),
      searchQuery.value,
      (props.teamIds.length ? {
        teamIds: props.teamIds
      } : {})
  ) as {
    count: Number,
    rows: Array<Team>
  }

  if (!res) {
    return
  }
  teams.value = [...res.rows]
  count.value = res.count

  teams.value.forEach(team => {

    const coaches = team.team_staff?.map(user => {
      return `
      <p>
        <span class="font-bold mr-2 text-xs">
          ${rolesStore.roles.find(role => role.id === user.user_roles.role_id)?.description}
        </span>
        <span class="text-xs">${user.name}</span>
      </p>`
    })
    teamsData.value.push({
      id: team.id,
      name: team.club?.name ? team.club?.name : '',
      license: '' + team.license,
      localName: team.local_name,
      enough: team.tournament_groups?.map(group => group.name)?.join(', '),
      coaches: coaches?.join('')
    })
  })
  loading.value = false
}

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchTeamData()
}

function showDeleteConfirmation(id: number) {
  teamIdForDelete.value = id;
  showConfirmModal.value = true;
}
</script>
