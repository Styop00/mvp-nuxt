<template>
  <div class="p-6">
    <Breadcrumb />
    <GameRefListTable :referees="referees" :game-id="gameId" />
    <div class="rounded-lg overflow-hidden pb-4"></div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import { useRefereesFetch } from '~/composables/useRefereeFetch/useRefereeFetch';
import { useUserStore } from '~/store/user';
import GameRefListTable from "~/components/referees/GameRefListTable.vue"
import type { RefereeGetRefList } from '~/interfaces/referees/referee';
import { useRoute } from 'vue-router';

const route = useRoute()
const gameId = Number(route.params.refereeattachmentId)
const referees = ref<RefereeGetRefList[] | null>([])
const { getRefList } = useRefereesFetch()
const { seasonSportId } = useUserStore()
const loading = ref(false)

async function fetchRefList() {
  loading.value = true;
  try {
    const response = await getRefList({
      gameId: gameId,
      seasonSportId,
    }) ;
    referees.value = response;
  } catch (error) {
    console.error("Error fetching referees:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
    fetchRefList();
});
</script>
