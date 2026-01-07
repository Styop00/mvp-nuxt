<template>
  <BaseModalComponent v-model:visible="modal" :width="4" name="_reservation">
    <div class="p-4">
      <font-awesome :icon="['fas', 'xmark']" @click="() => modal=false" class="cursor-pointer ml-auto block"/>
      <p class="font-bold mb-5 border-b">
        {{ reservationId ? 'Update Reservation' : 'Reserve' }}
      </p>
      <form action="#"
            class="min-h-[60vh] flex flex-col justify-between"
            @submit.prevent="createOrUpdate">
        <div>
          <div class="flex flex-col gap-3">
            <div class="grid-cols-1 sm:grid-cols-2 grid gap-8">
              <div>
                <Select v-model:value="type"
                        label="Type"
                        :required="true"
                        :options="reservationTypes"
                />
                <p v-show="typeError" class="text-xs text-red-500">
                  {{ typeError }}
                </p>
              </div>
              <div>
                <Select v-model:value="ageGroup"
                        label="Age Group"
                        :required="true"
                        :options="ageOptions"
                />
              </div>
            </div>
            <div class="grid-cols-1 sm:grid-cols-2 grid gap-8">
              <div>
                <TextInput v-model:value="startTime"
                           label="Start Time"
                           :required="true"
                           placeholder="Start Time"
                />
                <p v-if="startTimeError" class="text-xs text-red-500">
                  {{ startTimeError }}
                </p>
              </div>
              <div>
                <TextInput v-model:value="endTime"
                           label="End Time"
                           :required="true"
                           placeholder="End Time"
                />
                <p v-if="endTimeError" class="text-xs text-red-500">
                  {{ endTimeError }}
                </p>
              </div>
            </div>
            <TextArea
                v-model:value="description"
                label="Description"
            />
          </div>
        </div>
        <div>
          <p v-if="error" class="text-center text-xs text-red-500">
            {{ error }}
          </p>
          <BaseButton class="!py-2 block my-5 mt-10 mx-auto">
            {{ reservationId ? 'Update' : 'Reserve' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">

import BaseButton from "~/components/buttons/BaseButton.vue";
import BaseModalComponent from "~/components/modals/BaseModalComponent.vue";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import TextInput from "~/components/inputs/TextInput.vue";
import moment from "moment";
import Select from "~/components/inputs/Select.vue";
import {ageGroups} from "~/constants/ageGroups";
import {useReservationsFetch} from "~/composables/useReservationsFetch/useReservationsFetch";
import TextArea from "~/components/inputs/TextArea.vue";
import type {PropType} from "vue";
import type TimeSlot from "~/interfaces/timeSlots/timeSlot";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  reservationId: {
    type: Number,
    default: 0
  },
  timeSlot: {
    type: {} as PropType<TimeSlot>,
    required: true
  }
})

const {fetchReservationTypes, fetchReservationById, createReservation, updateReservation} = useReservationsFetch()

const modal = ref(false)
const reservationTypes = ref([] as Array<SelectOptions>)
const type = ref({} as SelectOptions)
const ageGroup = ref({} as SelectOptions)
const startTime = ref('')
const endTime = ref('')
const description = ref('')
const error = ref('')

const startTimeError = ref('')
const endTimeError = ref('')
const typeError = ref('')

const emit = defineEmits([
  'update:visible',
  'update:reservationId',
  'reFetch'
])

watch(() => props.visible, async () => {
  if (props.visible) {
    await fetchData()
  } else {
    startTime.value = ''
    endTime.value = ''
    typeError.value = ''
    description.value = ''
    error.value = ''
  }

  if (props.reservationId) {
    await fetchReservation()
  }
  modal.value = props.visible
})

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:reservationId', 0)
    emit('update:visible', false)
  }
})


