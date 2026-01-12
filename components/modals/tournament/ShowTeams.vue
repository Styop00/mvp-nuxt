<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_tournament_teams">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <div class="flex items-center justify-end my-5">
        <BaseButton @on-click="() => showAddTeamForm=true"
                    class="!py-1 !px-1 !text-sm sm:text-base sm:!px-4 block">
          Add Team
        </BaseButton>
      </div>
      <template v-if="showAddTeamForm">
        <form @click.prevent class="border rounded-2xl p-3 mb-4">
          <Select :options="teamOptions" v-model:value="selectedTeam" label="Select Team" ref="teamsSelect"/>
          <Select :options="pools" v-model:value="pool" class="mt-4" label="Select Pool" ref="poolsSelect"/>
          <div class="flex items-center justify-center gap-6 mt-3">
            <BaseButton @on-click="addTeam"
                        class="!py-1 !px-1 !text-sm border sm:text-base sm:!px-4 block">
              Add
            </BaseButton>
            <BaseButton @on-click="closeForm"
                        class="!py-1 !px-1 !text-sm bg-dark-surface-default !text-red-600 border -600 hover:!text-white !border-red-600 sm:text-base sm:!px-4 block">
              close
            </BaseButton>
          </div>
        </form>
      </template>
      <div class="grid grid-cols-3">
        <span class="font-bold text-lg tracking-widest">
          Teams
        </span>
        <span class="font-bold text-lg tracking-widest text-center">
          Pools
        </span>
      </div>
      <template v-for="team in teams">
        <div class="grid grid-cols-3 gap-6 items-center justify-between mb-2 text-center">
          <span class="text-start">
            {{ team.tournament_name }}
          </span>
          <span>
            {{ pools.find((tournamentPool) => tournamentPool.value === team.pivot?.pool_id)?.label }}
          </span>
          <span class="relative group text-nowrap">
            <font-awesome
                @click="() => deleteTeamFromTournament(team.id)"
                :icon="['fas', 'trash-can']"
                class="p-1.5 text-xs rounded-full border border-red-100 bg-red-50 -500 hover:text-white transition text-red-400 cursor-pointer"
            />
            <span
                class="absolute bottom-full text-xxs mb-1 tracking-wider group-hover:!inline-block hidden !bg-dark-surface-default left-1/2 p-px shadow-sm px-3 -translate-x-1/2 border"
            >
              Delete
            </span>
          </span>
        </div>
      </template>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import type Team from "~/interfaces/teams/team";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import type Tournament from "~/interfaces/tournament/tournament";
import TextInput from "~/components/inputs/TextInput.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  tournamentId: {
    type: Number,
    required: true
  }
})

const {fetchTournamentById, fetchPossibleTeams} = useTournamentFetch()
const {removeTeamFromTournament, fetchTeamById, attachTournamentToTeam} = useTeamsFetch()

const modal = ref(false)
const teams = ref([] as Array<Team>)
const teamOptions = ref([] as Array<SelectOptions>)
const pools = ref([] as Array<SelectOptions>)
const pool = ref({} as SelectOptions)
const possibleTeams = ref([] as Array<Team>)
const tournament = ref({} as Tournament)
const selectedTeam = ref({} as SelectOptions)
const showAddTeamForm = ref(false)
const teamsSelect = ref<InstanceType<typeof Select> | null>(null)
const poolsSelect = ref<InstanceType<typeof Select> | null>(null)

const emit = defineEmits([
  'update:visible',
])

watch(() => props.visible, async () => {
  if (props.tournamentId) {
    await fetchTeamsForTournament()
    await fetchTeams()
  }
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

async function deleteTeamFromTournament(id: number) {
  const team = await fetchTeamById(id)
  const teamTournament = team?.tournaments?.find(tournament => tournament.id === props.tournamentId)?.pivot
  if (teamTournament) {
    const response = await removeTeamFromTournament(+teamTournament.id)
    if (response) {
      closeForm()
      await fetchTeamsForTournament()
      await fetchTeams()
    }
  }
}

async function fetchTeamsForTournament() {
  const response = await fetchTournamentById(props.tournamentId)

  tournament.value = response as Tournament
  pools.value = tournament.value.pools.map((pool) => {
    return {
      label: pool.name,
      value: pool.id,
      disabled: false
    } as SelectOptions
  })

  if (pools.value.length) {
    pool.value = pools.value[0]
  }

  if (!response?.teams) {
    modal.value = false
  }

  teams.value = response?.teams as Array<Team>
}

async function fetchTeams() {
  const res = await fetchPossibleTeams(props.tournamentId)
  possibleTeams.value = res
  teamOptions.value = res.map(team => {
    return {
      label: team.tournament_name,
      value: team.id,
      disabled: false
    } as SelectOptions
  })

  if (teamOptions.value.length) {
    selectedTeam.value = teamOptions.value[0]
  }

}

function closeSelects() {
  if (teamsSelect.value) {
    teamsSelect.value.closeDropdown()
  }
  if (poolsSelect.value) {
    poolsSelect.value.closeDropdown()
  }
}

function closeForm() {
  if (teamOptions.value.length) {
    selectedTeam.value = teamOptions.value[0]
  } else {
    selectedTeam.value = {} as SelectOptions
  }
  showAddTeamForm.value = false
}

async function addTeam() {
  const teamId = selectedTeam.value?.value
  
  if (!teamId) {
    console.error('No team selected')
    return
  }

  const response = await attachTournamentToTeam(
      teamId,
      props.tournamentId,
      {
        poolId: pool.value?.value,
      }
  )

  if (response) {
    closeForm()
    await fetchTeamsForTournament()
    await fetchTeams()
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_tournament_teams')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
})
</script>