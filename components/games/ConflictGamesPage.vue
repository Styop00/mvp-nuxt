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
            type="conflicts"
            @ignore-conflict="ignoreConflict"
            :show-conflicts-filter="false"
        />
      </div>
    </div>
    <ConfirmationModal
        modal-body="Are you sure you want to ignore conflicts?"
        v-model:visible="showConfirmDeleteModal"
        :showDangerConfirmation="true"
        @confirmed="deleteConflict"
    />
  </div>
</template>

<script setup lang="ts">

import type Game from "~/interfaces/games/game";
import GameTable from "~/components/games/GameTable.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import {useConflictFetch} from "~/composables/useConflictFetch/useConflictFetch";
import {useUserStore} from "~/store/user";

const {getGames} = useGamesFetch()
const userStore = useUserStore()
const {updateConflictById} = useConflictFetch()
const games = ref([] as Array<Game>)
const orderBy = ref('date')
const orderDirection = ref('asc')
const loading = ref(false)
const count = ref(0)
const showConfirmDeleteModal = ref(false)
const selectedGame = ref({} as Game)

async function fetchGames(data?: any) {
  loading.value = true
  const res = await getGames(
      {
        order_by: orderBy.value,
        order_direction: orderDirection.value,
        ...(data ? data : {limit: 10, page: 1}),
        type: 'conflicts',
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

async function deleteConflict() {
  if (userStore.isAdmin) {
    await updateConflictById(selectedGame.value.conflict?.id, {ignoreAssociations: true})
  } else if (userStore.isCoach || userStore.isClubManager) {
    const user_roles = userStore.user.user_roles.filter((role: any) => [1, 5, 6, 7].includes(role.roleId))
    if (user_roles.find((role: any) => (role.clubId === selectedGame.value.home_team?.clubId || role.teamId === selectedGame.value.home_team?.id))) {
      await updateConflictById(selectedGame.value.conflict?.id, {ignore_home: true})
    } else {
      await updateConflictById(selectedGame.value.conflict?.id, {ignore_away: true})
    }
  }
  showConfirmDeleteModal.value = false
  await fetchGames()
}

function ignoreConflict(gameId: number) {
  selectedGame.value = games.value.find(game => game.id === gameId) as Game
  showConfirmDeleteModal.value = true
}

onMounted(() => {
  fetchGames()
})

</script>
