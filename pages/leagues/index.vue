<template>
  <div class="p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <TableStriped
            :headers="headers"
            :clickable="false"
            :data="leagues"
            :show-edit="isAdmin"
            :show-delete="isAdmin"
            title="Leagues"
            class="bg-white"
            :loading="loading"
            @sorted="sort"
            @edit-icon-clicked="editLeague"
            @delete-icon-clicked="deleteLeague"
            :show-actions="true"
        >
          <template #actions="{ row }">
            <template v-if="canEdit(row as LeaguesTableData)">
              <span class="relative group text-nowrap">
                <font-awesome
                    :icon="['fas', 'pen']"
                    @click.stop="() => editLeague(row.id)"
                    class="p-1.5 text-base rounded-full hover:text-blue-300 transition text-blue-400 cursor-pointer"
                />
                <span
                    class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
                >
                  Edit
                </span>
              </span>
            </template>
            <template v-if="canEdit(row as LeaguesTableData)">
              <span class="relative group text-nowrap">
                <font-awesome
                    :icon="['fas', 'trash-can']"
                    @click.stop="() => deleteLeague(row.id)"
                    class="p-1.5 text-base rounded-full hover:text-red-300 transition text-red-400 cursor-pointer"
                />
                <span
                    class="absolute bottom-full text-xxs mb-1 tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border"
                >
                  Delete
                </span>
              </span>
            </template>
            <span class="relative group text-nowrap">
              <font-awesome :icon="['fas', 'bars']"
                            @click="() => navigateTo(`leagues/${row.id}/tournament-groups`)"
                            class="p-1.5 text-base rounded-full hover:text-purple-400 transition text-purple-500 cursor-pointer"/>
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
                Groups
              </span>
            </span>
          </template>
          <template #header v-if="clubIds?.length || userStore.isAdmin">
            <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block" @onClick="() => showCreateModal = true">
              Create League
            </BaseButton>
          </template>
        </TableStriped>
      </div>
    </div>
    <CreateOrUpdate
        v-model:visible="showCreateModal"
        :name="editData.name"
        :id="editData.id"
        :information="editData.information"
        :start-date="editData.startDate"
        :end-date="editData.endDate"
        :is-active="editData.isActive"
        @re-fetch="fetch"
    />
    <DeleteLeague v-model:visible="showDeleteModal"
                  v-model:league-id="selectedLeagueIdForDelete"
                  @re-fetch="fetch"
    />
  </div>
</template>

<script setup lang="ts">

import TableStriped from "~/components/tables/TableStriped.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type TableHeader from "~/interfaces/table/tableHeader";
import CreateOrUpdate from "~/components/modals/league/CreateOrUpdate.vue";
import DeleteLeague from "~/components/modals/league/DeleteLeague.vue";
import type League from "~/interfaces/league/leagues";
import type LeaguesTableData from "~/interfaces/league/leaguesTableData";
import {useUserStore} from "~/store/user";
import moment from "moment";
import {useLeagueFetch} from "~/composables/useLeaguesFetch/useLeaguesFetch";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";

const originalData = ref([] as Array<League>)
const leagues = ref([] as Array<LeaguesTableData>)
const headers = ref([] as Array<TableHeader>)
const showCreateModal = ref(false)
const selectedLeagueIdForDelete = ref(0)
const orderBy = ref('id')
const orderDirection = ref('asc')
const showDeleteModal = ref(false)
const loading = ref(false)
const editData = ref({
  id: 0,
  name: '',
  startDate: '',
  endDate: '',
  information: '',
  organizer: '',
  isActive: false
})
const userStore = useUserStore()
const {fetchLeagues} = useLeagueFetch()

const isAdmin = computed(() => {
  return userStore.getUserRoleNames().includes('Association Admin') || userStore.getUserRoleNames().includes('Super Admin')
})

const clubIds = computed(() => {
  const userRoles = userStore.user?.userRoles.filter((role: any) => ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(role.roleId) && role.clubId))
  return userRoles?.map((userRole: any) => userRole.clubId);
})

onMounted(() => {
  fetch()

  headers.value = [
    {
      label: 'Name',
      sortable: true,
      sortValue: 'name',
      dataKey: 'name',
    },
    {
      label: 'Start Date',
      sortable: true,
      sortValue: 'startDate',
      dataKey: 'start',
    },
    {
      label: 'End Date',
      sortable: true,
      sortValue: 'endDate',
      dataKey: 'end',
    },
    {
      label: 'Organizer',
      sortable: false,
      dataKey: 'organizer',
      sortValue: '',
    },
  ]
})

watch(() => showCreateModal.value, () => {
  if (!showCreateModal.value) {
    editData.value = {
      id: 0,
      name: '',
      startDate: '',
      endDate: '',
      information: '',
      organizer: '',
      isActive: false
    }
  }
})

const canEdit = ((league: LeaguesTableData) => {
  return clubIds.value?.includes(league.clubId)
})

async function fetch() {
  showCreateModal.value = false
  showDeleteModal.value = false
  leagues.value = []
  loading.value = true
  const response = await fetchLeagues({
        seasonSportId: userStore.seasonSportId,
        deleted: false,
      },
      orderBy.value,
      orderDirection.value
  )

  if (!response) {
    return
  }

  const res = response as Array<League>

  res.forEach(data => {
    leagues.value.push({
      id: data.id,
      name: data.name,
      start: data.startDate,
      end: data.endDate,
      organizer: !data.clubId ? 'federation' : data.club.name,
      clubId: data.clubId,
    })
  })
  loading.value = false
  originalData.value = res
}

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetch()
}

function editLeague(id: number) {
  const league = originalData.value.find((league) => league.id === id)

  if (league) {
    editData.value = {
      id: id as number,
      name: league.name as string,
      startDate: moment(league.startDate).format('YYYY-MM-DD'),
      endDate: moment(league.endDate).format('YYYY-MM-DD'),
      information: league.information as string,
      isActive: league.isActive as boolean,
    }
    showCreateModal.value = true
  }
}

function deleteLeague(id: number) {
  selectedLeagueIdForDelete.value = id
  showDeleteModal.value = true
}
</script>
