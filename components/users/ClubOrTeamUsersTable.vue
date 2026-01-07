<template>
  <div class="p-6">
    <Breadcrumb/>
    <div class="rounded-lg overflow-hidden pb-4">
      <TableStriped
          :headers="headers"
          :clickable="true"
          :data="users"
          title="Users"
          :loading="loading"
          :show-edit="true"
          :show-delete="true"
          class="bg-white"
          :fixed-table="true"
          action-column-classes="w-40"
          @sorted="sort"
          @editIconClicked="(rowId) => navigateTo(`users/${rowId}`)"
          @deleteIconClicked="(rowId) => openDeleteModal(rowId)"
      >
        <template #header>
          <div class="flex gap-6 items-center justify-end">
            <BaseButton
                @on-click="() => showAddTeamUserModal = true"
                class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
            >
              Add User
            </BaseButton>
          </div>
        </template>
        <template #headerBottom>
          <div class="flex gap-6 w-full items-top justify-between pl-4">
            <div class="w-2/3">
              <div class="flex gap-6 items-center">
                <label for="roles" class="text-sm text-nowrap">
                  Filter by
                </label>
                <SelectMultiple v-model:value="selectedRoles"
                                :options="roles"
                                :multiple="true"
                                :close-on-select="false"
                                :clear-on-select="false"
                                placeholder="Select Roles"
                                label="label"
                                track-by="value"
                                class="max-w-80"
                                :preselect-first="false"
                >
                  <template #selection="{ values, isOpen }">
                  <span class="multiselect__single"
                        v-if="values.length"
                        v-show="!isOpen">
                    {{ values.length }} options selected
                  </span>
                  </template>
                </SelectMultiple>
              </div>
              <div class="flex flex-wrap w-2/3 my-4 items-center gap-4" v-if="selectedRoles.length">
                <template v-for="(role, index) in selectedRoles">
                  <div class="px-2 py-1 bg-gray-200 flex items-center gap-2 rounded-xl">
                    <p class="text-sm text-nowrap">
                      {{ role.label }}
                    </p>
                    <font-awesome
                        :icon="['fas', 'xmark']"
                        @click="() => unSelect(index)"
                        class="text-gray-400 hover:text-black cursor-pointer"
                    />
                  </div>
                </template>
              </div>
            </div>
            <SearchInput
                v-model="searchQuery"
                placeholder="Search..."
                class="min-w-48 ml-4 h-fit"
            />
          </div>
        </template>
        <template #actions="{ row }: {row: ClubUsersTable}">
          <span class="relative group text-nowrap">
            <font-awesome
                :icon="['fas', 'volleyball']"
                @click="() => navigateTo(`users/${row.id}/games`)"
                class="p-1.5 text-base rounded-full hover:text-sky-500 transition text-sky-600 cursor-pointer"
            />
            <span
                class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
              Games
            </span>
          </span>
          <span class="relative group text-nowrap" v-if="row.is_coach">
              <font-awesome
                  :icon="['fas', 'up-right-from-square']"
                  class="text-base cursor-pointer p-1.5"
                  @click="navigateTo(`users/${row.coach_id}/coach`)"
              />
              <span
                  class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white p-px shadow-2xl px-3 right-0 border"
              >
              View
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
            <div class="flex justify-start mx-2 lg:justify-end items-center gap-6">
              <p class="flex items-center text-nowrap gap-4 my-3 text-sm">
                Rows per page:
                <Select
                    :options="limitOptions"
                    v-model:value="limit"
                    direction="top"
                />
              </p>
              <template v-if="count > limit.value">
                <TablePagination
                    v-model:page="page"
                    :page-count="pagesCount"
                    @page-changed="fetchUsers"
                />
              </template>
            </div>
          </div>
        </template>
      </TableStriped>
    </div>
    <ConfirmationModal
        v-model:visible="showDeleteModal"
        @confirmed="deleteUser"
        :show-danger-confirmation="true"
        modal-body="Are you sure you want to delete this user from club?"
    />
    <AddUserToTheTeamModal
        :clubId="+clubId"
        v-model:visible="showAddTeamUserModal"
        @re-fetch="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">

