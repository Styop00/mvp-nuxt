<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Update Tournament Group</p>
      <form action="#" @submit.prevent="updateTournamentGroupData">
        <EditTournamentGroupForm
            :tournament-group="tournamentGroup"
            ref="editTournamentGroupRef"
            :errors="errors"
        />
        <BaseButton
            class="!py-2 block mt-3 mx-auto"
            :class="loading ? 'opacity-40 cursor-not-allowed' : ''"
        >
          Update
        </BaseButton>
      </form>
    </div>
    <SuccessAlert
        v-model:visible="showSuccessAlert"
        text="The Tournament Group’s information has been successfully updated."
    />
  </div>
</template>

<script setup lang="ts">
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import moment from "moment";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentGroupForm from "~/components/tournament/EditTournamentGroupForm.vue";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";

const route = useRoute()
const leagueId = route.params.leagueId
const id = route.params.tournamentGroupId
const tournamentGroup = ref({} as TournamentGroup)
const editTournamentGroupRef = ref<InstanceType<typeof EditTournamentGroupForm> | null>(null)
const loading = ref(true)
const showSuccessAlert = ref(false)
const errors = ref({})

const {fetchTournamentGroupById, updateTournamentGroup} = useTournamentGroupFetch()

// Watch for route param changes
watch(() => route.params.tournamentGroupId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loading.value = true
    tournamentGroup.value = {} as TournamentGroup
    fetchTournamentGroup()
  }
}, { immediate: false })

onMounted(async () => {
  document.body.addEventListener('click', closeCalendars)
  await fetchTournamentGroup()
})

function closeCalendars() {
  editTournamentGroupRef.value?.closeCalendars()
}

async function fetchTournamentGroup() {
  const response = await fetchTournamentGroupById(+id)
  if (response) {
    tournamentGroup.value = response as TournamentGroup
    tournamentGroup.value.start_date = moment(tournamentGroup.value.start_date as string).format('YYYY-MM-DD')
    tournamentGroup.value.end_date = moment(tournamentGroup.value.end_date as string).format('YYYY-MM-DD')
    if (tournamentGroup.value.registration_dead_line) {
      tournamentGroup.value.registration_dead_line = moment(tournamentGroup.value.registration_dead_line as string).format('YYYY-MM-DD')
    }
    if (tournamentGroup.value.free_reschedule_until_date) {
      tournamentGroup.value.free_reschedule_until_date = moment(tournamentGroup.value.free_reschedule_until_date as string).format('YYYY-MM-DD')
    }
  }
  loading.value = false
}

async function updateTournamentGroupData() {
  if (loading.value) return;

  if (editTournamentGroupRef.value?.startTimeError || editTournamentGroupRef.value?.endTimeError) {
    return
  }
  errors.value = {}

  let requestData = {
    ...editTournamentGroupRef.value?.editData,
    league_id: +leagueId
  }

  if (requestData.max_teams && requestData.max_teams < (requestData?.min_teams || 0)) {
    errors.value.maxTeams = 'Max Teams count should be larger than Min Teams count.'
    return
  }

  loading.value = true

  const res = await updateTournamentGroup(+id, requestData)

  if (res) {
    showSuccessAlert.value = true
    loading.value = false
  } else {
    loading.value = false
  }
}
</script>
