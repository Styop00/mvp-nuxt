<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-white rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Update Team</p>
      <form action="#" @submit.prevent="updateTeamData">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
              v-model:value="team.localName"
              label="Local Name"
              :required="true"
          />
          <template v-if="userStore.isAdmin">
            <TextInput
                v-model:value="team.clubRank"
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
  <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">

import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import type Team from "~/interfaces/teams/team";
import {useTeamsFetch} from "~/composables/useTeamsFetch/useTeamsFetch";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import {useUserStore} from "~/store/user";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import {ageGroups} from "~/constants/ageGroups";
import {genders} from "~/constants/genders";
import {officialTypes} from "~/constants/officialTypes";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";

const route = useRoute()
const teamId = route.params.teamId
const clubId = route.params.clubId
const userStore = useUserStore()
const {fetchTeamById, fetchTeamNames, updateTeam, attachGroupsToTeam} = useTeamsFetch()
const {fetchTournamentGroupsNames} = useTournamentGroupFetch()

const showSuccessAlert = ref(false)
const loading = ref(false)
const team = ref({} as Team)
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
  let groups = selectedGroups.value.filter((group, index) => !!group?.value || index === selectedGroups.value.length - 1)
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

async function getTeamById() {
  team.value = await fetchTeamById(+teamId)

  ageGroup.value = ageGroups.find(ageGroup => ageGroup.value === team.value.ageGroup) as SelectOptions
  gender.value = genders.find(gender => gender.value === team.value.gender) as SelectOptions
  officialType.value = officialTypes.find(type => type.value === team.value.officialTypeId) as SelectOptions
  officialTeam.value = officialTeams.value.find(type => type.value === team.value.officialTeamId) as SelectOptions

  if (!team.value.id) {
    navigateTo('../teams')
  }
}

async function fetchTournamentGroups() {
  const response = await fetchTournamentGroupsNames({
    seasonSportId: userStore.seasonSportId,
    isActive: true,
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

    team.value.tournamentGroups.map((group, index) => {
      selectedGroups.value.push(tournamentGroups.value.find(tournamentGroup => tournamentGroup.value === group.id) as SelectOptions)
    })

    selectedGroups.value.push({
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
      label: team.localName,
      value: team.id,
      disabled: false
    } as SelectOptions)
  })
  officialTeam.value = officialTeams.value.find(type => type.value === team.value.officialTeamId) as SelectOptions
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
      clubId: team.value.clubId,
      localName: team.value.localName,
      tournamentName: team.value.tournamentName ? team.value.tournamentName : team.value.localName,
      clubRank: team.value.clubRank,
      gender: gender.value.value,
      ageGroup: ageGroup.value.value,
      officialTypeId: officialType.value.value,
      officialTeamId: officialType.value.value === 2 ? officialTeam.value.value : null,
      seasonSportId: userStore.seasonSportId,
    })
  } else {
    await updateTeam(+teamId, {
      localName: team.value.localName,
    })
  }

  const attachedGroups = selectedGroups.value.filter(group => !!group?.value).map(group => group.value)
  const response = await attachGroupsToTeam(+teamId, attachedGroups)
  loading.value = false
  if (response) {
    showSuccessAlert.value = true
    hasUnsavedChanges.value = false
  }
}

const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
let routeNext: any = null;

function confirmLeavePage() {
  showUnsavedChangesModal.value = false;
  if (routeNext) {
    routeNext();
  }
}

function cancelLeavePage() {
  showUnsavedChangesModal.value = false;
  routeNext = null;
}

watch(() => team.value, (newVal, oldVal) => {

  if (oldVal.id === undefined && newVal.id === team.value.id) {
    return;
  }

  if (oldVal && newVal) {
    hasUnsavedChanges.value = true

    return;
  }

  if (newVal) {
    hasUnsavedChanges.value = true

  }

}, {deep: true});

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    routeNext = next;
  } else {
    next();
  }
});

onMounted(async () => {
  await getTeamById()
  fetchTournamentGroups()
  if (clubId) {
    fetchClubTeams()
  }
})
</script>
