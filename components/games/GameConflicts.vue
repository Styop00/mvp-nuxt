<template>
  <div class="bg-white mt-4 border border-gray-200 rounded-2xl overflow-hidden">
    <p class="bg-amber-400 text-lg p-4 text-white font-bold tracking-wide">
      <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-xl text-white mr-3"/>
      Possible conflicts
      <span class="text-sm">
        detected at {{ moment(conflict.createdAt).format('DD-MMM-YYYY HH:mm') }}
      </span>
    </p>
    <div class="p-5 flex flex-col gap-4">
      <template v-for="key in Object.keys(conflict) as (keyof Conflict)[]">
        <Warning :text="warningText(key)" v-if="conflict[key] && warningText(key)"/>
      </template>
      <div class="flex gap-4 items-center">
        <BaseButton
            class="border bg-red-500 border-red-500 hover:bg-white hover:text-red-500 font-normal !p-2 !px-4 text-sm"
            @onClick="showConfirmDeleteModal = true">
          Delete Conflict
        </BaseButton>
        <BaseButton
            class="bg-white border border-brand-primary-color !text-brand-primary-color hover:!text-white hover:!bg-brand-primary-color font-normal !p-2 !px-4 text-sm"
            @onClick="showConfirmCheckAgainModal = true">
          Check Again
        </BaseButton>
      </div>
    </div>
    <ConfirmationModal
        modal-body="Are you sure you want to delete conflicts?"
        v-model:visible="showConfirmDeleteModal"
        :showDangerConfirmation="true"
        @confirmed="deleteConflict"
    />
    <ConfirmationModal
        modal-body="Are you sure you want to check again for a conflicts?"
        v-model:visible="showConfirmCheckAgainModal"
        @confirmed="checkAgain"
    />
  </div>
</template>
<script setup lang="ts">
import moment from "moment";
import BaseButton from "~/components/buttons/BaseButton.vue";
import type Conflict from "~/interfaces/conflicts/conflict";
import type {PropType} from "vue";
import Warning from "~/components/alerts/Warning.vue";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";
import {useConflictFetch} from "~/composables/useConflictFetch/useConflictFetch";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import {useUserStore} from "~/store/user";
import type Team from "~/interfaces/teams/team";

const props = defineProps({
  conflict: {
    type: Object as PropType<Conflict>,
    required: true
  },
  homeTeam: {
    type: Object as PropType<Team>,
    default: {}
  },
  guestTeam: {
    type: Object as PropType<Team>,
    default: {}
  }
})

const emit = defineEmits(['fetchConflict'])
const userStore = useUserStore()

const {updateConflictById} = useConflictFetch()
const {checkForConflicts} = useGamesFetch()

const showConfirmDeleteModal = ref(false)
const showConfirmCheckAgainModal = ref(false)

function warningText(key: keyof Conflict): string {
  switch (key) {
    case 'startTime':
      return `<span class="font-bold text-sm">Start Time: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'blockedAssociation':
      return `<span class="font-bold text-sm">Blocking Association: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'blockedTeam':
      return `<span class="font-bold text-sm">Blocking Team: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'gamesToClose':
      return `<span class="font-bold text-sm">Matches Too Close: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'gamesOnCourt':
      return `<span class="font-bold text-sm">Other matches On The Court: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'reservations':
      return `<span class="font-bold text-sm">Reservations: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'coaches':
      return `<span class="font-bold text-sm">Trainers: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    case 'hasCourt':
      return `<span class="font-bold text-sm">Stop time: <span class="font-medium"> ${props.conflict[key]} </span></span>`;
    default:
      return '';
  }
}

async function deleteConflict() {
  if (userStore.isAdmin) {
    await updateConflictById(props.conflict.id, {ignoreAssociations: true})
  } else if (userStore.isCoach || userStore.isClubManager) {
    const user_roles = userStore.user.user_roles.filter(role => [1, 5, 6, 7].includes(role.roleId))
    if (user_roles.find(role => (role.clubId === props.homeTeam.clubId || role.teamId === props.homeTeam.id))) {
      await updateConflictById(props.conflict.id, {ignoreHome: true})
    } else {
      await updateConflictById(props.conflict.id, {ignoreAway: true})
    }
  }
  showConfirmDeleteModal.value = false
  emit('fetchConflict')
}

async function checkAgain() {
  await checkForConflicts(props.conflict?.gameId)

  showConfirmCheckAgainModal.value = false
  emit('fetchConflict')
}
</script>
