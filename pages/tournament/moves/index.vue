<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <Breadcrumb />
        <MovedAndCancelledGamesTable
            :games="games"
            @sort="sort"
            @re-fetch="fetchGames"
            :loading="loading"
            :data-count="count"
            :show-conflicts-filter="false"
            type="moved"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import type Game from "~/interfaces/games/game";
import MovedAndCancelledGamesTable from "~/components/games/MovedAndCancelledGamesTable.vue";

const { getMovedGames } = useGamesFetch()
const games = ref([] as Array<Game>)
const orderBy = ref('date')
const orderDirection = ref('asc')
const loading = ref(false)
const count = ref(0)

async function fetchGames(data?: any) {
  if (loading.value) return;
  loading.value = true
  const res = await getMovedGames(
      {
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        ...(data ? data : {limit: 10, page: 1}),
      }
  )
  games.value = res.rows
  count.value = res.count
  loading.value = false
}

function sort(data: any) {
  if (orderBy.value === data.column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = data.column
    orderDirection.value = 'asc'
  }
  fetchGames(data.data)
}
</script>