<template>
  <div class="py-2 lg:p-6">
    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <Breadcrumb />
        <GameTable
            :games="games"
            @sort="sort"
            @re-fetch="fetchGames"
            :loading="loading"
            :data-count="count"
            type="fighting"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type Game from "~/interfaces/games/game";
import GameTable from "~/components/games/GameTable.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import {useUserStore} from "~/store/user";

const { getGames } = useGamesFetch()
const userStore = useUserStore()

const games = ref([] as Array<Game>)
const orderBy = ref('date')
const orderDirection = ref('asc')
const loading = ref(false)
const count = ref(0)

async function fetchGames(data?: any) {
  loading.value = true
  let reqData = {} as any

  if (!userStore.isAdmin) {
    reqData.mine = true;
  }

  const res = await getGames(
      {
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        seasonSportId: userStore.seasonSportId,
        ...reqData,
        ...(data ? data : {limit: 10, page: 1})
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

onMounted(() => {
  fetchGames()
})

</script>