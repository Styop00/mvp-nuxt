<template>
  <div class="p-4">
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
          {{ pools.find((tournamentPool) => tournamentPool.value === team.pivot?.pool_id)?.label || 'None' }}
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

    <!-- Tournament Structure Views -->
    <LeagueTable v-if="structureValue === 'regular_league'" :teams="teams" />
    <PlayoffBracket v-if="structureValue === 'playoffs'" :teams="teams" />
    <GroupStageAndPlayoffs 
        v-if="structureValue === 'group_stage_and_playoffs'" 
        :teams="teams" 
        :pools="props.tournament.pools || []"
    />
  </div>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import type Team from "~/interfaces/teams/team";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import type Tournament from "~/interfaces/tournament/tournament";
import LeagueTable from "~/components/tournament/LeagueTable.vue";
import PlayoffBracket from "~/components/tournament/PlayoffBracket.vue";
import GroupStageAndPlayoffs from "~/components/tournament/GroupStageAndPlayoffs.vue";
import {useTournamentStructureStore} from "~/store/tournamentStructure";

const props = defineProps({
  tournamentId: {
    type: Number,
    required: true
  },
  tournament: {
    type: Object as () => Tournament,
    required: true
  }
})

const emit = defineEmits(['update:tournament'])

const {fetchTournamentById, fetchPossibleTeams} = useTournamentFetch()
const {removeTeamFromTournament, fetchTeamById, attachTournamentToTeam} = useTeamsFetch()
const tournamentStructureStore = useTournamentStructureStore()

const teams = ref([] as Array<Team>)
const teamOptions = ref([] as Array<SelectOptions>)
const pools = ref([] as Array<SelectOptions>)
const pool = ref({} as SelectOptions)
const possibleTeams = ref([] as Array<Team>)
const selectedTeam = ref({} as SelectOptions)
const showAddTeamForm = ref(false)
const teamsSelect = ref<InstanceType<typeof Select> | null>(null)
const poolsSelect = ref<InstanceType<typeof Select> | null>(null)

const structureValue = computed(() => {
  if (!props.tournament.tournament_structure_id) return null
  
  // Fetch structures if not loaded
  if (tournamentStructureStore.structures.length === 0) {
    tournamentStructureStore.fetchTournamentStructures()
    return null
  }
  
  const structure = tournamentStructureStore.structures.find(
    s => s.id === props.tournament.tournament_structure_id
  )
  
  return structure?.value || null
})

watch(() => props.tournament, async () => {
  if (props.tournamentId) {
    await fetchTeamsForTournament()
    await fetchTeams()
  }
}, {
  deep: true,
  immediate: true
})

// Load tournament structures on mount
onMounted(() => {
  if (tournamentStructureStore.structures.length === 0) {
    tournamentStructureStore.fetchTournamentStructures()
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
      await refreshTournament()
    }
  }
}

async function fetchTeamsForTournament() {
  const response = await fetchTournamentById(props.tournamentId)

  if (response) {
    pools.value = (response.pools || []).map((pool) => {
      return {
        label: pool.name,
        value: pool.id,
        disabled: false
      } as SelectOptions
    })

    if (pools.value.length) {
      pool.value = pools.value[0]
    } else {
      // Add a "None" option if no pools exist
      pools.value = [{
        label: 'None',
        value: null,
        disabled: false
      } as SelectOptions]
      pool.value = pools.value[0]
    }

    teams.value = (response.teams || []) as Array<Team>
  }
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

async function refreshTournament() {
  const response = await fetchTournamentById(props.tournamentId)
  if (response) {
    emit('update:tournament', response)
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
    await refreshTournament()
  }
}

onMounted(() => {
  document.body.addEventListener('click', closeSelects)
})

</script>

