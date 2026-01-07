<template>
  <BaseModalComponent v-model:visible="modal" :width="4">
    <form class="p-4 min-h-[70vh] flex flex-col justify-between" @submit.prevent="() => save()">
      <div>
        <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
        <p class="font-bold my-5 text-lg">
          Set Match Result
        </p>
        <div class="grid grid-cols-7 gap-4">
          <p class="col-span-3">Team</p>
          <p>Score/Goal</p>
          <p>Automatic</p>
          <p>Points</p>
          <p>Bonus</p>
          <p class="col-span-3 flex items-center">{{ game.homeTeam.tournamentName }}</p>
          <TextInput
              type="number"
              v-model:value="homeTeamScore"/>
          <CheckBox
              v-model:value="homeTeamSetAutomatic"
              class="flex w-full justify-center items-center"
          />
          <TextInput
              type="number"
              v-model:value="homeTeamPoints"
              :disabled="homeTeamSetAutomatic"
              :input-classes="homeTeamSetAutomatic ? 'cursor-not-allowed !bg-gray-100' : ''"
          />
          <CheckBox
              class="flex w-full justify-center items-center"
              v-model:value="homeTeamBonus"
              :disabled="homeTeamSetAutomatic"
              :input-classes="homeTeamSetAutomatic ? '!cursor-not-allowed !opacity-40' : ''"
          />
          <p class="col-span-3 flex items-center">{{ game.guestTeam.tournamentName }}</p>
          <TextInput
              type="number"
              v-model:value="guestTeamScore"/>
          <CheckBox
              v-model:value="guestTeamSetAutomatic"
              class="flex w-full justify-center items-center"
          />
          <TextInput
              type="number"
              v-model:value="guestTeamPoints"
              :disabled="guestTeamSetAutomatic"
              :input-classes="guestTeamSetAutomatic ? 'cursor-not-allowed !bg-gray-100' : ''"
          />
          <CheckBox
              class="flex w-full justify-center items-center"
              v-model:value="guestTeamBonus"
              :disabled="guestTeamSetAutomatic"
              :input-classes="guestTeamSetAutomatic ? '!cursor-not-allowed !opacity-40' : ''"
          />
        </div>
        <CheckBox
            v-model:value="silent"
            label="Do Not notify the match parties"
            class="mt-8"
        />

        <p class="mt-4 text-sm">
          The result can be deleted completely by leaving the fields empty and setting the position points & bonus to
          automatic.
        </p>
      </div>
      <div class="flex gap-6 items-center justify-end mt-auto">
        <BaseButton
            class="text-white font-bold py-2 px-4 rounded-xl"
            type="button"
            @onClick="() => modal=false">
          Cancel
        </BaseButton>
        <BaseButton class="text-white font-bold py-2 px-4 rounded-xl">
          Save
        </BaseButton>
      </div>
    </form>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import BaseButton from "~/components/buttons/BaseButton.vue";
import {useGamesFetch} from "~/composables/useGamesFetch/useGamesFetch";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type {PropType} from "vue";
import type Game from "~/interfaces/games/game";
import Select from "~/components/inputs/Select.vue";
import DatePicker from "~/components/datePicker/DatePicker.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import moment from "moment";
import CheckBox from "~/components/inputs/CheckBox.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  game: {
    type: Object as PropType<Game>,
    required: true
  },
})

const modal = ref(false)
const {saveGameResult} = useGamesFetch()

const homeTeamScore = ref(0)
const guestTeamScore = ref(0)
const homeTeamSetAutomatic = ref(true)
const guestTeamSetAutomatic = ref(true)
const homeTeamPoints = ref(1)
const guestTeamPoints = ref(1)
const homeTeamBonus = ref(false)
const guestTeamBonus = ref(false)
const silent = ref(true)

const emit = defineEmits([
  'update:visible',
  'updated',
])

watch(() => props.visible, async () => {
  if (props.visible) {
    homeTeamScore.value = props.game.pointsHome ?? 0
    guestTeamScore.value = props.game.pointsAway ?? 0
    homeTeamPoints.value = props.game.pointsHome ?? 1
    guestTeamPoints.value = props.game.pointsAway ?? 1
    homeTeamBonus.value = !!props.game.poolBonusFixedHome
    guestTeamBonus.value = !!props.game.poolBonusFixedAway
    homeTeamSetAutomatic.value = (props.game?.pointsHome ? props.game?.pointsHome : 0) > -100
    guestTeamSetAutomatic.value = (props.game?.pointsAway ? props.game?.pointsAway : 0) > -100
  }

  modal.value = props.visible
})

watch([homeTeamScore, homeTeamSetAutomatic], () => {
  if (homeTeamScore.value > guestTeamScore.value) {
    if (homeTeamSetAutomatic.value) {
      homeTeamPoints.value = 2
    } else {
      homeTeamPoints.value = -100
    }
  } else if (homeTeamScore.value < guestTeamScore.value) {
    if (homeTeamSetAutomatic.value) {
      homeTeamPoints.value = 0
    } else {
      homeTeamPoints.value = -100
    }
  } else {
    if (homeTeamSetAutomatic.value) {
      homeTeamPoints.value = 1
    } else {
      homeTeamPoints.value = -100
    }
  }
})

watch([guestTeamScore, guestTeamSetAutomatic], () => {
  if (homeTeamScore.value > guestTeamScore.value) {
    if (guestTeamSetAutomatic.value) {
      guestTeamPoints.value = 0
    } else {
      guestTeamPoints.value = -100
    }
  } else if (homeTeamScore.value < guestTeamScore.value) {
    if (guestTeamSetAutomatic.value) {
      guestTeamPoints.value = 2
    } else {
      guestTeamPoints.value = -100
    }
  } else {
    if (homeTeamSetAutomatic.value) {
      guestTeamPoints.value = 1
    } else {
      guestTeamPoints.value = -100
    }
  }
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

async function save() {
  const res = await saveGameResult(props.game.id, {
    homeScore: homeTeamScore.value,
    guestScore: guestTeamScore.value,
    homeBonus: homeTeamBonus.value,
    guestBonus: guestTeamBonus.value,
    homePoints: homeTeamPoints.value,
    guestPoints: guestTeamPoints.value,
    homeAutomatic: homeTeamSetAutomatic.value,
    guestAutomatic: guestTeamSetAutomatic.value,
    silent: silent.value,
  })

  if (res) {
    modal.value = false
    emit('updated')
  }
}

</script>