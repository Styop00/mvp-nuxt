<template>
  <div class="p-4">
    <!-- Header with Add Team Button -->
    <div class="flex items-center justify-end mb-6">
      <BaseButton 
          @on-click="() => showAddTeamForm=true"
          class="!py-2 !px-4 !text-sm sm:text-base"
      >
        <font-awesome :icon="['fas', 'plus']" class="mr-2" />
        Add Team
      </BaseButton>
    </div>

    <!-- Add Team Form -->
    <template v-if="showAddTeamForm">
      <div class="bg-surface-elevated border border-border-default rounded-xl p-4 mb-6 shadow-sm">
        <form @click.prevent>
          <Select 
              :options="teamOptions" 
              v-model:value="selectedTeam" 
              label="Select Team" 
              ref="teamsSelect"
          />
          <div class="flex items-center justify-end gap-3 mt-4">
            <BaseButton 
                @on-click="closeForm"
                class="!py-2 !px-4 !text-sm bg-surface-default hover:bg-bg-hover text-text-secondary border border-border-default"
            >
              Cancel
            </BaseButton>
            <BaseButton 
                @on-click="addTeam"
                class="!py-2 !px-4 !text-sm"
            >
              Add Team
            </BaseButton>
          </div>
        </form>
      </div>
    </template>

    <!-- Teams Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-text-primary">
          Teams
          <span class="text-sm font-normal text-text-tertiary ml-2">
            ({{ teams.length }})
          </span>
        </h3>
      </div>

      <!-- Teams Grid with Scrollable Container -->
      <div 
          v-if="teams.length > 0"
          class="bg-surface-default border border-border-default rounded-lg p-4 max-h-[500px] overflow-y-auto"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
              v-for="team in teams"
              :key="team.id"
              class="group relative bg-surface-elevated border border-border-default rounded-lg p-4 hover:border-brand-primary hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary truncate" :title="team.tournament_name">
                  {{ team.tournament_name }}
                </p>
                <p v-if="team.club?.name" class="text-xs text-text-tertiary mt-1 truncate">
                  {{ team.club.name }}
                </p>
              </div>
              <button
                  @click="() => deleteTeamFromTournament(team.id)"
                  class="ml-3 flex-shrink-0 p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete team"
              >
                <font-awesome :icon="['fas', 'trash-can']" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
          v-else
          class="bg-surface-elevated border border-border-default rounded-lg p-8 text-center"
      >
        <font-awesome :icon="['fas', 'users']" class="text-4xl text-text-tertiary mb-3" />
        <p class="text-text-secondary">No teams added yet</p>
        <p class="text-sm text-text-tertiary mt-1">Click "Add Team" to get started</p>
      </div>
    </div>

    <!-- Generate Structure Button -->
    <div 
        v-if="structureValue"
        class="flex items-center justify-center pt-6 border-t border-border-default"
    >
      <BaseButton 
          @on-click="generateStructure"
          :disabled="!canGenerateStructure || generatingStructure"
          class="!py-3 !px-6 !text-base font-semibold min-w-[200px]"
          :class="(!canGenerateStructure || generatingStructure) ? 'opacity-50 cursor-not-allowed' : ''"
      >
        <font-awesome 
            v-if="generatingStructure"
            :icon="['fas', 'spinner']" 
            class="mr-2 animate-spin" 
        />
        <font-awesome 
            v-else
            :icon="['fas', 'diagram-project']" 
            class="mr-2" 
        />
        {{ generatingStructure ? 'Generating...' : 'Generate Structure' }}
      </BaseButton>
      <div 
          v-if="!canGenerateStructure && structureValue"
          class="ml-4 text-sm text-text-tertiary"
      >
        <p class="text-red-400">
          {{ validationMessage }}
        </p>
      </div>
    </div>

    <!-- Tournament Structure Views -->
    <LeagueTable 
        v-if="structureValue === 'regular_league'" 
        :teams="teams" 
        :matches="props.tournament.tournament_matches || []"
    />
    <PlayoffBracket 
        v-if="structureValue === 'playoffs'" 
        :teams="teams" 
        :matches="props.tournament.tournament_matches || []"
        :tournament="tournament"
    />
    <GroupStageAndPlayoffs 
        v-if="structureValue === 'group_stage_and_playoffs'" 
        :teams="teams" 
        :groups="props.tournament.tournament_groups || []"
        :matches="props.tournament.tournament_matches || []"
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
import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {camelToSnake} from "~/utils/camelToSnake";

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

