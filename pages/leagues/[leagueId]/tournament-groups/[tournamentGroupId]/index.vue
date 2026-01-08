<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb/>
    <div class="bg-white rounded-2xl p-2 lg:p-8">
      <p class="text-xl mb-4">Update Tournament Group</p>
      <form action="#" @submit.prevent="updateTournamentGroupData">
        <EditTournamentGroupForm
            :tournament-group="tournamentGroup"
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
        <template v-if="selectExistingTournamentConfig">
          <Select
              class="!w-96 !max-w-full mt-4"
              label="Select Tournament Config"
              direction="top"
              :options="tournamentConfigs"
              v-model:value="selectedTournamentConfig"
          />
        </template>

        <div
            class="p-0 lg-p-6"
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
          Update
        </BaseButton>
      </form>
    </div>
    <SuccessAlert
        v-model:visible="showSuccessAlert"
        text="The Tournament Group’s information has been successfully updated."
    />
    <LivePageOrNot
        v-model:visible="showUnsavedChangesModal"
        @confirm="confirmLeavePage"
        @cancel="cancelLeavePage"
    />
  </div>
</template>

<script setup lang="ts">
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import EditTournamentConfigForm from "~/components/tournament/EditTournamentConfigForm.vue";
import Switch from "~/components/inputs/Switch.vue";
import Select from "~/components/inputs/Select.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import moment from "moment";
import BaseButton from "~/components/buttons/BaseButton.vue";
import EditTournamentGroupForm from "~/components/tournament/EditTournamentGroupForm.vue";
import {useTournamentGroupFetch} from "~/composables/useTournamentGroupFetch/useTournamentGroupFetch";
import {useTournamentConfigFetch} from "~/composables/useTournamentConfigFetch/useTournamentConfigFetch";
import SuccessAlert from "~/components/alerts/SuccessAlert.vue";
import {useUserStore} from "~/store/user";
import type TournamentConfigsErrors from "~/interfaces/tournament/config/tournamentConfigsErrors";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
import LivePageOrNot from "~/components/alerts/LivePageOrNot.vue";

const route = useRoute()
const leagueId = route.params.leagueId
const id = route.params.tournamentGroupId
const tournamentGroup = ref({} as TournamentGroup)
const tournamentConfig = ref({} as TournamentConfigs)
const selectExistingTournamentConfig = ref(true)
const tournamentConfigs = ref([] as Array<SelectOptions>)
const selectedTournamentConfig = ref({} as SelectOptions)
const editTournamentConfigRef = ref<InstanceType<typeof EditTournamentConfigForm> | null>(null)
const editTournamentGroupRef = ref<InstanceType<typeof EditTournamentGroupForm> | null>(null)
const loading = ref(true)
const showSuccessAlert = ref(false)
const errors = ref({} as TournamentConfigsErrors)
const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
let routeNext: any = null;

const userStore = useUserStore()

const {fetchTournamentGroupById, updateTournamentGroup} = useTournamentGroupFetch()
const {fetchTournamentConfigNames, fetchTournamentConfigById, createTournamentConfig} = useTournamentConfigFetch()

onMounted(async () => {
  document.body.addEventListener('click', closeCalendars)
  await fetchTournamentGroup()
  await fetchTournamentConfigs()
})

watch([selectedTournamentConfig, selectExistingTournamentConfig], () => {
  fetchSelectedTournamentConfigs()
}, {
  deep: true,
  immediate: true
})

watch(() => tournamentConfig.value, () => {
  if (tournamentConfig.value && tournamentConfig.value.id !== tournamentGroup.value.tournament_configs_id) {
    hasUnsavedChanges.value = true
  }
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
    const response = await fetchTournamentConfigById(+selectedTournamentConfig.value.value)
    tournamentConfig.value = response as TournamentConfigs
  }
}

async function fetchTournamentGroup() {
  const response = await fetchTournamentGroupById(+id)
  if (response) {
    tournamentGroup.value = response as TournamentGroup
    tournamentGroup.value.start_date = moment(tournamentGroup.value.start_date as string).format('YYYY-MM-DD')
    tournamentGroup.value.end_date = moment(tournamentGroup.value.end_date as string).format('YYYY-MM-DD')
    if (tournamentGroup.value.tournament_config) {
      tournamentConfig.value = {...tournamentGroup.value.tournament_config}
    } else {
      selectExistingTournamentConfig.value = false
    }
  }
  loading.value = false
}

async function fetchTournamentConfigs() {
  const response = await fetchTournamentConfigNames({
    season_sport_id: userStore.seasonSportId,
    deleted: false,
  }) as Array<TournamentConfigs>

  if (response.length) {
    tournamentConfigs.value = response.map((tournamentConfig: any) => {
      return {
        label: tournamentConfig.name,
        value: tournamentConfig.id,
        disabled: false,
      }
    })
    let alreadySelected = tournamentConfigs.value.find((tournamentConfig: any) => {
      return tournamentConfig.value === tournamentGroup.value.tournament_configs_id
    }) as SelectOptions

    if (alreadySelected) {
      selectedTournamentConfig.value = alreadySelected
      selectExistingTournamentConfig.value = true
    }
  }
}

async function updateTournamentGroupData() {
  if (loading.value) return;

  if (editTournamentConfigRef.value?.startTimeError || editTournamentConfigRef.value?.endTimeError) {
    return
  }
  errors.value = {} as TournamentConfigsErrors

  let requestData = {
    ...editTournamentGroupRef.value?.editData,
    leagueId: +leagueId
  }

  if (requestData.max_teams && requestData.max_teams < (requestData?.min_teams || 0)) {
    errors.value.maxTeams = 'Max Teams count should be larger than Min Teams count.'
    return
  }

  if ((selectExistingTournamentConfig.value && !selectedTournamentConfig.value.value)
      || (!selectExistingTournamentConfig.value && !editTournamentConfigRef.value?.editData.name)) {
    errors.value.tournamentConfig = 'Tournament Config is required.'
    return
  }

  loading.value = true
  if (selectExistingTournamentConfig.value && selectedTournamentConfig.value.value !== tournamentGroup.value.tournament_configs_id) {
    requestData.tournament_configs_id = selectedTournamentConfig.value.value as number
    tournamentGroup.value.tournament_configs_id = selectedTournamentConfig.value.value as number
  } else if (!selectExistingTournamentConfig.value) {
    let newConfig = await createTournamentConfig({
      ...editTournamentConfigRef.value?.editData,
      seasonSportId: userStore.seasonSportId,
    })

    if (!newConfig || !newConfig.id) {
      loading.value = false
      return
    }

    requestData.tournament_configs_id = newConfig.id as number
    tournamentConfig.value = {...newConfig}
    tournamentGroup.value.tournament_configs_id = newConfig.id as number
  }

  const res = await updateTournamentGroup(+id, requestData)

  await fetchTournamentConfigs()

  if (res) {
    showSuccessAlert.value = true
    hasUnsavedChanges.value = false
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
