<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />

    <div class="rounded-lg overflow-hidden pb-4">
      <div>
        <div class="flex items-center justify-end gap-4 mb-4 pr-3">

          <div class="flex items-center justify-end gap-4">
            <div class="flex gap-6 items-center">
              <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap bg-red-600 -600"
                          @onClick="() => showDeleteModal = true">
                Delete matches
              </BaseButton>
              <BaseButton class="!py-2 !px-2 text-sm sm:text-base sm:!px-8 block text-nowrap"
                          @onClick="() => {showGenerateModal = true; errorMessage = ''}">
                Generate matches
              </BaseButton>
            </div>
          </div>
        </div>
        <GameTable
            :games="games"
            @sort="sort"
            :data-count="count"
            :loading="loading"
            @re-fetch="fetchGames"
        />
      </div>
    </div>
    <ConfirmationModal
        v-model:visible="showDeleteModal"
        @confirmed="deleteGames"
        :show-danger-confirmation="true"
        modal-body="Are you sure you want to delete all tournament matches?"
    />
    <ConfirmationModal
        v-model:visible="showGenerateModal"
        @confirmed="generateGames"
        :width="3"
        :modal-body="errorMessage ? `<div class='mb-4'><p class='text-red-600'>${errorMessage}</p></div><p>Please fix the issue and try again.</p>` : 'Are you sure you want to generate tournament matches?'"
    />
  </div>
</template>

<script setup lang="ts">

import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import type Game from "~/interfaces/games/game";
import GameTable from "~/components/games/GameTable.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useUserStore} from "~/store/user";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";

const route = useRoute()
const tournamentId = route.params.tournamentId
const {getGames, generateAllGames, deleteAllGames} = useGamesFetch()
const games = ref([] as Array<Game>)
const previousGames = ref([] as Array<Game>)
const orderBy = ref('date')
const orderDirection = ref('asc')
const count = ref(0 as Number)
const loading = ref(false)
const userStore = useUserStore()
const showDeleteModal = ref(false)
const showGenerateModal = ref(false)
const errorMessage = ref('')

async function fetchGames(data?: any) {
  loading.value = true
  const res = await getGames({
    tournament_id: tournamentId,
    order_by: orderBy.value,
    order_direction: orderDirection.value,
    ...(data ? data : {limit: 10, page: 1})
  })
  games.value = res.rows
  count.value = res.count as Number
  loading.value = false
}

// Watch for route param changes
watch(() => route.params.tournamentId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    games.value = []
    previousGames.value = []
    count.value = 0
    fetchGames()
  }
}, { immediate: false })

function sort(data: any) {
  if (orderBy.value === data.column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = data.column
    orderDirection.value = 'asc'
  }
  fetchGames(data.data)
}

async function generateGames() {
  if (loading.value) return
  loading.value = true
  previousGames.value = JSON.parse(JSON.stringify(games.value))
  games.value = [];
  errorMessage.value = ''
  const res = await generateAllGames(+tournamentId, userStore.seasonSportId)

  // Check if response has validation error
  if (res && typeof res === 'object' && 'error' in res && res.error) {
    errorMessage.value = res.message || 'An error occurred while generating games'
    games.value = JSON.parse(JSON.stringify(previousGames.value))
    showGenerateModal.value = true // Keep modal open to show error
  } else if (res && Array.isArray(res) && res.length) {
    // Success - games were generated
    showGenerateModal.value = false
    errorMessage.value = ''
    await fetchGames()
  } else if (res && Array.isArray(res) && res.length === 0) {
    // No games generated but no error
    showGenerateModal.value = false
    errorMessage.value = ''
    await fetchGames()
  } else {
    // Unknown response format
    errorMessage.value = 'Unexpected response from server'
    games.value = JSON.parse(JSON.stringify(previousGames.value))
  }
  loading.value = false
}

async function deleteGames() {
  if (loading.value) return
  loading.value = true
  await deleteAllGames(+tournamentId)

  showDeleteModal.value = false
  games.value = []
  loading.value = false
}

</script>