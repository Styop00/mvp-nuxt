<template>
  <div class="p-6 xl:w-1/2 md:w-2/3 w-full max-w-4xl bg-dark-surface-default shadow-lg rounded-lg">
    <form @submit.prevent.stop class="space-y-6">
      <!-- Title -->
      <p class="text-lg font-bold flex items-center gap-3">
        <span
          class="inline-block w-1 h-6 rounded bg-gradient-to-b from-violet-500 to-sky-400"
        ></span>
        {{ props.refId
          ? `Correct referee ${props.pos} at match #${game?.number}`
          : `Fix referee ${props.pos} at match #${game?.number}` }}
      </p>

      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium">Vacancy</p>
          <BaseButton
            type="button"
            class="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loadingbutton"
            @click="fetchAvailableReferees"
          >
            Available Qualified Judges
          </BaseButton>
        </div>

        <div>
          <p class="text-sm font-medium">Current Judge</p>
          <p v-html="currentRefText" class="text-dark-text-primary"></p>
          <div v-if="!canApproveRef" class="space-y-3">
            <BaseButton
              v-if="canRejectRef"
              type="button"
              class="text-sm font-medium text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded mr-3"
              @click="rejectRef"
            >
              Cancellation by Judge
            </BaseButton>
            <BaseButton
              type="button"
              class="text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded"
              @click="removeRef"
            >
              Remove Judge
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Automatic Attachment -->
      <div v-if="canShowManual" class="space-y-4">
        <p class="text-sm font-medium">Automatic Attachment</p>
        <BaseButton
          v-if="canAutoApply"
          type="button"
          class="text-sm font-medium text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
          @click="autoAssign"
        >
          Auto Apply
        </BaseButton>
        <BaseButton
          v-if="canSetInMVP"
          type="button"
          class="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
          @click="assignInMVP"
        >
          Release in MVP
        </BaseButton>
        <BaseButton
          v-if="!canApproveRef"
          type="button"
          class="text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded"
          @click="approveDraftRef"
        >
          Approve Draft Judge
        </BaseButton>
      </div>

      <!-- Manual Installation -->
      <div v-if="canShowManual" class="space-y-4">
        <p class="text-sm font-medium">Manual Installation</p>
        <TextInput
          label="Referee License"
          type="number"
          min="0"
          v-model:value="manualRefLicense"
          placeholder="Enter referee license"
          class="w-full"
        />
        <div
          v-if="refDetailsText"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded"
        >
          <p v-html="refDetailsText" class="text-sm text-gray-800"></p>
        </div>
        <p v-if="licenseErrorMessage" class="text-red-600 text-sm">
          {{ licenseErrorMessage }}
        </p>
        <BaseButton
          type="button"
          class="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingbutton"
          @click="saveManualRef"
        >
          Apply
        </BaseButton>
      </div>
    </form>

    <!-- Modals and Alerts -->
    <SuccessAlert
      v-model:visible="showSuccessAlertCreate"
      :text="`Referee has been successfully ${props.refId ? 'edited' : 'created'}.`"
    />
    <RejectRefereeModal
      v-model:visible="showConfirmModal"
      message="Do you want to register the referee's absence for this match?"
      @confirm="registerRefereeAbsense"
    />
    <RemoveJudgeModal
      v-model:visible="showConfirmModalRemoveJudge"
      message="Do you want to remove the referee from this match?"
      @confirm="confirmRemoveRef"
    />
    <ApproveRefModal
      v-model:visible="showConfirmModalApproveRef"
      message="Would you like to approve this nomination?"
      @confirm="approveDraft"
    />

    <Warning
      v-if="saveRef"
      text="Not activated. You cannot assign a referee to this match because one is already registered in SportSys. The referee must be removed from there, after which MVP will update shortly."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import Warning from '../alerts/Warning.vue';
import TextInput from '~/components/inputs/TextInput.vue';
import { useRefereesFetch } from '~/composables/useRefereeFetch/useRefereeFetch';
import { useGamesFetch } from '~/composables/useGamesFetch/useGamesFetch';
import { useUserStore } from '~/store/user';
import type Game from '~/interfaces/games/game';
import type { Referee } from '~/interfaces/referees/referee';
import RejectRefereeModal from '../modals/referee/RejectRefereeModal.vue';
import RemoveJudgeModal from '../modals/referee/RemoveJudgeModal.vue';
import ApproveRefModal from '../modals/referee/ApproveRefModal.vue';
import { debounce } from '~/utils/debounce';

const props = defineProps<{
  gameId: number;
  refId: number;
  pos: number;
}>();

const emit = defineEmits(['unsavedChanges', 'refreshData']);

const showSuccessAlertCreate = ref(false);
const loadingbutton = ref(false);
const game = ref<Game | null>(null);
const referee = ref<Referee | null>(null);
const manualRefLicense = ref<number>();
const showConfirmModal = ref(false)
const showConfirmModalRemoveJudge = ref(false)
const showConfirmModalApproveRef = ref(false)
const saveRef = ref(false)
const licenseErrorMessage = ref("")
const refDetailsText = ref('')
const { seasonSportId, user } = useUserStore()
const { getGameById } = useGamesFetch();
const {
    getRefereeById,
    getRefList,
    performRejectRef,
    performDeleteRef,
    selectRefForOneGame,
    performSetRef,
    performSetInMvp,
    performApproveRef,
    performGetRefDetails
} = useRefereesFetch();

