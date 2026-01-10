<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_game_time_edit">
    <form class="p-4 min-h-[70vh] flex flex-col justify-between" @submit.prevent="() => save()">
      <div>
        <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
        <p class="font-bold my-5 text-lg">
          Edit Time and Place
        </p>
        <Select :options="courtOptions" v-model:value="selectedCourt" label="Court" class="mb-4" ref="courtSelect"/>
        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <TextInput
                v-model:value="date"
                label="Date"
                placeholder="Date"
                @click.stop.prevent="() => {closeSelects(); showDateCalendar = true}"
                :prevent-input="true"
                :required="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showDateCalendar"
                 style="z-index: 99999 !important; position: absolute !important;">
              <DatePicker v-model:model-value="date" color="blue" :min-date="minDate"/>
            </div>
          </div>
          <div>
            <TextInput v-model:value="time"
                       label="Time"
                       :required="true"
                       placeholder="Time"/>
            <p v-if="timeError" class="text-xs text-red-500">
              {{ timeError }}
            </p>
          </div>
        </div>
        <font-awesome
            v-if="checkLoading"
            :icon="['fas', 'spinner']"
            class="fa-spin text-2xl"
        />
        <div v-html="checks" class="mt-4" v-else/>
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
const {fetchCourts, checkGame, saveDateAndCourt} = useGamesFetch()
const courtOptions = ref([{
  label: '--- select venue ---',
  value: null,
  disabled: false
}] as Array<SelectOptions>)
const selectedCourt = ref({} as SelectOptions)
const courtSelect = ref<InstanceType<typeof Select> | null>(null)
const showDateCalendar = ref(false)
const date = ref()
const time = ref()
const timeError = ref('')
const checks = ref('')
const checkLoading = ref(false)

const emit = defineEmits([
  'update:visible',
  'updated',
])

watch(() => props.visible, async () => {
  if (props.visible) {
    await fetchAvailableCourts()
    if (props.game.time) {
      time.value = moment(props.game.time, 'HH:mm').format('HH:mm')
    }

    if (props.game.date) {
      date.value = props.game.date
    }
  }

  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    checks.value = ''
    time.value = ''
    selectedCourt.value = courtOptions.value[0]
    emit('update:visible', false)
  }
})

watch(() => time.value, (newVal, oldVal) => {
  if (newVal && oldVal && newVal.length > oldVal.length && newVal.length === 2) {
    time.value += ':'
    return
  }
  timeError.value = ''
  if (time.value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(time.value as string)) {
      timeError.value = errorMessage
    }
  }
})

watch(() => [date.value, time.value, selectedCourt.value?.value, props.game?.home_team?.id, props.game?.guest_team?.id], async () => {
  if (date.value && time.value && selectedCourt.value?.value && !timeError.value) {
    checks.value = ''
    checkLoading.value = true
    const res = await checkGame(props.game?.id, {time: moment(time.value, 'HH:mm').format('HH:mm'), date: date.value, court_id: selectedCourt.value.value})

    let checkHeader = ''
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
}, {
  deep: true,
  immediate: true
})

const minDate = computed(() => {
  if (moment(props.game.tournament.start_date).isBefore(moment())) {
    return moment().format('DD-MMM-YYYY')
  }
  return moment(props.game?.tournament.start_date).format('DD-MMM-YYYY')
})

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

async function fetchAvailableCourts() {
  const res = await fetchCourts(props.game.id)

  res.home_team_courts.map(court => {
    courtOptions.value.push({
      label: `${court.venue?.name} ${court.name} `,
      value: court.id,
      disabled: false
    })
  })

  if (res.guest_team_courts.length) {
    courtOptions.value.push({
      label: '--- The guest team courts can be seen below if you want to play there ---',
      value: 0,
      disabled: true
    })

    res.guest_team_courts.map(court => {
      courtOptions.value.push({
        label: `${court.venue?.name} ${court.name} `,
        value: court.id,
        disabled: false
      })
    })
  }

  if (res.additional_courts.length) {
    courtOptions.value.push({
      label: '--- The other courts of the association ---',
      value: -1,
      disabled: true
    })

    res.additional_courts.map(court => {
      courtOptions.value.push({
        label: `${court.venue?.name} ${court.name} `,
        value: court.id,
        disabled: false
      })
    })
  }

  selectedCourt.value = courtOptions.value.find(option => option.value === props.game?.court_id) as SelectOptions
}

function closeSelects() {
  if (courtSelect.value) {
    courtSelect.value.closeDropdown()
  }
  showDateCalendar.value = false
}

async function save() {
  if (timeError.value) {
    return
  }
  const res = await saveDateAndCourt(props.game.id, {
    date: date.value,
    time: time.value,
    court_id: selectedCourt.value.value,
  })

  if (res) {
    modal.value = false
    emit('updated')
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_game_time_edit')
  if (modal) {
    modal.addEventListener('click', () => closeSelects())
  }
})

</script>