const teams = ref(props.tournament?.teams as Array<Team>)
const tournament = ref(props.tournament as Tournament)
const teamOptions = ref([] as Array<SelectOptions>)
const possibleTeams = ref([] as Array<Team>)
const selectedTeam = ref({} as SelectOptions)
const showAddTeamForm = ref(false)
const teamsSelect = ref<InstanceType<typeof Select> | null>(null)
const generatingStructure = ref(false)

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

// Validation for generate structure button
const canGenerateStructure = computed(() => {
  if (!structureValue.value || teams.value.length === 0) {
    return false
  }

  const teamCount = teams.value.length

  switch (structureValue.value) {
    case 'playoffs':
      // Playoffs need a power of 2 (2, 4, 8, 16, 32, 64, etc.)
      return teamCount >= 2 && (teamCount & (teamCount - 1)) === 0
    
    case 'regular_league':
      // Regular league needs at least 2 teams
      return teamCount >= 2
    
    case 'group_stage_and_playoffs':
      // Group stage and playoffs typically need at least 4 teams
      // and should be divisible by the number of groups
      return teamCount >= 4
    
    default:
      return teamCount >= 2
  }
})

const validationMessage = computed(() => {
  if (!structureValue.value) {
    return 'No tournament structure selected'
  }

  const teamCount = teams.value.length

  if (teamCount === 0) {
    return 'No teams added'
  }

  switch (structureValue.value) {
    case 'playoffs':
      if (teamCount < 2) {
        return 'Playoffs require at least 2 teams'
      }
      if ((teamCount & (teamCount - 1)) !== 0) {
        // Find the next power of 2
        const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(teamCount)))
        return `Playoffs require a power of 2 teams (2, 4, 8, 16, etc.). Currently: ${teamCount}, need: ${nextPowerOf2}`
      }
      return ''
    
    case 'regular_league':
      if (teamCount < 2) {
        return 'Regular league requires at least 2 teams'
      }
      return ''
    
    case 'group_stage_and_playoffs':
      if (teamCount < 4) {
        return 'Group stage and playoffs require at least 4 teams'
      }
      return ''
    
    default:
      if (teamCount < 2) {
        return 'At least 2 teams are required'
      }
      return ''
  }
})

watch(() => props.tournament, async () => {
  if (props.tournamentId) {
    tournament.value = props.tournament
    teams.value = (props.tournament?.teams || []) as Array<Team>
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
    }
  }
}

async function fetchTeamsForTournament() {
  const response = await fetchTournamentById(props.tournamentId)

  if (response) {
    teams.value = (response.teams || []) as Array<Team>
    tournament.value = response as Tournament
    emit('update:tournament', response)
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

function closeSelects() {
  if (teamsSelect.value) {
    teamsSelect.value.closeDropdown()
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
      +teamId,
      props.tournamentId,
  )

  if (response) {
    closeForm()
    await fetchTeamsForTournament()
  }
}

async function generateStructure() {
  if (!props.tournamentId || !structureValue.value || generatingStructure.value) {
    return
  }

  // Get settings from tournament config
  const settings = props.tournament.tournament_config?.settings
  
  if (!settings) {
    console.error('Tournament structure settings not found')
    return
  }

  generatingStructure.value = true

  try {
    const response = await useApiV5Fetch(`tournaments/${props.tournamentId}/generate-structure`, {
      method: 'POST',
      body: camelToSnake({
        settings: settings
      }),
    })

    if (response.status.value === 'success') {
      // Refresh tournament data to show generated structure
      await fetchTeamsForTournament()
    } else {
      console.error('Failed to generate structure:', response.error.value)
    }
  } catch (error) {
    console.error('Error generating structure:', error)
  } finally {
    generatingStructure.value = false
  }
}

onMounted(() => {
  document.body.addEventListener('click', closeSelects)
})

</script>

<style scoped>
/* Custom scrollbar styling for teams container */
.max-h-\[500px\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[500px\]::-webkit-scrollbar-track {
  background: var(--color-bg-tertiary);
  border-radius: 4px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb {
  background: var(--color-border-light);
  border-radius: 4px;
  transition: background 0.2s;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-default);
}

/* Firefox scrollbar */
.max-h-\[500px\] {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-light) var(--color-bg-tertiary);
}
</style>

