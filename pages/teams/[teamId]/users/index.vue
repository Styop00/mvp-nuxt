<template>
  <ClubOrTeamUsersTable
      :count="count"
      :users="users"
      @fetch-data="fetchUsers"
      :loading="loading"
  />
</template>

<script setup lang="ts">
import ClubOrTeamUsersTable from "~/components/users/ClubOrTeamUsersTable.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import {useRoleStore} from "~/store/role";

const {getTeamUsers} = useTeamsFetch()
const rolesStore = useRoleStore()

const route = useRoute()
const loading = ref(false)
const teamId = route.params.teamId

const users = ref()
const count = ref(0)

async function fetchUsers(data: any) {
  loading.value = true
  if (!rolesStore.roles.length) {
    await rolesStore.fetchRoles()
  }
  const response = await getTeamUsers(+teamId, data)
  if (!response) return;

  count.value = response.count
  users.value = response.rows

  loading.value = false
}
</script>