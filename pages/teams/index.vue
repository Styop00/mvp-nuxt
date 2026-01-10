<template>
  <TeamTable :clubs="clubs" :teamIds="teamIds"/>
</template>
<script setup lang="ts">
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import type Clubs from "~/interfaces/clubs/club";
import TeamTable from "~/components/teams/TeamTable.vue";
import {useUserStore} from "~/store/user";

const userStore = useUserStore()
const clubs = ref([] as Array<Clubs>)
const teamIds = ref([] as Array<Number>)
const {fetchAllClubs} = useClubsFetch()

async function fetchClubData() {
  if (userStore.getUserRoleNames().includes('Club Manager')) {
    const clubIds = userStore.user.user_roles.map(role => role.clubId)
    clubs.value = await fetchAllClubs({clubIds: clubIds, season_sport_id: userStore.seasonSportId})
  } else if (userStore.getUserRoleNames().includes('Team Manager')) {
    teamIds.value = userStore.user.user_roles.map(role => role.teamId)
  }
}

onMounted(async () => {
  await fetchClubData()
})
</script>
