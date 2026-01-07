<template>
  <div class="py-2 lg:p-6">
   <Breadcrumb />
    <div class="bg-white rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">
        Create Tournament
      </p>
      <form action="#" @submit.prevent="create" ref="tournamentFormRef">
        <TournamentForm
            v-model:pools="pools"
            v-model:tournament="tournament"
            @calculate-rounds="calculateRounds"
            @delete-rounds="deleteRounds"
            v-model:rounds="rounds"/>
        <template v-if="Object.keys(errors ?? {}).length">
          <p class="text-center text-md tracking-wider text-red-600">
            Please fix errors and try again.
          </p>
        </template>
        <BaseButton class="!py-2 block mt-3 mx-auto"  :class="loading ? 'opacity-40 cursor-not-allowed' : ''">
          Create
        </BaseButton>
      </form>

    </div>
    <SuccessAlert v-model:visible="showSuccessAlert"
                  text="The Tournament successfully created."/>
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
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import type Tournament from "~/interfaces/tournament/tournament";
import type Pools from "~/interfaces/pools/pools";
import {useRoundsFetch} from "~/composables/useRoundsFetch/useRoundsFetch";
import TournamentForm from "~/components/tournament/TournamentForm.vue";
import type Rounds from "~/interfaces/rounds/rounds";
import {usePoolsFetch} from "~/composables/usePoolsFetch/usePoolsFetch";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";

const route = useRoute()
const loading = ref(false)
const errors = ref({})
const showSuccessAlert = ref(false)
const tournamentFormRef = ref(null)
const rounds = ref([] as Array<Rounds>)
const tournament = ref({
  id: 0,
  alias: '',
  shortName: '',
  poolCount: 0,
  crossPoolGameCount: 0,
  crossStandingGroupGameCount: 0,
  deleted: false,
  endDate: '',
  information: '',
  regionId: null,
  roundType: 0,
  standingGroupCount: 0,
  startDate: '',
  teamCount: 0,
  pools: [],
  rounds: [],
  region: 0,
  tournamentGroupId: +route.params.tournamentGroupId,
  tournamentProgramId: 0,
} as Tournament)
const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
let routeNext: any = null;

const pools = ref([] as Array<Pools>)

const {createTournament} = useTournamentFetch()
const {createRounds, attachRoundsToTournaments, deleteGeneratedRoundsByIds} = useRoundsFetch()
const {createPools} = usePoolsFetch()

watch(() => tournament.value, () => {
  hasUnsavedChanges.value = true;
}, {
  deep: true,
})

async function create(): Promise<void> {
  if (loading.value) return;

  loading.value = true;
  const {id, ...data} = tournament.value;
  const res = await createTournament(data)
  if (res) {
    tournament.value = {...res}
    if (!rounds.value.length) {
      await calculateRounds()
    } else {
      await attachRounds()
    }
    if (pools.value.length) {
      pools.value = pools.value.map(pool => {
        pool.tournamentId = res.id
        return pool;
      })
      await createPools(pools.value)
    }
    showSuccessAlert.value = true
    hasUnsavedChanges.value = false;
    setTimeout(() => {
      navigateTo(res.id + '')
    }, 3000)
  } else {
    loading.value = false;
  }
}

async function calculateRounds() {
  rounds.value = await createRounds({
    tournamentId: tournament.value.id,
    startDate: tournament.value.startDate,
    endDate: tournament.value.endDate
  })
}

async function attachRounds() {
  const data = rounds.value.map(round => {
    return {
      ...round,
      tournamentId: tournament.value.id
    }
  })
  await attachRoundsToTournaments(data)
}

async function deleteRounds() {
  const res = await deleteGeneratedRoundsByIds(rounds.value.map(round => round.id))

  if(res) {
    rounds.value = []
  }
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