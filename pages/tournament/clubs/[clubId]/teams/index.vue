<template>
  <TeamTable :clubs="clubs" :loading="loading"/>
</template>
<script setup lang="ts">
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import type Clubs from "~/interfaces/clubs/club";
import TeamTable from "~/components/teams/TeamTable.vue";

const route = useRoute()
const clubId = route.params.clubId
const clubs = ref([] as Array<Clubs>)
const {fetchClubById} = useClubsFetch()
const loading = ref(true)


async function fetchClubData() {
  loading.value = true
  clubs.value = [(await fetchClubById(+clubId))]
  loading.value = false
}

// Watch for route param changes
watch(() => route.params.clubId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    clubs.value = []
    fetchClubData()
  }
}, { immediate: false })

onMounted(async () => {
  await fetchClubData()
})
</script>