const gamePlanStatusId = computed(() => {
  return game.value?.gamePlans.find((gp) => gp.gameRoleId === props.pos)?.statusId ?? null;
});

const gamePlan = computed(() => {
  return game.value?.gamePlans.find((gp) => gp.gameRoleId === props.pos) ?? null
})

const canAutoApply = ref<boolean>(true)
const canApproveRef = ref<boolean>(true)
const canRejectRef = ref<boolean>(true)
const boluser = ref<boolean>(true)
const canSetInMVP = ref<boolean>(true)

const canShowManual = computed(() => {
  if(game.value && game.value.statusId !== undefined && game.value.statusId !== null && game.value.statusId <= 4) {
   return false
  }
  return true
})

const currentRefText = computed(() => {
  if (referee.value && gamePlan.value?.userId) {
    const userId = gamePlan.value.userId;
    const license = referee.value.license ?? 'Unknown License';
    const name = referee.value.user?.name ?? 'Unknown Name';

    if (userId > 1) {
      canAutoApply.value = false
      const statusText =
        gamePlanStatusId.value !== null && gamePlanStatusId.value >= 3
          ? "<span class='text-primary'> draft</span>"
          : gamePlanStatusId.value !== null && gamePlanStatusId.value >= 2
          ? "<span class='text-primary'> awaiting referee</span>"
          : '';
          if(gamePlanStatusId.value !== null && gamePlanStatusId.value < 3) {
            canApproveRef.value = false
          } else {
            canRejectRef.value = false
          }
          canSetInMVP.value = false
      return `${license} ${name} ${statusText}`;
    } else if (userId >= -3 && userId <= -1) {
      canApproveRef.value = false
      return "<span class='text-danger'>Published in MVP</span>";
    } else {
      boluser.value = false;
      canApproveRef.value = false;
      canSetInMVP.value = false;
      return "<span class='text-danger'>Not Set</span>";
    }
  }
  return "<span class='text-danger'>No Referee Data</span>";
});

async function fetchAvailableReferees () {
  navigateTo(`/referees/referee-attachment/${props.gameId}/game-ref-list`)
  await getRefList({ gameId: props.gameId, seasonSportId })
}

function rejectRef() {
  showConfirmModal.value = true;
};

async function registerRefereeAbsense() {
  await performRejectRef({gameId: props.gameId, pos: props.pos, seasonSportId })
  navigateTo("/referees/referee-attachment/")
}

function removeRef() {
  showConfirmModalRemoveJudge.value = true
};

async function confirmRemoveRef(chkNoMoreGames1: number, chkNoMoreGames2: number) {
  const noMoreGames1 =  chkNoMoreGames1 ? 1 : 0;
  const noMoreGames2 = chkNoMoreGames2 ? 2 : 0;
  const noMoreGames = noMoreGames2 || noMoreGames1;
  if( gamePlanStatusId.value == 0 && referee.value && referee.value.userId > 0 ) {
    await performDeleteRef({gameId: props.gameId, pos: props.pos, forUserId: referee.value.userId, nomoregames: noMoreGames, seasonSportId })
  } else if(referee.value){
    await performSetRef({gameId: props.gameId, pos: props.pos, refUserId: referee.value.userId , nomoregames: noMoreGames, seasonSportId})
  }
}


async function autoAssign() {
  await selectRefForOneGame({gameId: props.gameId, pos: props.pos, seasonSportId})
};

async function assignInMVP() {
 await performSetInMvp({gameId: props.gameId, pos: props.pos, seasonSportId, userId: user.id})
};

async function  approveDraftRef () {
  showConfirmModalApproveRef.value = true;
};

async function approveDraft() {
  await performApproveRef({gameId: props.gameId, pos: props.pos, seasonSportId, forUserId: referee?.value?.userId})
};

async function saveManualRef() {
  licenseErrorMessage.value = ""
  saveRef.value = false
  referee.value = await getRefereeById(props.refId);
  game.value = await getGameById(props.gameId);

  if (refDetailsText.value = "Not found.") {
    return
  }

  if (gamePlanStatusId.value == 0 && referee.value && referee.value?.userId > 0 && manualRefLicense.value) {
    saveRef.value = true
  } else {
    let license = Number(String(manualRefLicense.value).trim())
    if(!license) {
      licenseErrorMessage.value = "Error: You must provide a referee number."
    } else if(referee.value) {
      await performSetRef({gameId: props.gameId, pos: props.pos, license, seasonSportId})
    }
  }
};

const debounceGetRefDetails = debounce(async (license: number) => {
 const response =  await performGetRefDetails({
    gameId: props.gameId,
    pos: props.pos,
    license,
    seasonSportId
  });
  refDetailsText.value = response?.display || "";
}, 1000);

watch(() => manualRefLicense.value, async (newValue) => {
  if (newValue && newValue > 0) {
    debounceGetRefDetails(newValue);
  }
});

onMounted(async () => {
  refDetailsText.value = ""
  saveRef.value = false
  if (props.gameId) {
    game.value = await getGameById(props.gameId);
  }
  if (props.refId) {
    referee.value = await getRefereeById(props.refId);
  }
});
</script>
