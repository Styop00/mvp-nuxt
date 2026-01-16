<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Create Tournament</p>
      
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
        <form action="#" @submit.prevent="createTournament">
          <EditTournamentForm
              :tournament="tournamentBaseData as Tournament"
              :pools="[]"
              :rounds="[]"
              ref="editTournamentRef"
              :errors="errors"
              @calculate-rounds="calculateRounds"
              @delete-rounds="deleteRounds"
          />
          <BaseButton
              class="!py-2 block mt-3 mx-auto"
              :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
          >
            Create
          </BaseButton>
        </form>
      </div>

      <!-- Teams Tab -->
      <div v-if="activeTab === 'teams'">
        <div v-if="!tournamentBaseData.id" class="p-8 text-center text-gray-500">
          <p>Please create the tournament first to manage teams.</p>
          <p class="text-sm mt-2">Teams can be added after the tournament is created.</p>
        </div>
        <TournamentTeamsTab
            v-else
            :tournament-id="tournamentBaseData.id"
            :tournament="tournamentBaseData as Tournament"
            @update:tournament="(updatedTournament) => tournamentBaseData = updatedTournament"
        />
      </div>
    </div>
    <SuccessAlert
        v-model:visible="showSuccessAlert"
        text="The new Tournament has been successfully created."
    />
  </div>
</template>

<script setup lang="ts">
import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Tournament from "~/interfaces/tournament/tournament";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentForm from "~/components/tournament/EditTournamentForm.vue";
import TournamentTeamsTab from "~/components/tournament/TournamentTeamsTab.vue";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {camelToSnake} from "~/utils/camelToSnake";
import {useRoundsFetch} from "~/composables/useRoundsFetch/useRoundsFetch";

const route = useRoute()
const leagueId = route.params.leagueId
const editTournamentRef = ref<InstanceType<typeof EditTournamentForm> | null>(null)
const loading = ref(false)
const showSuccessAlert = ref(false)
const tournamentBaseData = ref({
  age_group: null,
  gender: null,
  moving_strategy_id: null,
  set_game_strategy_id: 0,
  tournament_registration_type_id: null,
  tournament_structure_id: null,
  id: 0,
  name: '',
  short_name: '',
  is_active: true,
  team_count: 0,
  region_id: null,
  information: '',
  start_date: '',
  end_date: '',
  free_reschedule_until_date: null,
  registration_dead_line: null,
  minimum_warmup_minutes: 0,
  expected_duration_minutes: 90,
  earliest_start: null,
  latest_start: null,
  pool_count: 0,
  standing_group_count: 0,
  cross_pool_game_count: 0,
  cross_standing_group_game_count: 0,
  round_type: 0,
  tournament_program_id: 0,
  deleted: false,
} as Tournament);
const errors = ref({})
const {createRounds, deleteGeneratedRounds} = useRoundsFetch()
const activeTab = ref('settings')

onMounted(() => {
  document.body.addEventListener('click', closeCalendars)
})

function closeCalendars() {
  editTournamentRef.value?.closeCalendars()
}

async function calculateRounds() {
  // Rounds can only be calculated after tournament is created
  // This will be handled after tournament creation
  if (!tournamentBaseData.value.id) {
    return
  }

  if (!tournamentBaseData.value.start_date || !tournamentBaseData.value.end_date) {
    return
  }

  loading.value = true

  try {
    const roundsData = {
      tournament_id: tournamentBaseData.value.id,
      start_date: tournamentBaseData.value.start_date,
      end_date: tournamentBaseData.value.end_date
    }

    const createdRounds = await createRounds(camelToSnake(roundsData))
    
    if (createdRounds && createdRounds.length > 0) {
      tournamentBaseData.value.rounds = createdRounds as any
    }
  } catch (error) {
    console.error('Error calculating rounds:', error)
  } finally {
    loading.value = false
  }
}

async function deleteRounds() {
  if (!tournamentBaseData.value.id) {
    return
  }

  loading.value = true

  try {
    const deleted = await deleteGeneratedRounds(tournamentBaseData.value.id)
    if (deleted) {
      tournamentBaseData.value.rounds = []
    }
  } catch (error) {
    console.error('Error deleting rounds:', error)
  } finally {
    loading.value = false
  }
}

async function createTournament() {
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

  let response = await useApiV5Fetch(`tournaments`, {
    method: 'POST',
    body: camelToSnake(requestData),
  })

  if (response.status.value === 'success') {
    tournamentBaseData.value.id = response.data.value.id
    tournamentBaseData.value = {...tournamentBaseData.value, ...response.data.value}
    showSuccessAlert.value = true
    // Switch to teams tab after creation
    activeTab.value = 'teams'
    setTimeout(() => {
      navigateTo(`/leagues/${leagueId}/tournaments/${response.data.value.id}`)
    }, 3000)
  } else {
    loading.value = false
  }
}
</script>
