<template>
  <div class="p-0 lg:p-4">
    <div class="grid-cols-1 grid lg:grid-cols-2 gap-8">
      <div class="flex flex-col gap-4">
        <TextInput v-model:value="editData.name as string"
                   label="Name"
                   :disabled="showDisabledInputs"
                   :required="true"
                   placeholder="Name"/>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 items-center justify-start">
          <div class="relative">
            <TextInput :disabled="showDisabledInputs"
                       v-model:value="editData.registration_dead_line"
                       label="Registration Deadline"
                       placeholder="Registration Deadline"
                       @click.stop.prevent="() => {closeCalendars(); showRegistrationDeadlineCalendar = !showDisabledInputs}"
                       :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow" @click.stop
                 v-if="showRegistrationDeadlineCalendar">
              <DatePicker v-model:model-value="editData.registration_dead_line" color="blue"/>
            </div>
          </div>
          <div class="relative">
            <TextInput :disabled="showDisabledInputs"
                       v-model:value="editData.free_reschedule_until_date"
                       label="Free movement until"
                       placeholder="Free movement until"
                       @click.stop.prevent="() => {closeCalendars(); showFreeRescheduleCalendar = !showDisabledInputs}"
                       :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                 @click.stop
                 v-if="showFreeRescheduleCalendar">
              <DatePicker v-model:model-value="editData.free_reschedule_until_date" color="blue"/>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 items-start justify-start">
          <div>
            <TextInput v-model:value="editData.earliest_start as string"
                       label="Earliest Start"
                       :required="true"
                       :disabled="showDisabledInputs"
                       placeholder="Earliest Start"/>
            <p v-if="startTimeError" class="text-xs text-red-500">
              {{ startTimeError }}
            </p>
          </div>
          <div>
            <TextInput v-model:value="editData.latest_start as string"
                       label="Latest Start"
                       :required="true"
                       :disabled="showDisabledInputs"
                       placeholder="Latest Start"/>
            <p v-if="endTimeError" class="text-xs text-red-500">
              {{ endTimeError }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center justify-start">
          <TextInput
              type="number"
              v-model:value="editData.expected_duration_minutes"
              :disabled="showDisabledInputs"
              :required="true"
              :min="0"
              label="Expected Match Duration In Minutes"/>
          <TextInput
              type="number"
              v-model:value="editData.minimum_warmup_minutes"
              :disabled="showDisabledInputs"
              :required="true"
              :min="0"
              label="Minimum Warmup Minutes"/>
        </div>
      </div>
    </div>
    <TextArea :disabled="showDisabledInputs"
              v-model:value="editData.information"
              label="Public Information"
              class="mt-8"/>
  </div>
</template>

<script setup lang="ts">
import DatePicker from "~/components/datePicker/DatePicker.vue";
import TextArea from "~/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import moment from "moment/moment";

const props = defineProps({
  data: {
    type: Object as () => TournamentConfigs,
    default: {}
  },
  showDisabledInputs: {
    type: Boolean,
    default: false,
  }
})

const showRegistrationDeadlineCalendar = ref(false)
const showGameDeadLineCalendar = ref(false)
const showFreeRescheduleCalendar = ref(false)
const startTimeError = ref('')
const endTimeError = ref('')

const editData = ref({} as TournamentConfigs)

watch(() => props.data, () => {
  editData.value = {...props.data}

  if (editData.value?.registration_dead_line) {
    editData.value.registration_dead_line = moment(editData.value.registration_dead_line as string).format('YYYY-MM-DD')
  }
  if (editData.value?.free_reschedule_until_date) {
    editData.value.free_reschedule_until_date = moment(editData.value.free_reschedule_until_date as string).format('YYYY-MM-DD')
  }

}, {
  deep: true,
  immediate: true
})

watch(() => editData.value.earliest_start, (newVal, oldVal) => {
  if (oldVal && newVal && newVal?.length > oldVal?.length && newVal?.length === 2) {
    editData.value.earliest_start += ':'
    return
  }
  startTimeError.value = '';
  if (editData.value.earliest_start) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(editData.value.earliest_start as string)) {
      startTimeError.value = errorMessage
    } else if (editData.value.latest_start && endTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

watch(() => editData.value.latest_start, (newVal, oldVal) => {
  if (oldVal && newVal && newVal?.length > oldVal?.length && newVal?.length === 2) {
    editData.value.latest_start += ':'
    return
  }
  endTimeError.value = ''
  if (editData.value.latest_start) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const errorMessage = "Time is not valid. Please use time format like '00:00'.";
    if (!timeRegex.test(editData.value.latest_start as string)) {
      endTimeError.value = errorMessage
    } else if (editData.value.earliest_start && startTimeError.value !== errorMessage) {
      compareTimes()
    }
  }
})

function compareTimes() {
  if (!editData.value.latest_start || !editData.value.earliest_start) {
    return
  }
  startTimeError.value = '';
  endTimeError.value = '';

  const referenceDate = new Date();

  const date1 = new Date(referenceDate);
  const date2 = new Date(referenceDate);

  const [hours1, minutes1] = editData.value.earliest_start.split(':').map(Number);
  const [hours2, minutes2] = editData.value.latest_start.split(':').map(Number);

  date1.setHours(hours1, minutes1, 0, 0);
  date2.setHours(hours2, minutes2, 0, 0);

  if (date1 > date2) {
    startTimeError.value = 'Earliest start time should be earlier.'
    endTimeError.value = 'Latest start time should be later.'
  }
}

function resetForm() {
  editData.value = {
    registration_dead_line: null,
    free_reschedule_until_date: null,
  } as TournamentConfigs

  showRegistrationDeadlineCalendar.value = false
  showGameDeadLineCalendar.value = false
  showFreeRescheduleCalendar.value = false
  startTimeError.value = ''
  endTimeError.value = ''
}

function closeCalendars() {
  showRegistrationDeadlineCalendar.value = false
  showFreeRescheduleCalendar.value = false
  showGameDeadLineCalendar.value = false
}

defineExpose({
  resetForm,
  closeCalendars,
  editData,
  startTimeError,
  endTimeError
})

</script>
