<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Create Tournament Group</p>
      <form action="#" @submit.prevent="createTournamentGroup">
        <EditTournamentGroupForm
            :tournament-group="groupBaseData as TournamentGroup"
            ref="editTournamentGroupRef"
            :errors="errors"
        />
        <BaseButton
            class="!py-2 block mt-3 mx-auto"
            :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Create
        </BaseButton>
      </form>
    </div>
    <SuccessAlert
        v-model:visible="showSuccessAlert"
        text="The new Tournament Group has been successfully created."
    />
  </div>
</template>

<script setup lang="ts">
import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentGroupForm from "~/components/tournament/EditTournamentGroupForm.vue";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import {camelToSnake} from "~/utils/camelToSnake";

const route = useRoute()
const leagueId = route.params.leagueId
const editTournamentGroupRef = ref<InstanceType<typeof EditTournamentGroupForm> | null>(null)
const loading = ref(false)
const showSuccessAlert = ref(false)
const groupBaseData = ref({
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
  min_teams: 0,
  max_teams: 0,
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
} as TournamentGroup);
const errors = ref({})

onMounted(() => {
  document.body.addEventListener('click', closeCalendars)
})

function closeCalendars() {
  editTournamentGroupRef.value?.closeCalendars()
}

async function createTournamentGroup() {
  if (loading.value) return;

  if (editTournamentGroupRef.value?.startTimeError || editTournamentGroupRef.value?.endTimeError) {
    return
  }
  errors.value = {}
  let requestData = {
    ...editTournamentGroupRef.value?.editData,
    league_id: +leagueId
  }

  if (requestData.max_teams && requestData.max_teams < requestData.min_teams) {
    errors.value.maxTeams = 'Max Teams count should be larger than Min Teams count.'
    return
  }

  loading.value = true

  let response = await useApiV5Fetch(`tournament-group`, {
    method: 'POST',
    body: camelToSnake(requestData),
  })

  if (response.status.value === 'success') {
    showSuccessAlert.value = true
    setTimeout(() => {
      navigateTo(`/leagues/${leagueId}/tournament-groups/${response.data.value.id}`)
    }, 3000)
  } else {
    loading.value = false
  }
}
</script>
