<template>
  <div class="bg-white rounded-2xl p-2 lg:p-8">
    <p class="text-xl mb-4">Update User</p>
    <div class="grid grid-cols-3 gap-4">
      <TextInput
          v-model:value="user.license"
          :disabled="true"
          label="License"
          input-classes="cursor-not-allowed !bg-gray-100"
          @update:value="() => hasUnsavedChanges = true"
      />
      <div>
        <TextInput
            v-model:value="user.name"
            label="Name"
            @update:value="() => hasUnsavedChanges = true"
            :required="true"
        />
        <p v-if="nameError" class="text-red-700 text-xs pl-1 pt-1">
          {{ nameError }}
        </p>

      </div>
      <div>
        <TextInput
            v-model:value="user.email"
            label="Email"
            type="email"
            @update:value="() => hasUnsavedChanges = true"
            :required="true"
        />
        <p v-if="emailError" class="text-red-700 text-xs pl-1 pt-1">
          {{ emailError }}
        </p>
      </div>
      <TextInput v-model:value="user.nationality" label="Nationality" @update:value="() => hasUnsavedChanges = true"/>
      <div>
        <TextInput
            v-model:value="birthDate"
            label="Date Year-Month"
            placeholder="Date YYYY-MM"
            @update:value="() => hasUnsavedChanges = true"
        />
        <p v-if="dateError" class="text-red-700 text-xs pl-1 pt-1">
          {{ dateError }}
        </p>
      </div>
    </div>
    <div class="mt-4" v-if="playerLicense?.id">
      <p>
        Player License
      </p>
      <div class="grid grid-cols-3 gap-4 items-center justify-between">
        <CheckBox
            v-model:value="playerLicense.onContract"
            label="On contract"
            @change="() => licenseChange(true)"
        />
        <div class="w-full relative calendar ">
          <TextInput
              v-model:value="playerLicense.start"
              label="Start"
              @click.stop.prevent="() => { closeSelects(); showStartLicenseCalendar = true}"
              :prevent-input="true"
          />
          <div
              class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow"
              @click.stop
              v-if="showStartLicenseCalendar"
          >
            <DatePicker
                @update:model-value="() => licenseChange(true)"
                v-model:model-value="playerLicense.start" color="blue"/>
          </div>
        </div>
        <div class="w-full relative calendar ">
          <TextInput
              v-model:value="playerLicense.finish"
              label="End"
              @click.stop.prevent="() => { closeSelects(); showEndLicenseCalendar = true}"
              :prevent-input="true"
          />
          <div
              class="absolute top-full left-1/2 -translate-x-1/2 bg-white z-[100] shadow"
              @click.stop
              v-if="showEndLicenseCalendar"
          >
            <DatePicker
                @update:model-value="() => licenseChange(true)"
                v-model:model-value="playerLicense.finish" color="blue"
                :min-date="playerLicense.start"
            />
          </div>
        </div>
      </div>
    </div>
    <TableStriped
        :headers="roleHeaders"
        :data="roleData"
        :show-edit="false"
        :show-delete="true"
        class="bg-white mt-12 px-4 shadow-none"
        @deleteIconClicked="(rowId) => deleteUserRole(rowId)"
        :fixed-table="true"
    >
      <template #header>
        <div class="flex items-center justify-end w-full">
          <BaseButton
              class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block mb-3 text-nowrap"
              @onClick="() => showAddRoleModal = true"
          >
            Add role
          </BaseButton>
        </div>
      </template>
      <template #actions="{ row }">
        <span class="relative group text-nowrap" v-if="!row.approvedBy">
          <font-awesome :icon="['fas', 'check']"
                        @click="() => showApproveUserRole(row.id)"
                        class="p-1.5 text-base rounded-full hover:text-green-300 transition text-green-400 cursor-pointer"/>
          <span
              class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
            Approve
          </span>
        </span>
        <span class="relative group text-nowrap"  v-if="row.roleId === 8 && user?.player?.id">
          <font-awesome :icon="['fas', 'shirt']"
                        @click="() => showJerseyNumber()"
                        class="p-1.5 text-base rounded-full hover:text-teal-500 transition text-teal-600 cursor-pointer"/>
          <span
              class="absolute bottom-full mb-1 text-xxs tracking-wider group-hover:!inline-block hidden !bg-white left-1/2 p-px shadow-2xl px-3 -translate-x-1/2 border">
            Jersey number
          </span>
        </span>
      </template>
    </TableStriped>
    <div class="flex items-center justify-center my-4 mt-8 w-full">
      <BaseButton
          class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block mb-3 text-nowrap"
          :class="{'cursor-not-allowed opacity-40 hover:!bg-brand-primary-color hover:!text-white': loading }"
          @onClick="() => saveChanges()"
      >
        Save
      </BaseButton>
    </div>

    <AddUserTeamRoleModal
        v-model:visible="showAddRoleModal"
        :clubId="+clubId"
        @update-roles="addRoles"
    />
    <ConfirmationModal
        modal-body="Are you sure you want to delete User role?"
        @confirmed="() => deleteRole()"
        v-model:visible="showDeleteRoleModal"
    />
    <ConfirmationModal
        modal-body="Are you sure you want to approve User role?"
        @confirmed="() => approveRole()"
        v-model:visible="showApproveRoleModal"
    />
    <template v-if="user?.player?.id">
      <AddJerseyNumberModal
          :jersey-number="+user.player.jerseyNumber"
          :player-id="user.player.id"
          v-model:visible="showJerseyNumberModal"
          @re-fetch="fetchUser"
      />
    </template>
  </div>
  <SuccessAlert
      v-model:visible="showSuccessAlert"
      text="The user details has been successfully updated."
  />
  <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">

