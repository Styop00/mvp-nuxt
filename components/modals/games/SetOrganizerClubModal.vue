<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_game_organizer_edit">
    <form class="p-4 min-h-[50vh] flex flex-col justify-between" @submit.prevent="() => save()">
      <div>
        <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
        <p class="font-bold my-5 text-lg">
          Edit Organizer club
        </p>
        <Select :options="clubOptions" v-model:value="selectedClub" label="Organizer club" class="mb-4"
                ref="clubSelect"/>
        <CheckBox
            v-model:value="isForWhole"
            label="Bet on all the matches in the group.
                   ATTENTION!! should only be done at round"
            name="isForWhole"
            class="mt-4"/>
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
import {useClubsFetch} from "~/composables/useClubsFetch/useClubsFetch";
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
const {saveOrganizerClub} = useGamesFetch()
const {fetchAllClubs} = useClubsFetch()

const clubOptions = ref([] as Array<SelectOptions>)
const selectedClub = ref({} as SelectOptions)
const clubSelect = ref<InstanceType<typeof Select> | null>(null)
const isForWhole = ref(false)

const emit = defineEmits([
  'update:visible',
  'updated',
])

watch(() => props.visible, () => {
  modal.value = props.visible
  if (modal.value) {
    fetchAvailableClubs()
  }
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false)
  }
})

async function fetchAvailableClubs() {
  const res = await fetchAllClubs({ seasonSportId: props.game.seasonSportId })

  clubOptions.value = []
  clubOptions.value.push({
    label: '--- home team ---',
    disabled: false,
    value: props.game.homeTeam?.clubId ? props.game.homeTeam?.clubId : 0,
  });

  clubOptions.value.push({
    label: '--- away team ---',
    disabled: false,
    value: props.game.guestTeam?.clubId ? props.game.guestTeam?.clubId : 0,
  })

  res.map((club) => {
    if (club.id !== props.game.guestTeam?.clubId && club.id !== props.game.homeTeam?.clubId) {
      clubOptions.value.push({
        label: club.name,
        disabled: false,
        value: club.id,
      })
    }
  })

  const organizerClub = clubOptions.value.find(option => option.value === props.game.organizer_club_id)

  if (organizerClub) {
    selectedClub.value = organizerClub as SelectOptions
  } else {
    selectedClub.value = clubOptions.value[0]
  }
}

function closeSelects() {
  if (clubSelect.value) {
    clubSelect.value.closeDropdown()
  }
}

async function save() {
  const res = await saveOrganizerClub(props.game.id, {
    clubId: selectedClub.value.value,
    forWholeGroup: isForWhole.value
  })

  if (res) {
    modal.value = false
    emit('updated')
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_game_organizer_edit')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
})

</script>