import TableStriped from "~/components/tables/TableStriped.vue";
import TablePagination from "~/components/pagination/TablePagination.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import SearchInput from "~/components/inputs/SearchInput.vue";
import Select from "~/components/inputs/Select.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type TableHeader from "~/interfaces/table/tableHeader";
import type Users from "~/interfaces/users/users";
import {ref} from "vue";
import type Team from "~/interfaces/teams/team";
import {useRoleStore} from "~/store/role";
import {useUserStore} from "~/store/user";
import type ClubUsersTable from "~/interfaces/users/clubUsersTable";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import {useRoute} from "vue-router";
import {useUsersFetch} from "~/composables/useUsersFetch/useUsersFetch";
import type UserRole from "~/interfaces/users/userRole";
import AddUserToTheTeamModal from "~/components/modals/user/AddUserToTheTeamModal.vue";
import SelectMultiple from "~/components/inputs/SelectMultiple.vue";

const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  users: {
    type: Array as () => Array<Users>,
    default: []
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['fetchData'])

const rolesStore = useRoleStore()
const userStore = useUserStore()
const {deleteUserRole} = useUsersFetch()

const route = useRoute()
let clubId = route.params.clubId
if (!clubId) {
  const club = userStore.user.user_roles
      .find(
          (userRole: UserRole) => ([1, 2, 3, 4].includes(userRole.roleId) &&
              userRole.seasonSportId === userStore.seasonSportId &&
              userRole.userRoleApprovedByUserId)
      )?.clubId
  if (club) {
    clubId = club.id
  }
}
const showDeleteModal = ref(false);
const selectedUserForDelete = ref(0);
const teamId = route.params.teamId
const showAddTeamUserModal = ref(false);

const page = ref(1)
const limitOptions = [
  {label: "10", value: 10, disabled: false},
  {label: "20", value: 20, disabled: false},
  {label: "50", value: 50, disabled: false},
] as SelectOptions[];
const limit = ref(limitOptions[0] as SelectOptions)
const searchQuery = ref('')
const orderBy = ref("name");
const orderDirection = ref("asc");
const users = ref([] as Array<ClubUsersTable>)

const headers = [
  {
    label: 'Name',
    sortable: true,
    sortValue: 'name',
    dataKey: 'name',
    className: 'w-80'
  },
  {
    label: 'Email',
    sortable: true,
    sortValue: 'email',
    dataKey: 'email',
    // className: 'w-96'
  },
  {
    label: 'Active Roles',
    sortable: false,
    sortValue: '',
    dataKey: 'active_roles',
    // className: 'w-48'
  },
  {
    label: 'License',
    sortable: true,
    dataKey: 'license',
    sortValue: 'license',
    className: 'w-40',
  },
] as TableHeader[];

const selectedRoles = ref([] as Array<SelectOptions>)

watch([page, limit, searchQuery, selectedRoles], () => {
  fetchUsers()
})

watch(() => props.users, () => {
  users.value = props.users.map((user) => {
    return {
      id: user.id,
      name: user.name ? user.name : '',
      email: user.email,
      active_roles: getRoles(user),
      license: getLicense(user),
      is_coach: !!user.coachLicense,
      coach_id: user.coachLicense?.id,
    }
  })
}, {
  deep: true,
  immediate: true,
})

const roles = computed(() => {
  const allRoles = rolesStore.roles.map(role => ({
    label: role.description,
    value: role.id,
    disabled: false
  })).sort((a, b) => a.label.localeCompare(b.label));

  return [
    ...allRoles
  ]
});

const pagesCount = computed(() => {
  return Math.ceil(props.count / limit.value.value);
});

const currentShowCount = computed(() => {
  if (props.count === 1) {
    return '1 of 1'
  }

  let currentPageMaxValue = (+page.value) * +(limit.value.value ?? 0)
  let currentPageMinValue = (+page.value - 1) * +(limit.value.value ?? 0) + 1
  return currentPageMinValue + ' - ' + ((props.count > currentPageMaxValue) ? currentPageMaxValue : props.count) + ' of ' + props.count
})

const deleteData = computed(() => {
  if (teamId) {
    return {teamId: teamId}
  } else if (clubId) {
    return {clubId: clubId}
  }
  return {}
})

function fetchUsers() {
  emit("fetchData", {
    orderBy: orderBy.value,
    orderDirection: orderDirection.value,
    page: page.value,
    limit: limit.value.value,
    searchTerm: searchQuery.value,
    ...(selectedRoles.value?.length > 1 || selectedRoles.value[0]?.value ? {
      roles: selectedRoles.value.map((role) => role.value)
    } : {})
  });
  showAddTeamUserModal.value = false;
}

function sort(column: string) {
  if (orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }
  fetchUsers()
}

