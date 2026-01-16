<template>
  <BaseModalComponent v-model:visible="modal" :width="4" title="Set Match Result">
    <form class="p-4 min-h-[70vh] flex flex-col justify-between" @submit.prevent="() => save()">
      <div>
        <div class="grid grid-cols-7 gap-4">
          <p class="col-span-3 text-dark-text-primary">Team</p>
          <p class="text-dark-text-primary">Score/Goal</p>
          <p class="text-dark-text-primary">Automatic</p>
          <p class="text-dark-text-primary">Points</p>
          <p class="text-dark-text-primary">Bonus</p>
          <p class="col-span-3 flex items-center text-dark-text-primary">{{ game.home_team.tournament_name }}</p>
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
              :input-classes="homeTeamSetAutomatic ? 'cursor-not-allowed !bg-dark-bg-secondary opacity-50' : ''"
          />
          <CheckBox
              class="flex w-full justify-center items-center"
              v-model:value="homeTeamBonus"
              :disabled="homeTeamSetAutomatic"
              :input-classes="homeTeamSetAutomatic ? '!cursor-not-allowed !opacity-40' : ''"
          />
          <p class="col-span-3 flex items-center text-dark-text-primary">{{ game.guest_team.tournament_name }}</p>
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
              :input-classes="guestTeamSetAutomatic ? 'cursor-not-allowed !bg-dark-bg-secondary opacity-50' : ''"
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

        <p class="mt-4 text-sm text-dark-text-secondary">
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
    homeTeamScore.value = props.game.points_home ?? 0
    guestTeamScore.value = props.game.points_away ?? 0
    homeTeamPoints.value = props.game.points_home ?? 1
    guestTeamPoints.value = props.game.points_away ?? 1
    homeTeamBonus.value = !!props.game.bonus_fixed_home
    guestTeamBonus.value = !!props.game.bonus_fixed_away
    homeTeamSetAutomatic.value = (props.game?.points_home ? props.game?.points_home : 0) > -100
    guestTeamSetAutomatic.value = (props.game?.points_away ? props.game?.points_away : 0) > -100
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