<template>
  <ClubOrTeamUsersTable
      :count="count"
      :users="users"
      @fetch-data="fetchUsers"
  />
</template>

<script setup lang="ts">
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import {useUserStore} from "~/store/user";
import type UserRole from "~/interfaces/users/userRole";
import ClubOrTeamUsersTable from "~/components/users/ClubOrTeamUsersTable.vue";
import {useRoleStore} from "~/store/role";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";

const {getClubUsers} = useClubsFetch()
const {getTeamUsers} = useTeamsFetch()
const userStore = useUserStore()
const rolesStore = useRoleStore()

const users = ref()
const count = ref(0)
const loading = ref(false)

async function fetchUsers(data: any) {
  loading.value = true
  const clubId = userStore.user.userRoles
      .find(
          (userRole: UserRole) => ([1, 2, 3, 4].includes(userRole.roleId) &&
              userRole.seasonSportId === userStore.seasonSportId &&
              userRole.userRoleApprovedByUserId)
      )?.clubId
  if (clubId) {
    if (!rolesStore.roles.length) {
      await rolesStore.fetchRoles()
    }
    const response = await getClubUsers(clubId, data)
    if (!response) return;

    count.value = response.count
    users.value = response.rows
  } else {
    const teamId = userStore.user.userRoles
        .find(
            (userRole: UserRole) => ([5, 6, 7].includes(userRole.roleId) &&
                userRole.seasonSportId === userStore.seasonSportId &&
                userRole.userRoleApprovedByUserId)
        )?.teamId
    if (teamId) {
      const response = await getTeamUsers(teamId, data)
      if (!response) return;

      count.value = response.count
      users.value = response.rows
    }
  }
  loading.value = false
}

</script>