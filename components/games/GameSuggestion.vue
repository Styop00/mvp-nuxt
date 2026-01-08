<template>
  <div class="bg-dark-surface-default mt-4 border border-dark-border-default rounded-2xl overflow-hidden">
    <p class="text-lg p-4 font-medium border-b tracking-wide flex items-center px-2">
      <span
          class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
      />
      <span>
        Moving in progress
      </span>
    </p>
    <div class="p-6">
      <p class="text-lg mb-4 text-brand-gray">
        The math is requested to be moved by
        {{ suggestion.requestedByUser?.name ? suggestion.requestedByUser?.name : suggestion.requestedByUser?.email }}
      </p>
      <p class="text-sm flex items-center gap-2 text-brand-gray leading-8">
        <font-awesome :icon="['far', 'clock']" class="text-sm"/>
        {{ moment(suggestion?.date as string).format('ddd') }}
        {{ moment(suggestion?.date as string).format('DD-MMM-YYYY') }}
        {{ moment(suggestion?.time, 'HH:mm').format('HH:mm') }}
      </p>
      <p class="text-sm text-brand-gray flex items-center gap-2 leading-8">
        <font-awesome :icon="['fas', 'location-dot']" class="text-sm w-3.5"/>
        <template v-if="suggestion.court">
          {{ suggestion.court.venue.name }} {{ suggestion.court.name }}
        </template>
        <template v-else>
          Venue - Court
        </template>
      </p>
      <div class="flex gap-3 items-center mt-6">
        <BaseButton
            v-if="canAccept"
            class="text-white text-sm !py-2 !px-4 rounded-md border hover:text-brand-secondary-color hover:bg-dark-surface-default bg-brand-secondary-color border-brand-secondary-color"
            type="button"
            @on-click="() => showAcceptConfirmation = true"
        >
          Accept
        </BaseButton>
        <BaseButton
            class="text-sm !py-2 !px-4 rounded-md bg-dark-surface-default border border-sky-400 !text-sky-500 hover:!text-white hover:bg-sky-400"
            type="button"
            @on-click="checkSuggestion"
        >
          Check
        </BaseButton>
        <BaseButton
            v-if="canReject"
            class="text-white text-sm !py-2 !px-4 rounded-md border bg-red-500 border-red-500 hover:bg-dark-surface-default hover:text-red-500"
            type="button"
            @on-click="() => showRejectConfirmation = true"
        >
          Decline
        </BaseButton>
      </div>
    </div>

    <CheckGameModal v-model:visible="showCheckModal" :loading="checkLoading" :checks="checks"/>
    <ConfirmationModal
        modal-body="Are you sure you want to accept this suggestion?"
        v-model:visible="showAcceptConfirmation"
        @confirmed="acceptSuggestion"
    />
    <ConfirmationModal
        modal-body="Are you sure you want to reject this suggestion?"
        v-model:visible="showRejectConfirmation"
        @confirmed="rejectSuggestion"
        :showDangerConfirmation="true"
    />
  </div>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import type {PropType} from "vue";
import type Suggestion from "~/interfaces/suggestions/suggestion";
import moment from "moment";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import CheckGameModal from "~/components/modals/games/CheckGameModal.vue";
import ConfirmationModal from "~/components/modals/games/ConfirmationModal.vue";

const props = defineProps({
  suggestion: {
    type: {} as PropType<Suggestion>,
    required: true
  },
  canAccept: {
    type: Boolean,
    default: false,
  },
  canReject: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['reFetch'])

const {checkGame, saveDateAndCourt} = useGamesFetch()

const checks = ref('')
const showCheckModal = ref(false)
const checkLoading = ref(false)
const showAcceptConfirmation = ref(false)
const showRejectConfirmation = ref(false)

async function checkSuggestion() {
  checkLoading.value = true
  showCheckModal.value = true
  const res = await checkGame(props.suggestion?.gameId, {suggestionId: props.suggestion?.id})

  let checkHeader = ''
  checks.value = ''
  res.forEach(check => {
    if (checks.value.length) {
      checks.value += '<br>'
    }

    if (checkHeader !== check.type) {
      checkHeader = check.type

      checks.value += `<span class="${getClassByStatus(check.status)} mt-4 inline-block font-bold">${check.header}</span> </br>`
    }

    checks.value += `<span class="text-sm text-brand-primary-color ml-2">${check.message}</span>`
  })
  checkLoading.value = false
}

function getClassByStatus(status: string) {
  switch (status) {
    case 'warning':
      return 'text-yellow-500';
    case 'danger':
      return 'text-red-500';
    case 'success':
      return 'text-green-500';
    case 'info':
      return 'text-blue-500';
  }
}

async function acceptSuggestion() {
  const res = await saveDateAndCourt(props.suggestion?.gameId,
      {
        suggestionId: props.suggestion.id,
        isAcceptedSuggestion: true
      })
  showAcceptConfirmation.value = false
  if (res) {
    emit('reFetch')
  }
}

async function rejectSuggestion() {
  const res = await saveDateAndCourt(props.suggestion?.gameId,
      {
        suggestionId: props.suggestion.id,
        isAcceptedSuggestion: false
      })
  showRejectConfirmation.value = false
  if (res) {
    emit('reFetch')
  }
}
</script>
