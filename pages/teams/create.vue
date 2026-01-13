<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Create Team</p>
      <form action="#" @submit.prevent="create">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
            v-model:value="team.local_name"
            label="Local Name"
            :required="true"
          />
          <TextInput
            v-model:value="team.club_rank"
            type="number"
            :min="0"
            label="Club ranking (1-xxx)"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Select
                :options="ageGroups"
                class="w-72"
                v-model:value="ageGroup"
                :required="true"
                label="Age Group"
              />
              <p v-if="ageGroupError" class="text-sm text-red-600">
                {{ ageGroupError }}
              </p>
            </div>
            <div>
              <Select
                :options="genders"
                class="w-72"
                :required="true"
                v-model:value="gender"
                label="Gender"
              />
              <p v-if="genderError" class="text-sm text-red-600">
                {{ genderError }}
              </p>
            </div>
          </div>
          <div>
            <Select
              :options="officialTypes"
              class="w-72"
              v-model:value="officialType"
              :required="true"
              label="Officials Table Set Type"
            />
            <p v-if="officialTypeError" class="text-sm text-red-600">
              {{ officialTypeError }}
            </p>
          </div>
          <div>
            <Select
              :options="officialTeams"
              class="w-72"
              v-model:value="officialTeam"
              :required="true"
              v-if="officialType?.value === 2"
              label="Official Team"
            />
            <p v-if="officialTeamError" class="text-sm text-red-600">
              {{ officialTeamError }}
            </p>
          </div>
        </div>
        <div>
          <p class="-mb-2 mt-4">Groups</p>
          <div class="sm:grid sm:grid-flow-col sm:grid-rows-5 gap-4">
            <template v-for="i in selectedGroups.length">
              <template v-if="i !== tournamentGroups.length">
                <Select
                  class="!w-96 !max-w-full mt-4"
                  :options="tournamentGroupOptions"
                  :disable-auto-select="true"
                  v-model:value="selectedGroups[i-1]"
                />
              </template>
            </template>
          </div>
        </div>
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
      text="The Team successfully created."
    />
  </div>
</template>

<script setup lang="ts">

import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import type Team from "~/interfaces/teams/team";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import {useUserStore} from "~/store/user";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import {ageGroups} from "~/constants/ageGroups";
import {genders} from "~/constants/genders";
import {officialTypes} from "~/constants/officialTypes";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";

const route = useRoute()
const clubId = route.params.clubId
const userStore = useUserStore()
const {createTeam, fetchTeamNames, attachGroupsToTeam} = useTeamsFetch()
const {fetchTournamentGroupsNames} = useTournamentGroupFetch()

const showSuccessAlert = ref(false)
const loading = ref(false)
const team = ref({
  id: 0,
  club_id: +clubId,
  local_name: '',
  deleted: false,
  ancestor_id: 0,
  cal_key: '',
  license: 0,
  tournament_name: '',
  gender: '',
  club_rank: 0,
  team_staff: [],
  tournament_groups: [],
  age_group: '',
  official_team_id: 0,
  official_type_id: 0,
} as Team)
const tournamentGroups = ref([] as Array<SelectOptions>)
const selectedGroups = ref([] as Array<SelectOptions>)
const ageGroup = ref({} as SelectOptions)
const gender = ref({} as SelectOptions)
const officialType = ref({
  label: 'Set by club manager',
  value: 0,
  disabled: false
} as SelectOptions)
const officialTeam = ref({} as SelectOptions)
const officialTeams = ref([] as Array<SelectOptions>)
const ageGroupError = ref('')
const genderError = ref('')
const officialTypeError = ref('')
const officialTeamError = ref('')

watch(() => selectedGroups.value, () => {
  let groups = selectedGroups.value.filter((group, index) => !!group.value || index === selectedGroups.value.length - 1)
  if (groups.length && !!groups[groups.length - 1].value && groups.length < 10) {
    groups.push({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }

  if (JSON.stringify(groups) !== JSON.stringify(selectedGroups.value)) {
    selectedGroups.value = groups
  }
}, { 
  deep: true,
  immediate: true
})

const tournamentGroupOptions = computed(() => {
  return tournamentGroups.value.filter((group) => {
    return !group.value || (selectedGroups.value.map(group => group.value)).indexOf(group.value) < 0
  })
})

async function fetchTournamentGroups() {
  const response = await fetchTournamentGroupsNames({
    season_sport_id: userStore.seasonSportId,
    is_active: true,
  }) as Array<TournamentGroup>

  if (response.length) {
    tournamentGroups.value = response.map((group: any) => {
      return {
        label: group.name,
        value: group.id,
        disabled: false,
      }
    })
    tournamentGroups.value.unshift({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)

    selectedGroups.value.push({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }
}

async function fetchClubTeams() {
  const res = await fetchTeamNames('localName', 'ASC', {club_id: +clubId})
  officialTeams.value = []
  res.forEach((team) => {
    officialTeams.value.push({
      label: team.local_name,
      value: team.id,
      disabled: false
    } as SelectOptions)
  })
}

async function create() {
  if (loading.value) {
    return
  }
  const error = 'The field is required!'
  ageGroupError.value = '';
  genderError.value = '';
  officialTeamError.value = ''
  officialTypeError.value = ''
  if (!ageGroup.value.value) {
    return ageGroupError.value = error
  }

  if (!gender.value.value) {
    return genderError.value = error
  }

  if (!officialType.value.value && officialType.value.value !== 0) {
    return officialTypeError.value = error
  }

  if (officialType.value.value === 2 && !officialTeam.value.value) {
    return officialTeamError.value = error
  }

  loading.value=true

  const res = await createTeam({
    club_id: team.value.club_id,
    local_name: team.value.local_name,
    tournament_name: team.value.tournament_name ? team.value.tournament_name : team.value.local_name,
    club_rank: team.value.club_rank,
    gender: gender.value.value,
    age_group: ageGroup.value.value,
    official_type_id: officialType.value.value,
    official_team_id: officialType.value.value === 2 ? officialTeam.value.value : null,
    season_sport_id: userStore.seasonSportId,
  })

  const attachedGroups = selectedGroups.value.filter(group => !!group.value).map(group => group.value)
  const response = await attachGroupsToTeam(res.id, attachedGroups)
  loading.value=false
  if (response) {
    loading.value=true
    showSuccessAlert.value = true
    setTimeout(() => {
      navigateTo(res.id + '')
    }, 3000)
  }
}

onMounted(() => {
  fetchTournamentGroups()
  fetchClubTeams()
})
</script>
