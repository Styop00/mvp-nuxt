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
        :modal-body="'Are you sure you want to generate tournament matches?'+ (errorMessage ? `<br><span class='mt-4 inline-block text-red-700 text-xs'>${errorMessage}</span>` : '')"
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
    tournamentId: tournamentId,
    orderBy: orderBy.value,
    orderDirection: orderDirection.value,
    ...(data ? data : {limit: 10, page: 1})
  })
  games.value = res.rows
  count.value = res.count as Number
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

async function generateGames() {
  if (loading.value) return
  loading.value = true
  previousGames.value = JSON.parse(JSON.stringify(games.value))
  games.value = [];
  errorMessage.value = ''
  const res = await generateAllGames(+tournamentId, userStore.seasonSportId)

  if (res?.name === 'Error') {
    errorMessage.value = res?.message
    games.value = JSON.parse(JSON.stringify(previousGames.value))
  } else if (res.length) {
    showGenerateModal.value = false
    await fetchGames()
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