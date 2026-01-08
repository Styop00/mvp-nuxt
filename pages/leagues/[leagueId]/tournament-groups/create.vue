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
            @unsavedChanges="handleUnsavedChanges"
        />
        <Switch
            v-model:value="selectExistingTournamentConfig"
            unchecked-label="Tournament Group Config"
            labelStyles="!text-xl"
            class="pt-8 border-t mt-8"
        />
        <span v-if="errors?.tournamentConfig" class="text-xs text-red-600">
          {{ errors.tournamentConfig }}
        </span>
        <template v-if="selectExistingTournamentConfig">
          <Select
              class="xl:!w-96 mt-4"
              label="Select Tournament Config"
              :direction="selectedTournamentConfig?.value ? 'bottom' : 'top'"
              :options="tournamentConfigs"
              v-model:value="selectedTournamentConfig"
          />
        </template>
        <div
            v-if="!selectExistingTournamentConfig || selectedTournamentConfig?.value"
        >
          <p class="my-3 text-base" v-if="!selectExistingTournamentConfig">
            Create New Tournament Group Config
          </p>
          <EditTournamentConfigForm
              ref="editTournamentConfigRef"
              :data="tournamentConfig"
              :show-disabled-inputs="selectExistingTournamentConfig"
              :show-update-button="false"
              @unsavedChanges="handleUnsavedChanges"

          />
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
        text="The new Tournament Group has been successfully created."
    />
  </div>
  <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">
import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import EditTournamentConfigForm from "~/components/tournament/EditTournamentConfigForm.vue";
import Switch from "~/components/inputs/Switch.vue";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentGroupForm from "~/components/tournament/EditTournamentGroupForm.vue";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import {useUserStore} from "~/store/user";
import type TournamentConfigsErrors from "~/interfaces/tournament/config/tournamentConfigsErrors";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";
import type League from "~/interfaces/league/leagues";
import {camelToSnake} from "~/utils/camelToSnake";

const route = useRoute()
const leagueId = route.params.leagueId
const tournamentGroup = ref({} as TournamentGroup)
const tournamentConfig = ref({} as TournamentConfigs)
const selectExistingTournamentConfig = ref(true)
const tournamentConfigs = ref([] as Array<SelectOptions>)
const selectedTournamentConfig = ref({} as SelectOptions)
const editTournamentConfigRef = ref<InstanceType<typeof EditTournamentConfigForm> | null>(null)
const editTournamentGroupRef = ref<InstanceType<typeof EditTournamentGroupForm> | null>(null)
const loading = ref(true)
const showSuccessAlert = ref(false)
const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
const groupBaseData = ref({
  ageGroup: null,
  gender: null,
  movingStrategyId: null,
  officialsTypeId: null,
  penaltyTypeId: null,
  playerLicenseTypeId: null,
  refNominationId: null,
  scoreSheetTypeId: null,
  setGameStrategyId: 0,
  tournamentRegistrationTypeId: null,
  tournamentStructureId: null,
  tournamentTypeId: null,
  id: 0,
  name: '',
  shortName: '',
  hideFromRankings: false,
  allowMentorProspect: false,
  starRating: 0,
  isActive: false,
  minTeams: 0,
  maxTeams: 0,
  regionId: 0,
  registrationFee: 0,
  information: '',
  startDate: '',
  endDate: '',
  levels: 0,
  showBirthInScoreSheet: false,
  tournamentConfigsId: 0,
} as TournamentGroup);

let routeNext: any = null;

const userStore = useUserStore()

const errors = ref({} as TournamentConfigsErrors)

onMounted(() => {
  document.body.addEventListener('click', closeCalendars)
  fetchTournamentConfigs()
})

watch([selectedTournamentConfig, selectExistingTournamentConfig], () => {
  hasUnsavedChanges.value = true
  fetchSelectedTournamentConfigs()
})

function closeCalendars() {
  editTournamentConfigRef.value?.closeCalendars()
  editTournamentGroupRef.value?.closeCalendars()
}

async function fetchSelectedTournamentConfigs() {
  if (!selectExistingTournamentConfig.value) {
    if (editTournamentConfigRef.value) {
      editTournamentConfigRef.value.resetForm()
    }
    return
  } else if (selectedTournamentConfig.value.value) {
    const response = await useApiV5Fetch(`tournament-configs/${selectedTournamentConfig.value.value}`)
    tournamentConfig.value = response.data.value as TournamentConfigs
  }
}

async function fetchTournamentConfigs() {
  const response = await useApiV5Fetch(`tournament-configs/names`, {
    query: {
      season_sport_id: userStore.seasonSportId,
      deleted: false,
    }
  })
  if (response.data?.value) {
    tournamentConfigs.value = response.data.value.map((tournamentConfig: any) => {
      return {
        label: tournamentConfig.name,
        value: tournamentConfig.id,
        disabled: false,
      }
    })
    let alreadySelected = tournamentConfigs.value.find((tournamentConfig: any) => {
      return tournamentConfig.value === tournamentGroup.value.tournamentConfigsId
    }) as SelectOptions

    if (alreadySelected) {
      selectedTournamentConfig.value = alreadySelected
    }
  }
  loading.value = false
}

async function createTournamentGroup() {
  if (loading.value) return;

  if (editTournamentConfigRef.value?.startTimeError || editTournamentConfigRef.value?.endTimeError) {
    return
  }
  errors.value = {} as TournamentConfigsErrors
  let requestData = {
    ...editTournamentGroupRef.value?.editData,
    leagueId: +leagueId
  }

  if (requestData.maxTeams && requestData.maxTeams < requestData.minTeams) {
    errors.value.maxTeams = 'Max Teams count should be larger than Min Teams count.'
    return
  }

  if ((selectExistingTournamentConfig.value && !selectedTournamentConfig.value.value)
      || (!selectExistingTournamentConfig.value && !editTournamentConfigRef.value?.editData.name)) {
    errors.value.tournamentConfig = 'Tournament Config is required.'
    return
  }

  loading.value = true

  if (selectExistingTournamentConfig.value) {
    requestData.tournamentConfigsId = selectedTournamentConfig.value.value as Number
  } else if (!selectExistingTournamentConfig.value) {
    let tournamentConfig = await useApiV5Fetch(`tournament-configs`, {
      method: 'POST',
      body: {
        ...editTournamentConfigRef.value?.editData,
        seasonSportId: userStore.seasonSportId,
      }
    })
    requestData.tournamentConfigsId = tournamentConfig.data?.value.id as Number
  }
  let response = await useApiV5Fetch(`tournament-group`, {
    method: 'POST',
    body: camelToSnake(requestData),
  })

  if (response.status.value === 'success') {
    showSuccessAlert.value = true
    hasUnsavedChanges.value = false
    setTimeout(() => {
      navigateTo(`/leagues/${leagueId}/tournament-groups/${response.data.value.id}`)
    }, 3000)
  } else {
    loading.value = false
  }
}

function handleUnsavedChanges(value: any) {
  hasUnsavedChanges.value = value;
}

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

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    routeNext = next;
  } else {
    next();
  }
});
</script>