import {useUsersFetch} from "~/composables/useUsersFetch/useUsersFetch";
import type Users from "~/interfaces/users/users";
import TextInput from "~/components/inputs/TextInput.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import CheckBox from "~/components/inputs/CheckBox.vue";
import TableStriped from "~/components/tables/TableStriped.vue";
import type TableHeader from "~/interfaces/table/tableHeader";
import {useRoute} from "vue-router";
import type UserRole from "~/interfaces/users/userRole";
import {useUserStore} from "~/store/user";
import BaseButton from "~/components/buttons/BaseButton.vue";
import moment from "moment";
import AddUserTeamRoleModal from "~/components/modals/user/AddUserTeamRoleModal.vue";
import {useRoleStore} from "~/store/role";
import {useRolesFetch} from "~/composables/useRolesFetch/useRolesFetch";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import {usePersonFetch} from "~/composables/usePersonFetch/usePersonFetch";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";
import AddJerseyNumberModal from "~/components/modals/user/AddJerseyNumberModal.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";

const {fetchTeamUserById, updateUser} = useUsersFetch()
const {assignUserRole, denyUserRole, approveUserRole} = useRolesFetch()
const {savePlayerLicense} = usePersonFetch()
const {fetchTeamById} = useTeamsFetch()

const userStore = useUserStore()
const rolesStore = useRoleStore()
const route = useRoute()
let clubId = route.params.clubId
const teamId = route.params.teamId
const userId = route.params.userId
const router = useRouter()
const user = ref({} as Users)
const birthDate = ref('')
const playerLicense = ref()
const loading = ref(false)
const roleData = ref([] as Array<any>)
const showStartLicenseCalendar = ref(false)
const showEndLicenseCalendar = ref(false)
const licenseChanged = ref(false)
const rolesChanged = ref(false)
const showAddRoleModal = ref(false)
const showDeleteRoleModal = ref(false)
const showApproveRoleModal = ref(false)
const selectedRoleIdToDelete = ref(0)
const selectedRoleIdToApprove = ref(0)
const showSuccessAlert = ref(false)
const showUnsavedChangesModal = ref(false)
const showJerseyNumberModal = ref(false)
let routeNext: any = null;
const hasUnsavedChanges = ref(false);
const emailError = ref('')
const dateError = ref('')
const nameError = ref('')

const roleHeaders = [
  {
    label: 'Role',
    dataKey: 'role',
    sortable: false,
    sortValue: '',
  },
  {
    label: 'Team',
    dataKey: 'team',
    sortable: false,
    sortValue: '',
  },
  {
    label: 'Status',
    dataKey: 'status',
    sortable: false,
    sortValue: '',
  },
] as Array<TableHeader>


if (!rolesStore.roles.length) {
  await rolesStore.fetchRoles()
}

