<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-dark-surface-default rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Update Team</p>
      <form action="#" @submit.prevent="updateTeamData">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
              v-model:value="team.local_name"
              label="Local Name"
              :required="true"
          />
          <template v-if="userStore.isAdmin">
            <TextInput
                v-model:value="team.club_rank"
                type="number"
                :min="0"
                label="Club ranking (1-xxx)"
            />
          </template>
        </div>
        <template v-if="userStore.isAdmin">
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
            <p class="-mb-2 mt-4">Tournaments</p>
            <div class="sm:grid sm:grid-flow-col sm:grid-rows-5 gap-4">
              <template v-for="i in selectedTournaments.length">
                <template v-if="i !== tournaments.length">
                  <Select
                      class="!w-96 !max-w-full mt-4"
                      :options="tournamentOptions"
                      :disable-auto-select="true"
                      v-model:value="selectedTournaments[i-1]"
                  />
                </template>
              </template>
            </div>
          </div>
        </template>
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
        text="The Team information has been successfully updated."
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
import {useTournamentFetch} from "~/composables/useTournamentFetch/useTournamentFetch";
import {ageGroups} from "~/constants/ageGroups";
import {genders} from "~/constants/genders";
import {officialTypes} from "~/constants/officialTypes";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import type Tournament from "~/interfaces/tournament/tournament";

const route = useRoute()
const teamId = route.params.teamId
const clubId = route.params.clubId
const userStore = useUserStore()
const {fetchTeamById, fetchTeamNames, updateTeam, attachTournamentsToTeam} = useTeamsFetch()
const {fetchTournamentsNames} = useTournamentFetch()

const showSuccessAlert = ref(false)
const loading = ref(false)
const team = ref({} as Team)
const tournaments = ref([] as Array<SelectOptions>)
const selectedTournaments = ref([] as Array<SelectOptions>)
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

watch(() => selectedTournaments.value, () => {
  let tournaments = selectedTournaments.value.filter((tournament, index) => !!tournament?.value || index === selectedTournaments.value.length - 1)
  if (tournaments.length && !!tournaments[tournaments.length - 1].value && tournaments.length < 10) {
    tournaments.push({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }

  if (JSON.stringify(tournaments) !== JSON.stringify(selectedTournaments.value)) {
    selectedTournaments.value = tournaments
  }
}, {
  deep: true,
  immediate: true
})

const tournamentOptions = computed(() => {
  return tournaments.value.filter((tournament) => {
    return !tournament.value || (selectedTournaments.value.map(tournament => tournament.value)).indexOf(tournament.value) < 0
  })
})

async function getTeamById() {
  team.value = await fetchTeamById(+teamId)

  ageGroup.value = ageGroups.find(ageGroup => ageGroup.value === team.value.age_group) as SelectOptions
  gender.value = genders.find(gender => gender.value === team.value.gender) as SelectOptions
  officialType.value = officialTypes.find(type => type.value === team.value.official_type_id) as SelectOptions
  officialTeam.value = officialTeams.value.find(type => type.value === team.value.official_team_id) as SelectOptions

  if (!team.value.id) {
    navigateTo('../teams')
  }
}

async function fetchTournaments() {
  const response = await fetchTournamentsNames({
    season_sport_id: userStore.seasonSportId,
    is_active: true,
  }) as Array<Tournament>

  if (response.length) {
    tournaments.value = response.map((tournament: any) => {
      return {
        label: tournament.name,
        value: tournament.id,
        disabled: false,
      }
    })
    tournaments.value.unshift({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)

    team.value.tournaments?.map((tournament, index) => {
      selectedTournaments.value.push(tournaments.value.find(t => t.value === tournament.id) as SelectOptions)
    })

    selectedTournaments.value.push({
      label: '---select---',
      value: null,
      disabled: false,
    } as SelectOptions)
  }
}

async function fetchClubTeams() {
  if (loading.value) return
  const res = await fetchTeamNames('localName', 'ASC', {clubId: +clubId})
  officialTeams.value = []
  res.forEach((team) => {
    officialTeams.value.push({
      label: team.local_name,
      value: team.id,
      disabled: false
    } as SelectOptions)
  })
  officialTeam.value = officialTeams.value.find(type => type.value === team.value.official_team_id) as SelectOptions
}

async function updateTeamData() {
  const error = 'The field is required!'
  ageGroupError.value = '';
  genderError.value = '';
  officialTeamError.value = ''
  officialTypeError.value = ''

  if (userStore.isAdmin) {
    if (!ageGroup.value?.value) {
      return ageGroupError.value = error
    }

    if (!gender.value?.value) {
      return genderError.value = error
    }

    if (!officialType.value.value && officialType.value.value !== 0) {
      return officialTypeError.value = error
    }

    if (officialType.value.value === 2 && !officialTeam.value.value) {
      return officialTeamError.value = error
    }

    loading.value = true

    await updateTeam(+teamId, {
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
  } else {
    await updateTeam(+teamId, {
      localName: team.value.local_name,
    })
  }

  const attachedTournaments = selectedTournaments.value.filter(tournament => !!tournament?.value).map(tournament => tournament.value)
  const response = await attachTournamentsToTeam(+teamId, attachedTournaments)
  loading.value = false
  if (response) {
    showSuccessAlert.value = true
  }
}

// Watch for route param changes
watch(() => route.params.teamId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    team.value = {} as Team
    selectedTournaments.value = []
    getTeamById()
    fetchTournaments()
    if (clubId) {
      fetchClubTeams()
    }
  }
}, { immediate: false })

onMounted(async () => {
  await getTeamById()
  fetchTournaments()
  if (clubId) {
    fetchClubTeams()
  }
})
</script>
