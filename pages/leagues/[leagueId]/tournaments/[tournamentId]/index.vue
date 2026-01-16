<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Update Tournament</p>
      
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
              @click="activeTab = 'settings'"
              :class="[
                activeTab === 'settings'
                  ? 'border-brand-primary-color text-brand-primary-color'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
          >
            Settings
          </button>
          <button
              @click="activeTab = 'teams'"
              :class="[
                activeTab === 'teams'
                  ? 'border-brand-primary-color text-brand-primary-color'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
          >
            Teams
          </button>
        </nav>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <form action="#" @submit.prevent="updateTournamentData">
          <EditTournamentForm
              :tournament="tournament"
              :pools="tournament.pools || []"
              :rounds="tournament.rounds || []"
              ref="editTournamentRef"
              :errors="errors"
              @calculate-rounds="calculateRounds"
              @delete-rounds="deleteRounds"
          />
          <BaseButton
              class="!py-2 block mt-3 mx-auto"
              :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
          >
            Update
          </BaseButton>
        </form>
      </div>

      <!-- Teams Tab -->
      <div v-if="activeTab === 'teams'">
        <TournamentTeamsTab
            v-if="tournament.id"
            :tournament-id="tournament.id"
            :tournament="tournament"
            @update:tournament="(updatedTournament) => tournament = updatedTournament"
        />
      </div>
    </div>
    <SuccessAlert
        v-model:visible="showSuccessAlert"
        text="The Tournament's information has been successfully updated."
    />
  </div>
</template>

<script setup lang="ts">
import type Tournament from "~/interfaces/tournament/tournament";
import moment from "moment";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentForm from "~/components/tournament/EditTournamentForm.vue";
import TournamentTeamsTab from "~/components/tournament/TournamentTeamsTab.vue";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import {useRoundsFetch} from "~/composables/useRoundsFetch/useRoundsFetch";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {camelToSnake} from "~/utils/camelToSnake";

const route = useRoute()
const leagueId = route.params.leagueId
const id = route.params.tournamentId
const tournament = ref({} as Tournament)
const editTournamentRef = ref<InstanceType<typeof EditTournamentForm> | null>(null)
const loading = ref(true)
const showSuccessAlert = ref(false)
const errors = ref({})
const activeTab = ref('settings')

const {fetchTournamentById, updateTournament} = useTournamentFetch()
const {createRounds, deleteGeneratedRounds} = useRoundsFetch()

// Watch for route param changes
watch(() => route.params.tournamentId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loading.value = true
    tournament.value = {} as Tournament
    fetchTournament()
  }
}, { immediate: false })

onMounted(async () => {
  document.body.addEventListener('click', closeCalendars)
  await fetchTournament()
})

function closeCalendars() {
  editTournamentRef.value?.closeCalendars()
}

async function fetchTournament() {
  const response = await fetchTournamentById(+id)
  if (response) {
    tournament.value = response as Tournament
    tournament.value.start_date = moment(tournament.value.start_date as string).format('YYYY-MM-DD')
    tournament.value.end_date = moment(tournament.value.end_date as string).format('YYYY-MM-DD')
    if (tournament.value.registration_dead_line) {
      tournament.value.registration_dead_line = moment(tournament.value.registration_dead_line as string).format('YYYY-MM-DD')
    }
    if (tournament.value.free_reschedule_until_date) {
      tournament.value.free_reschedule_until_date = moment(tournament.value.free_reschedule_until_date as string).format('YYYY-MM-DD')
    }
  }
  loading.value = false
}

async function calculateRounds() {
  if (!tournament.value.start_date || !tournament.value.end_date) {
    return
  }

  loading.value = true

  try {
    const roundsData = {
      tournament_id: tournament.value.id || null,
      start_date: tournament.value.start_date,
      end_date: tournament.value.end_date
    }

    const createdRounds = await createRounds(camelToSnake(roundsData))
    
    if (createdRounds && createdRounds.length > 0) {
      // Refresh tournament data to get updated rounds
      await fetchTournament()
      showSuccessAlert.value = true
    }
  } catch (error) {
    console.error('Error calculating rounds:', error)
  } finally {
    loading.value = false
  }
}

async function deleteRounds() {
  if (!tournament.value.id) {
    return
  }

  loading.value = true

  try {
    const deleted = await deleteGeneratedRounds(tournament.value.id)
    if (deleted) {
      // Refresh tournament data to get updated rounds
      await fetchTournament()
      showSuccessAlert.value = true
    }
  } catch (error) {
    console.error('Error deleting rounds:', error)
  } finally {
    loading.value = false
  }
}

async function updateTournamentData() {
  if (loading.value) return;

  if (editTournamentRef.value?.startTimeError || editTournamentRef.value?.endTimeError) {
    return
  }
  errors.value = {}

  let requestData = {
    ...editTournamentRef.value?.editData,
    league_id: +leagueId
  }

  loading.value = true

  const res = await updateTournament(+id, requestData)

  if (res) {
    showSuccessAlert.value = true
    // Refresh tournament data to update structure view in Teams tab
    await fetchTournament()
  }
  
  loading.value = false
}
</script>