function getLicense(user: Users) {
  let license = `${user.license}`;

  let showLicense = false
  if (user.referee?.license) {
    showLicense = true
    license += `<br/> <span>Referee</span>`;
  }

  if (user.roles?.find(role => role.id === 8)) {
    showLicense = true
    license += `<br/> <span>Player</span>`;
  }

  if (user.coachLicense?.license || user.coachLicense?.masterLicense) {
    showLicense = true
    license += `<br/> <span>Trainer</span>`;

    if (new Date(user.coachLicense?.end ? user.coachLicense?.end : '').getTime() <= Date.now()) {
      license += `<span> expired</span>`;
    }
  }

  if (!showLicense) {
    license = 'no active'
  }

  return license
}

function getRoles(user: Users) {
  let roles = ''
  let isCoach = false;
  let isTM = false;
  let isPlayer = false;
  let isParent = false;
  let userIsRefClub = false;

  let coachRoles = '';
  let TMRoles = '';
  let playerRoles = '';
  let parentRoles = '';
  user.roles?.forEach((role) => {
    let team = null
    if (role.user_roles?.teamId) {
      team = user.teams.find((team: Team) => team.id === role.user_roles?.teamId);
    }

    if (role.id === 5 || role.id === 6) {
      isCoach = true;
      if (team?.localName) {
        coachRoles = `${coachRoles.length ? '<br/>' : ''} - ${role.id === 5 ? 'HC' : 'AC'} ${team?.localName} (${team?.club?.name})`;
      }
    } else if (role.id === 7) {
      isTM = true;
      if (team?.localName) {
        TMRoles = `${TMRoles.length ? '<br/>' : ''} - ${team?.localName} (${team?.club?.name})`;
      }
    } else if (role.id === 8) {
      isPlayer = true;
      if (team?.localName) {
        playerRoles = `${playerRoles.length ? '<br/>' : ''} - ${team?.localName} (${team?.club?.name})`;
      }
    } else if (role.id === 9) {
      isParent = true;
      if (team?.localName) {
        parentRoles = `${parentRoles.length ? '<br/>' : ''} - ${team?.localName} (${team?.club?.name})`;
      }
    } else if (role.id === 11) {
      userIsRefClub = true;
    } else if (role.user_roles?.userRoleApprovedByUserId && role.user_roles?.seasonSportId === userStore.seasonSportId && !([5, 6, 7, 8, 9, 11].includes(role.user_roles?.roleId))) {
      roles += `${roles.length ? '<br/>' : ''} ${rolesStore.roles.find((projectRole) => projectRole.id === role.id)?.description}`
    }
  })

  if (isCoach) {
    if (coachRoles.length) {
      roles = `Trainer ${coachRoles} ${roles.length ? '<br/>' : ''} ${roles}`
    } else {
      roles = `Trainer without a team ${roles.length ? '<br/>' : ''} ${roles}`
    }
  }

  if (isTM) {
    if (TMRoles.length) {
      roles = `Team manager ${TMRoles} ${roles.length ? '<br/>' : ''} ${roles}`
    } else {
      roles = `Team manager without a team ${roles.length ? '<br/>' : ''} ${roles}`
    }
  }

  if (isPlayer) {
    if (playerRoles.length) {
      roles = `Player ${playerRoles} ${roles.length ? '<br/>' : ''} ${roles}`
    } else {
      roles = `Player without a team ${roles.length ? '<br/>' : ''} ${roles}`
    }
  }

  if (isParent) {
    if (parentRoles.length) {
      roles = `Parent ${parentRoles} ${roles.length ? '<br/>' : ''} ${roles}`
    } else {
      roles = `Parent without a team ${roles.length ? '<br/>' : ''} ${roles}`
    }
  }

  if (user.referee?.license) {
    roles = `Federal referee ${roles.length ? '<br/>' : ''} ${roles}`
  }

  if (userIsRefClub) {
    roles = `Club referee ${roles.length ? '<br/>' : ''} ${roles}`
  }

  return roles
}

async function deleteUser() {
  await deleteUserRole(selectedUserForDelete.value, deleteData.value)
  showDeleteModal.value = false
  selectedUserForDelete.value = 0
  fetchUsers()
}

function openDeleteModal(id: number) {
  selectedUserForDelete.value = id
  showDeleteModal.value = true
}

function unSelect(index: number) {
  selectedRoles.value.splice(index, 1)
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>
