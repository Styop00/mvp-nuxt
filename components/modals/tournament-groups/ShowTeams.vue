<template>
  <BaseModalComponent v-model:visible="modal" :width="3" name="_group_teams">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <div class="flex items-center justify-between my-5">
        <p class="font-bold text-lg tracking-widest">
          Teams
        </p>
        <BaseButton @on-click="() => showAddTeamForm=true"
                    v-if="!tournamentGroup.max_teams || teams.length < +tournamentGroup.max_teams"
                    class="!py-1 !px-1 !text-sm sm:text-base sm:!px-4 block">
          Add Team
        </BaseButton>
      </div>
      <template v-if="showAddTeamForm">
        <form @submit.prevent="addTeam" class="border rounded-2xl p-3 mb-4">
          <Select :options="teamOptions" v-model:value="selectedTeam" label="Select Team" ref="teamsSelect"/>
          <template v-if="selectedTeam.value === 0">
            <div class="grid grid-cols-6 gap-3 mt-3">
              <TextInput label="Club License"
                         v-model:value="clubLicense"
                         class="col-span-3"
                         @focus-out="fetchClubByLicense"
                         type="number"
                         :required="true"
              />
            </div>
            <span class="text-sm text-red-600">
              {{ clubLicenseError }}
            </span>
            <p class="mt-3 font-inter-medium text-sm">
              Tournament name
            </p>
            <div class="grid grid-cols-6 gap-3">
              <TextInput v-model:value="name1" class="col-span-3" :required="true"/>
              <TextInput v-model:value="name2"/>
              <TextInput v-model:value="name3" class="col-span-2"/>
            </div>
          </template>
          <template v-if="selectedTeam.value === 1">
            <div class="grid grid-cols-6 gap-3 mt-3">
              <div class="col-span-6">
                <SearchableSelect
                  :model-value="selectedTeamByName"
                  :options="teamSearchOptions"
                  :is-loading="isLoadingTeamSearch"
                  label="Team Name"
                  placeholder="Search by team local name or tournament name..."
                  :required="true"
                  :min-search-length="2"
                  @update:model-value="handleTeamSelectByName"
                  @search="searchTeamsByName"
                />
              </div>
            </div>
            <span class="text-sm text-red-600">
              {{ teamNameError }}
            </span>
            <template v-if="searchedTeam?.id">
              <div class="mt-3">
                <p>
                  Team
                </p>
                <p class="text-md font-bold">
                  {{ searchedTeam.tournament_name || searchedTeam.local_name }}
                </p>
              </div>
            </template>
          </template>
          <div class="flex items-center justify-center gap-6 mt-3">
            <BaseButton class="!py-1 !px-1 !text-sm border sm:text-base sm:!px-4 block">
              Add
            </BaseButton>
            <BaseButton @on-click="closeForm"
                        type="button"
                        class="!py-1 !px-1 !text-sm bg-dark-surface-default !text-red-600 border -600 hover:!text-white !border-red-600 sm:text-base sm:!px-4 block">
              close
            </BaseButton>
          </div>
        </form>
      </template>
      <template v-for="team in teams">
        <div class="flex gap-6 items-center justify-between mb-2">
        <span>
          {{ team.tournament_name }}
        </span>
          <span class="relative group text-nowrap">
                <font-awesome
                    @click="() => deleteGroup(team.id)"
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
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import type Team from "~/interfaces/teams/team";
import TextInput from "~/components/inputs/TextInput.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import Select from "~/components/inputs/Select.vue";
import SearchableSelect from "~/components/inputs/SearchableSelect.vue";
import type { SearchableSelectOption } from "~/components/inputs/SearchableSelect.vue";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import type Clubs from "~/interfaces/clubs/club";
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
import { debounce } from "~/utils/debounce";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  tournamentGroupId: {
    type: Number,
    required: true
  }
})

const {fetchTournamentGroupWithTeams, fetchPossibleTeams} = useTournamentGroupFetch()
const {attachGroupsToTeam, createTeam, fetchTeamById, fetchTeams} = useTeamsFetch()
const {fetchClubByCondition} = useClubsFetch()

const modal = ref(false)
const teams = ref([] as Array<Team>)
const teamOptions = ref([] as Array<SelectOptions>)
const possibleTeams = ref([] as Array<Team>)
const tournamentGroup = ref({} as TournamentGroup)
const teamLicense = ref('')
const teamLicenseError = ref('')
const clubLicense = ref('')
const clubLicenseError = ref('')
const searchedTeam = ref({} as Team)
const searchedClub = ref({} as Clubs)
const selectedTeamByName = ref<SearchableSelectOption | null>(null)
const teamSearchOptions = ref<SearchableSelectOption[]>([])
const isLoadingTeamSearch = ref(false)
const teamNameError = ref('')
const selectedTeam = ref({
  label: '--new team--',
  value: 0,
  disabled: false
} as SelectOptions)
const showAddTeamForm = ref(false)
const name1 = ref('')
const name2 = ref('')
const name3 = ref('')
const teamsSelect = ref<InstanceType<typeof Select> | null>(null)

const emit = defineEmits([
  'update:visible',
])

watch(() => props.visible, async () => {
  if (props.tournamentGroupId) {
    await fetchTeamsForGroup()
    await fetchPossibleTeamsForGroup()
  }
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    closeForm()
    emit('update:visible', false)
  }
})

watch(() => searchedClub.value, () => {
  if (searchedClub.value.id) {
    name1.value = searchedClub.value.name
  }
}, {
  deep: true,
  immediate: true
})

const teamTournamentName = computed(() => {
  return ((name1.value + ' ' + name2.value).trim() + ' ' + name3.value).trim()
})