watch(() => startTime.value, (newVal, oldVal) => {
  if (newVal.length > oldVal.length && newVal.length === 2) {
    startTime.value += ':'
    return
  }
  startTimeError.value = '';
  if (startTime.value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(startTime.value as string)) {
      startTimeError.value = errorMessage
    } else if (startTime.value && endTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch(() => endTime.value, (newVal, oldVal) => {
  if (newVal.length > oldVal.length && newVal.length === 2) {
    endTime.value += ':'
    return
  }
  endTimeError.value = ''
  if (endTime.value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(endTime.value as string)) {
      endTimeError.value = errorMessage
    } else if (endTime.value && startTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch([startTime, endTime, startTimeError, endTimeError], () => {
  error.value = ''
  if (startTimeError.value || endTimeError.value) {
    return
  }

  if (moment(startTime.value, 'HH:mm').isBefore(moment(props.timeSlot?.startTime as string, 'HH:mm'))) {
    startTimeError.value = `Time should be later than ${moment(props.timeSlot?.startTime + '', 'HH:mm').format('HH:mm')}`;
  } else if (moment(props.timeSlot?.endTime as string, 'HH:mm').isBefore(moment(startTime.value, 'HH:mm'))) {
    startTimeError.value = `Time should be earlier than ${moment(props.timeSlot?.endTime + '', 'HH:mm').format('HH:mm')}`;
  } else if (moment(endTime.value, 'HH:mm').isBefore(moment(props.timeSlot?.startTime as string, 'HH:mm'))) {
    endTimeError.value = `Time should be later than ${moment(props.timeSlot?.startTime + '', 'HH:mm').format('HH:mm')}`;
  } else if (moment(props.timeSlot?.endTime as string, 'HH:mm').isBefore(moment(endTime.value, 'HH:mm'))) {
    endTimeError.value = `Time should be earlier than ${moment(props.timeSlot?.endTime + '', 'HH:mm').format('HH:mm')}`;
  }
})

const ageOptions = computed(() => {
  return [
    {
      label: 'All',
      value: null,
      disabled: false
    },
    ...ageGroups
  ]
})

function compareTimes() {
  if (!endTime.value || !startTime.value) {
    return
  }
  startTimeError.value = '';
  endTimeError.value = '';

  const referenceDate = new Date();

  const date1 = new Date(referenceDate);
  const date2 = new Date(referenceDate);

  const [hours1, minutes1] = startTime.value.split(':').map(Number);
  const [hours2, minutes2] = endTime.value.split(':').map(Number);

  date1.setHours(hours1, minutes1, 0, 0);
  date2.setHours(hours2, minutes2, 0, 0);

  if (date1 > date2) {
    startTimeError.value = 'Start time should be earlier than end time.'
    endTimeError.value = 'End time should be later than start time.'
  }
}

async function fetchData() {
  const res = await fetchReservationTypes()
  reservationTypes.value = res.map((type => {
    return {
      label: type.text,
      value: type.id,
      disabled: false,
    }
  }))
  reservationTypes.value.unshift({
    label: '---select---',
    value: null,
    disabled: false
  })
  type.value = reservationTypes.value[0]

  ageGroup.value = ageOptions.value[0]
}

async function fetchReservation() {
  const res = await fetchReservationById(props.reservationId)
  startTime.value = moment(res.startTime as string, 'HH:mm').format('HH:mm');
  endTime.value = moment(res.endTime as string, 'HH:mm').format('HH:mm');
  description.value = res.text

  const age = ageOptions.value.find(group => group.value === res.ageGroup)
  if (age) {
    ageGroup.value = age
  }

  const reservationType = reservationTypes.value.find(type => type.value === res.typeId)
  if (reservationType) {
    type.value = reservationType
  }
}

async function createOrUpdate() {
  if (startTimeError.value || endTimeError.value) return

  typeError.value = ''
  if (!type.value?.value) {
    typeError.value = 'Reservation type is required.'
    return;
  }

  if (props.reservationId) {
    const res = await updateReservation(props.reservationId, {
      startTime: startTime.value,
      endTime: endTime.value,
      typeId: type.value.value,
      ageGroup: ageGroup.value.value,
      text: description.value,
      timeSlotId: props.timeSlot?.id,
    })

    if (res?.name === 'Error') {
      error.value = res.message
    } else {
      modal.value = false
      emit('reFetch')
    }
  } else {
    const res = await createReservation({
      startTime: startTime.value,
      endTime: endTime.value,
      typeId: type.value.value,
      ageGroup: ageGroup.value.value,
      text: description.value,
      timeSlotId: props.timeSlot?.id,
    })

    if (res?.name === 'Error') {
      error.value = res.message
    } else {
      modal.value = false
      emit('reFetch')
    }
  }
}

function closeDropdowns() {
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.click()
  }
}

onMounted(() => {
  const modal = document.querySelector('#modal-body_reservation')
  if (modal) {
    modal.addEventListener('click', () => closeDropdowns())
  }
})
</script>