const userData = computed(() => {
  return {
    nationality: user.value.nationality,
    name: user.value.name,
    email: user.value.email,
    birthYear: birthDate.value.split('-').length ? +birthDate.value.split('-')[0] : null,
    birthMonth: birthDate.value.split('-').length > 1 ? +birthDate.value.split('-')[1] : null,
  }
})

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(user.value.email);
})

const isValidDate = computed(() => {
  if (!birthDate.value) return true

  const dateRegex = /^\d{4}\s*-\s*(0?[1-9]|1[0-2])$/;
  return dateRegex.test(birthDate.value);
})

watch(() => playerLicense.value?.start, () => {
  if (playerLicense.value?.finish && moment(playerLicense.value?.finish.toString()).isBefore(moment(playerLicense.value?.start?.toString()))) {
    playerLicense.value.finish = ''
  }
}, {
  deep: true,
  immediate: true
})

await fetchClub()
await fetchUser()

async function fetchUser() {
  const response = await fetchTeamUserById(+userId)
  if (response) {
    user.value = response

    if (!clubId) {
      clubId = userStore.user.userRoles
          .find(
              (userRole: UserRole) => ([1, 2, 3, 4].includes(userRole.roleId) &&
                  userRole.seasonSportId === userStore.seasonSportId &&
                  userRole.userRoleApprovedByUserId)
          )?.clubId

      if (!clubId && !teamId) {
        const teamId = userStore.user.userRoles
            .find(
                (userRole: UserRole) => ([5, 6, 7].includes(userRole.roleId) &&
                    userRole.seasonSportId === userStore.seasonSportId &&
                    userRole.userRoleApprovedByUserId)
            )?.teamId
        if (teamId) {
          const response = await fetchTeamById(teamId)
          clubId = response.clubId
        }
      }
    }

    roleData.value = []
    user.value.userRoles?.forEach((userRole: UserRole) => {
      if (userRole.teamId) {
        const team = user.value.teams?.find(team => team.id === userRole.teamId)
        if (team) {
          roleData.value.push({
            id: userRole.id,
            roleId: userRole.roleId,
            role: rolesStore.roles.find(role => role.id === userRole.roleId)?.description,
            team: team.localName,
            teamId: team.id,
            approvedBy: userRole.userRoleApprovedByUserId,
            status: userRole.userRoleApprovedByUserId ? '<span class="text-nowrap text-green-700">ok</span>' : '<span class="text-yellow-700 text-nowrap">not approved</span>'
          })
        }
      } else if (userRole.clubId) {
        const club = user.value.clubs?.find(club => club.id === userRole.clubId)
        if (club) {
          roleData.value.push({
            id: userRole.id,
            roleId: userRole.roleId,
            role: rolesStore.roles.find(role => role.id === userRole.roleId)?.description,
            team: club.name,
            teamId: club.id,
            approvedBy: userRole.userRoleApprovedByUserId,
            status: userRole.userRoleApprovedByUserId ? '<span class="text-nowrap text-green-700">ok</span>' : '<span class="text-yellow-700 text-nowrap">not approved</span>'
          })
        }
      }
    })

    if (!playerLicense.value) {
      const license = user.value.player?.playerLicenses?.find(license => {
        return license.clubId === +clubId
      })
      if (user.value.player && license) {
        if (license) {
          playerLicense.value = {
            onContract: !!license.onContract,
            start: moment(license.start, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            finish: moment(license.end, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            id: license.id,
          }
        }
      }
    }

    if (user.value.birthYear) {
      birthDate.value = `${user.value.birthYear} - ${user.value.birthMonth}`
    }
  } else {
    router.back()
  }
}

async function fetchClub() {
  if (!clubId && !teamId) {
    clubId = userStore.user.userRoles
        .find(
            (userRole: UserRole) => ([1, 2, 3, 4].includes(userRole.roleId) &&
                userRole.seasonSportId === userStore.seasonSportId &&
                userRole.userRoleApprovedByUserId)
        )?.clubId
  }

  if (teamId) {

  }
}

function closeSelects() {
  showEndLicenseCalendar.value = false
  showStartLicenseCalendar.value = false
}

async function saveChanges() {
  emailError.value = '';
  dateError.value = '';
  nameError.value = ''
  if (!user.value.name) {
    nameError.value = 'Name is required.'
    return
  }

  if (!isValidEmail.value) {
    emailError.value = 'Email is not valid.'
    return
  }

  if (!isValidDate.value) {
    dateError.value = 'User birth date is not valid. Please use this syntax YYYY - MM.'
    return
  }

  loading.value = true

  await updateUser(+userId, {
    ...userData.value
  }, false)

  if (rolesChanged.value) {
    const newRoles = roleData.value.filter(role => !role.id)
    for (const role of newRoles) {
      await assignUserRole(role.roleId, +userId, {
        teamId: role.teamId ? role.teamId : null,
        clubId: clubId,
        seasonSportId: userStore.seasonSportId,
      })
    }
    const oldRoles = [] as Array<number>
    user.value.userRoles?.forEach((userRole: UserRole) => {
      if (userRole.teamId) {
        const team = user.value.teams?.find(team => team.id === userRole.teamId)
        if (team) {
          oldRoles.push(userRole.id)
        }
      } else if (userRole.clubId) {
        const club = user.value.clubs?.find(club => club.id === userRole.clubId)
        if (club) {
          oldRoles.push(userRole.id)
        }
      }
    })
    const existingOldRoles = roleData.value.filter(role => role.id).map(role => role.id)
    let deleted = oldRoles.filter((role: number) => !existingOldRoles.includes(role));

    if (deleted.length) {
      await denyUserRole(user.value.id, {userRoles: deleted})
    }

    const unApprovedRoles = user.value.userRoles?.filter(role => !role.userRoleApprovedByUserId).map(role => role.id)
    if (unApprovedRoles && unApprovedRoles.length) {
      const approvedRoles = roleData.value.filter(role => role.id && role.approvedBy > 0 && unApprovedRoles.includes(role.id)).map(role => role.id);
      if (approvedRoles && approvedRoles.length) {
        await approveUserRole(user.value.id, {userRoles: approvedRoles})
      }
    }
  }

  if (playerLicense.value?.id && licenseChanged.value) {
    await savePlayerLicense({
      start: playerLicense.value.start,
      end: playerLicense.value.finish,
      onContract: playerLicense.value.onContract,
      seasonSportId: userStore.seasonSportId,
      id: user.value.id,
      licenseId: playerLicense.value.id,
      userId: user.value.id
    })
  }

  showSuccessAlert.value = true
  hasUnsavedChanges.value = false
  licenseChanged.value = false
  rolesChanged.value = false
  loading.value = false
  await fetchUser()
}

async function approveRole() {
  const userRole = roleData.value.find(role => role.id === selectedRoleIdToApprove.value)
  userRole.status = '<span class="text-nowrap text-green-700">ok</span>'
  userRole.approvedBy = 1
  showApproveRoleModal.value = false
  selectedRoleIdToApprove.value = 0
  rolesChanged.value = true
}

function licenseChange(value: boolean) {
  licenseChanged.value = value
}

function addRoles(data: any) {
  roleData.value.push({
    id: null,
    roleId: data.roleId,
    role: rolesStore.roles.find(role => role.id === data.roleId)?.description,
    team: data.teamName,
    teamId: data.teamId,
    approvedBy: userStore.user.id,
    status: '<span class="text-nowrap text-green-700">ok</span>'
  })
  rolesChanged.value = true
}

function deleteUserRole(id: number) {
  selectedRoleIdToDelete.value = id
  showDeleteRoleModal.value = true
}

function showApproveUserRole(id: number) {
  selectedRoleIdToApprove.value = id
  showApproveRoleModal.value = true
}

function deleteRole() {
  let selectedIndex = null
  roleData.value.find((role, index) => {
    if (role.id === selectedRoleIdToDelete.value) {
      selectedIndex = index
      return true
    }
    return false
  })
  if (selectedIndex !== null) {
    roleData.value.splice(selectedIndex, 1)
    showDeleteRoleModal.value = false
    selectedRoleIdToDelete.value = 0
    rolesChanged.value = true
  }

}

function confirmLeavePage() {
  showUnsavedChangesModal.value = false;
  if (routeNext) {
    routeNext();
  }
}

function cancelLeavePage() {
  showUnsavedChangesModal.value = false;
  routeNext = null;
}

function showJerseyNumber() {
  showJerseyNumberModal.value = true;
}

onBeforeRouteLeave((to, from, next) => {
  if (rolesChanged.value || licenseChanged.value || hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    routeNext = next;
  } else {
    next();
  }
});

onMounted(() => {
  document.addEventListener('click', () => closeSelects())
})
</script>
