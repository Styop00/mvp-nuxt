<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="bg-white rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">
        Update Tournament
      </p>
      <form action="#" @submit.prevent="updateTournamentData" ref="tournamentFormRef">
        <TournamentForm
            v-model:pools="pools"
            v-model:tournament="tournament"
            v-model:rounds="rounds"
            @delete-rounds="deleteCalculatedRounds"
            @calculate-rounds="calculateRounds"
        />
        <template v-if="Object.keys(errors ?? {}).length">
          <p class="text-center text-md tracking-wider text-red-600">
            Please fix errors and try again.
          </p>
        </template>
        <BaseButton class="!py-2 block mt-3 mx-auto"  :class="loading ? 'opacity-40 cursor-not-allowed' : ''">
          Update
        </BaseButton>
      </form>

    </div>
    <SuccessAlert v-model:visible="showSuccessAlert"
                  text="The Tournament information has been successfully updated."/>
  </div>
  <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import {useRouter} from "vue-router";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import type Tournament from "~/interfaces/tournament/tournament";
import type Pools from "~/interfaces/pools/pools";
import {useRoundsFetch} from "~/composables/useRoundsFetch/useRoundsFetch";
import TournamentForm from "~/components/tournament/TournamentForm.vue";
import {usePoolsFetch} from "~/composables/usePoolsFetch/usePoolsFetch";
import type Rounds from "~/interfaces/rounds/rounds";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";

const router = useRouter()
const route = useRoute()
const tournamentId = route.params.tournamentId
const loading = ref(false)
const errors = ref({})
const showSuccessAlert = ref(false)
const tournament = ref({} as Tournament)
const tournamentFormRef = ref(null)
const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
const dataFetched = ref(false)
let routeNext: any = null;

const pools = ref([] as Array<Pools>)
const rounds = ref([] as Array<Rounds>)

const {fetchTournamentById, updateTournament} = useTournamentFetch()
const {recreate, deleteGeneratedRounds, createRounds} = useRoundsFetch()
const {createOrUpdatePools} = usePoolsFetch()

if (tournamentId) {
  fetchTournament()
}

watch([tournament, pools, rounds], () => {
  if (dataFetched.value) {
    hasUnsavedChanges.value = true;
  }
}, {
  deep: true,
})

async function fetchTournament() {
  if (loading.value) {
    return
  }

  loading.value = true
  const res = await fetchTournamentById(+tournamentId)
  if (!res) {
    router.back()
  }

  tournament.value = res as Tournament

  pools.value = [...tournament.value.pools]
  rounds.value = [...tournament.value.rounds]

  loading.value = false
  setTimeout(() => {
    dataFetched.value = true
  }, 1)
}

async function updateTournamentData(): Promise<void> {
  if(loading.value) return;

  loading.value = true
  const res = await updateTournament(+tournamentId, {...tournament.value})
  if (res) {
    if (JSON.stringify(rounds.value) !== JSON.stringify(tournament.value.rounds)) {
      await recreateRounds()
    }
    if (pools.value.length) {
      pools.value = pools.value.map(pool => {
        pool.tournament_id = tournament.value.id
        return pool;
      })
      await createOrUpdatePools(+tournamentId, pools.value)
    }
    showSuccessAlert.value = true
    hasUnsavedChanges.value = false
  }
  loading.value = false
}

async function recreateRounds() {
  rounds.value = await recreate(rounds.value)
}

async function deleteCalculatedRounds() {
  const res = await deleteGeneratedRounds(+tournamentId)

  if (res) {
    rounds.value = []
  }
}

async function calculateRounds() {
  rounds.value = await createRounds({
    tournamentId: tournament.value.id,
    start_date: tournament.value.start_date,
    end_date: tournament.value.end_date
  })
}

function confirmLeavePage() {
  showUnsavedChangesModal.value = false;
  if (routeNext) {
    routeNext();
  }
}

function cancelLeavePage() {
  showUnsavedChangesModal.value = false;
  routeNext = null;
}

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    routeNext = next;
  } else {
    next();
  }
});

</script>