// Search teams by name
async function searchTeamsByName(searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) {
    teamSearchOptions.value = [];
    return;
  }

  isLoadingTeamSearch.value = true;
  teamNameError.value = '';

  try {
    const res = await fetchTeams(
      null, // clubId
      null, // orderBy
      null, // orderDirection
      1,    // page
      20,   // limit
      searchTerm.trim() // searchQuery
    ) as { count: Number, rows: Array<Team> };

    if (res.count && res.count > 0) {
      teamSearchOptions.value = res.rows.map((team: Team) => ({
        label: `${team.local_name || team.tournament_name || 'Unknown'}${team.tournament_name && team.local_name ? ` (${team.tournament_name})` : ''}`,
        value: team,
        disabled: false
      }));
    } else {
      teamSearchOptions.value = [];
    }
  } catch (error) {
    teamNameError.value = 'Error searching for teams.';
    teamSearchOptions.value = [];
  } finally {
    isLoadingTeamSearch.value = false;
  }
}

// Debounced search function
const debouncedSearchTeamsByName = debounce((searchTerm: string) => {
  searchTeamsByName(searchTerm);
}, 300);

// Wrapper to use debounced search
function handleSearchTeamsByName(searchTerm: string) {
  debouncedSearchTeamsByName(searchTerm);
}

// Handle team selection from searchable select
function handleTeamSelectByName(option: SearchableSelectOption) {
  if (!option || !option.value) {
    selectedTeamByName.value = null;
    searchedTeam.value = {} as Team;
    teamNameError.value = '';
    return;
  }

  selectedTeamByName.value = option;
  searchedTeam.value = option.value as Team;
  teamNameError.value = '';
}

async function fetchClubByLicense() {
  clubLicenseError.value = ''
  if (!clubLicense.value) {
    searchedClub.value = {} as Clubs
  } else if (+clubLicense.value < 60000000 || +clubLicense.value > 70000000) {
    clubLicenseError.value = 'Invalid license!'
  } else {
    const res = await fetchClubByCondition(
        {
          license: clubLicense.value
        }
    ) as { count: Number, rows: Array<Clubs> }

    if (res.count) {
      searchedClub.value = res.rows[0] as Clubs
    } else {
      clubLicenseError.value = 'Invalid license!'
      searchedClub.value = {} as Clubs
    }
  }
}

async function deleteGroup(id: number) {
  const team = await fetchTeamById(id)
  const response = await attachGroupsToTeam(
      id,
      [
        ...team.tournament_groups
            .map(group => group.id)
            .filter(groupId => groupId !== tournamentGroup.value.id),
      ]
  )

  if (response) {
    closeForm()
    await fetchTeamsForGroup()
    await fetchPossibleTeamsForGroup()
  }
}

async function fetchTeamsForGroup() {
  const response = await fetchTournamentGroupWithTeams(props.tournamentGroupId)

  tournamentGroup.value = response as TournamentGroup
  if (!response?.teams) {
    modal.value = false
    closeForm()
  }

  teams.value = response?.teams as Array<Team>
}

async function fetchPossibleTeamsForGroup() {
  const res = await fetchPossibleTeams(props.tournamentGroupId)
  possibleTeams.value = res
  teamOptions.value = res.map(team => {
    return {
      label: team.tournament_name,
      value: team.id,
      disabled: false
    } as SelectOptions
  })

  teamOptions.value.unshift({
    label: '--add by team name--',
    value: 1,
    disabled: false
  } as SelectOptions)

  teamOptions.value.unshift({
    label: '--new team--',
    value: 0,
    disabled: false
  } as SelectOptions)
}

function closeSelects() {
  if (teamsSelect.value) {
    teamsSelect.value.closeDropdown()
  }
}

function closeForm() {
  name1.value = ''
  name2.value = ''
  name3.value = ''
  clubLicense.value = ''
  clubLicenseError.value = ''
  teamLicense.value = ''
  teamLicenseError.value = ''
  selectedTeamByName.value = null
  teamSearchOptions.value = []
  searchedTeam.value = {} as Team
  teamNameError.value = ''
  selectedTeam.value = {
    label: '--new team--',
    value: 0,
    disabled: false
  }
  showAddTeamForm.value = false
}

async function addTeam() {
  if (+(selectedTeam.value.value ? selectedTeam.value.value : 0) > 1) {
    const team = possibleTeams.value.find(team => team.id === selectedTeam.value.value) as Team
    const response = await attachGroupsToTeam(
        +(selectedTeam.value.value ? selectedTeam.value.value : 0),
        [
          ...(team.team_tournament_groups ?? []).map(group => group.tournamentGroupId),
          tournamentGroup.value.id
        ]
    )

    if (response) {
      closeForm()
      await fetchTeamsForGroup()
      await fetchPossibleTeamsForGroup()
    }
  } else if (+(selectedTeam.value.value ?? 0) === 1) {

    if (searchedTeam.value.id) {
      const response = await attachGroupsToTeam(
          searchedTeam.value.id,
          [
            tournamentGroup.value.id,
          ]
      )

      if (response) {
        closeForm()
        await fetchTeamsForGroup()
        await fetchPossibleTeamsForGroup()
      }
    }
  } else {
    if (clubLicenseError.value) {
      return
    }
    const res = await createTeam({
      clubId: searchedClub.value.id,
      localName: teamTournamentName.value,
      tournamentName: teamTournamentName.value,
      gender: tournamentGroup.value.gender,
      ageGroup: tournamentGroup.value.age_group,
      seasonSportId: tournamentGroup.value.league?.season_sport_id,
    })
    const response = await attachGroupsToTeam(
        +res.id,
        [
          tournamentGroup.value.id,
        ]
    )

    if (response) {
      closeForm()
      await fetchTeamsForGroup()
      await fetchPossibleTeamsForGroup()
    }
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_group_teams')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
})
</script>