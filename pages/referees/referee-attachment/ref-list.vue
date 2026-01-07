<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <Breadcrumb />
        <GameRefListTable :referees="referees" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRefereesFetch } from "~/composables/useRefereeFetch/useRefereeFetch";
import type { RefereeGetRefList } from "~/interfaces/referees/referee";
import { useUserStore } from "~/store/user";
import GameRefListTable from "~/components/referees/GameRefListTable.vue"

const route = useRoute();
const week = route.query.week;

const referees = ref<RefereeGetRefList[] | null>([]);
const loading = ref(true);
const { getRefList } = useRefereesFetch();
const { seasonSportId } = useUserStore();

async function fetchRefList() {
  loading.value = true;
  try {
    const response = await getRefList({
      week: Number(week),
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
  if (!week) {
    console.error("Week parameter is required!");
    return;
  }
  fetchRefList();
});
</script>
