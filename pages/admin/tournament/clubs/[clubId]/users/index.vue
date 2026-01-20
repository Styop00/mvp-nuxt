<template>
  <ClubOrTeamUsersTable
      :count="count"
      :users="users"
      @fetch-data="fetchUsers"
      :loading="loading"
  />
</template>

<script setup lang="ts">
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import ClubOrTeamUsersTable from "~/components/users/ClubOrTeamUsersTable.vue";
import {useRoleStore} from "~/store/role";

const {getClubUsers} = useClubsFetch()
const rolesStore = useRoleStore()
const route = useRoute()
const clubId = route.params.clubId

const users = ref()
const count = ref(0)
const loading = ref(false)

async function fetchUsers(data: any) {
  loading.value = true
  if (!rolesStore.roles.length) {
    await rolesStore.fetchRoles()
  }
  const response = await getClubUsers(+clubId, data)
  if (!response) return;

  count.value = response.count
  users.value = response.rows

  loading.value = false
}

</script>