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
                       v-model:value="editData.game_dead_line as string"
                       label="Game Deadline"
                       placeholder="Game Deadline"
                       @click.stop.prevent="() => {closeCalendars(); showGameDeadLineCalendar = !showDisabledInputs}"
                       :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default shadow"
                 @click.stop
                 v-if="showGameDeadLineCalendar"
                 style="z-index: 99999 !important; position: absolute !important;">
              <DatePicker v-model:model-value="editData.game_dead_line" color="blue"/>
            </div>

          </div>
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
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 items-center justify-start">
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
          <div class="relative">
            <TextInput :disabled="showDisabledInputs"
                       :value="editData.cm_time_set_until ? moment(editData.cm_time_set_until as string).format('YYYY-MM-DD') : editData.cm_time_set_until"
                       label="TL determine in term until"
                       placeholder="TL determine in term until"
                       @click.stop.prevent="() => {closeCalendars(); showCMTimeSetUntilCalendar = !showDisabledInputs}"
                       :prevent-input="true"
            />
            <div class="absolute top-full left-1/2 -translate-x-1/2 bg-dark-surface-default z-[100] shadow"
                 @click.stop
                 v-if="showCMTimeSetUntilCalendar">
              <DatePicker v-model:model-value="editData.cm_time_set_until" color="blue"/>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 items-center justify-start">
          <TextInput v-model:value="editData.refs_per_game"
                     label="Referees Per Match"
                     :required="true"
                     :disabled="showDisabledInputs"
                     type="number"
                     :min="0"
                     placeholder="Reference Per Match"/>
          <TextInput v-model:value="editData.transportation_fee"
                     label="Transportation Fee"
                     type="number"
                     :disabled="showDisabledInputs"
                     :required="true"
                     :min="0"
                     placeholder="Transportation Fee"/>
        </div>
        <CheckBox :disabled="showDisabledInputs"
                  v-model:value="editData.refs_from_associations"
                  label="Referees From Association"
                  name="refs_from_association"
                  class="mt-4"/>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center justify-start">
          <Select :disabled="showDisabledInputs"
                  :options="courtRequirements"
                  v-model:value="courtRequirement"
                  label="Court Requirement"/>
        </div>
        <div class="flex gap-4 items-center justify-start">
          <Select :disabled="showDisabledInputs"
                  :options="coachLicenseTypes"
                  v-model:value="coachLicenseType"
                  label="Minimum Trainer License"/>
        </div>
        <div class="flex gap-4 items-center justify-start">
          <Select :options="refereeRequirements"
                  v-model:value="refereeRequirement"
                  :disabled="showDisabledInputs"
                  label="Referee Requirement"/>
        </div>
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
import Select from "~/components/inputs/Select.vue";
import CheckBox from "~/components/inputs/CheckBox.vue";
import TextArea from "~/components/inputs/TextArea.vue";
import TextInput from "~/components/inputs/TextInput.vue";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
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

const emit = defineEmits(['unsavedChanges'])

const courtRequirements = [
  {
    label: 'League / Div',
    value: 1,
    disabled: false
  },
  {
    label: 'Landst. Youth',
    value: 2,
    disabled: false
  },
  {
    label: 'Other ranges',
    value: 3,
    disabled: false
  },
  {
    label: 'Mini',
    value: 4,
    disabled: false
  },
] as Array<SelectOptions>

const coachLicenseTypes = [
  {
    label: '-- none --',
    value: 0,
    disabled: false
  },
  {
    label: 'M - License',
    value: 1,
    disabled: false
  },
  {
    label: 'B - License',
    value: 2,
    disabled: false
  },
  {
    label: 'T - License',
    value: 3,
    disabled: false
  },
] as Array<SelectOptions>


const refereeRequirements = [
  {
    label: 'No',
    value: 0,
    disabled: false
  },
  {
    label: '1: BL and National Cup Men',
    value: 1,
    disabled: false
  },
  {
    label: "2: KBL and Women's National Cup",
    value: 2,
    disabled: false
  },
  {
    label: '3: 1.Div and U19 Leagues',
    value: 3,
    disabled: false
  },
  {
    label: '4: 2.Div Men, U17 Leagues, U15 Champion and Youth Cup',
    value: 4,
    disabled: false
  },
  {
    label: '5: 3.Div Men, 2.Div Ladies and U13 Champion',
    value: 5,
    disabled: false
  },
  {
    label: '6: Series, A ranks and U13 Champion',
    value: 6,
    disabled: false
  },
  {
    label: '7: Wheelchair',
    value: 7,
    disabled: false
  },
] as Array<SelectOptions>

const courtRequirement = ref({} as SelectOptions)
const coachLicenseType = ref({} as SelectOptions)
const showRegistrationDeadlineCalendar = ref(false)
const showCMTimeSetUntilCalendar = ref(false)
const showGameDeadLineCalendar = ref(false)
const showFreeRescheduleCalendar = ref(false)
const startTimeError = ref('')
const endTimeError = ref('')
const refereeRequirement = ref({} as SelectOptions)

const editData = ref({} as TournamentConfigs)

watch(() => props.data, () => {
  editData.value = {...props.data}

  if (editData.value.court_requirement_id) {
    courtRequirement.value = courtRequirements.find(requirement => {
      return requirement.value === editData.value.court_requirement_id
    }) as SelectOptions
  }

  if (editData.value.ref_prio || editData.value.ref_prio === 0) {
    refereeRequirement.value = refereeRequirements.find(refereeRequirement => refereeRequirement.value === editData.value.ref_prio) as SelectOptions
  }

  if (editData.value?.coach_license_type_id || editData.value?.coach_license_type_id === 0) {
    coachLicenseType.value = coachLicenseTypes.find(licenseType => {
      return licenseType.value === editData.value.coach_license_type_id
    }) as SelectOptions
  } else {
    coachLicenseType.value = coachLicenseTypes[0] as SelectOptions
  }

  if (editData.value?.registration_dead_line) {
    editData.value.registration_dead_line = moment(editData.value.registration_dead_line as string).format('YYYY-MM-DD')
  }
  if (editData.value?.cm_time_set_until) {
    editData.value.cm_time_set_until = editData.value.cm_time_set_until as String
  }
  if (editData.value?.free_reschedule_until_date) {
    editData.value.free_reschedule_until_date = moment(editData.value.free_reschedule_until_date as string).format('YYYY-MM-DD')
  }
  if (editData.value?.game_dead_line) {
    editData.value.game_dead_line = moment(editData.value.game_dead_line as string).format('YYYY-MM-DD')
  }

}, {
  deep: true,
  immediate: true
})

watch(() => coachLicenseType.value, () => {
  if (editData.value) {
    editData.value.coach_license_type_id = coachLicenseType.value?.value as typeof editData.value.coach_license_type_id
  }
})

watch(() => courtRequirement.value, () => {
  if (courtRequirement.value?.value) {
    editData.value.court_requirement_id = courtRequirement.value.value as typeof editData.value.court_requirement_id
  }
})

watch(() => refereeRequirement.value, () => {
  if (refereeRequirement.value?.value) {
    editData.value.ref_prio = refereeRequirement.value.value as typeof editData.value.ref_prio
  }
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
    } else if(editData.value.latest_start && endTimeError.value !== errorMessage) {
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

watch([
  editData
], () => {
  if (JSON.stringify(editData.value) !== JSON.stringify(props.data)) {
    emit('unsavedChanges', true)
  }
}, {
  deep: true,
  immediate: true
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

  if(date1 > date2) {
    startTimeError.value = 'Earliest start time should be earlier.'
    endTimeError.value = 'Latest start time should be later.'
  }
}

function resetForm() {
  editData.value = {
    registration_dead_line: null,
    game_dead_line: null,
    free_reschedule_until_date: null,
    cm_time_set_until: null
  } as TournamentConfigs

  courtRequirement.value = {} as SelectOptions
  coachLicenseType.value = {} as SelectOptions
  showRegistrationDeadlineCalendar.value = false
  showCMTimeSetUntilCalendar.value = false
  showGameDeadLineCalendar.value = false
  showFreeRescheduleCalendar.value = false
  startTimeError.value = ''
  endTimeError.value = ''
}

function closeCalendars() {
  showRegistrationDeadlineCalendar.value = false
  showCMTimeSetUntilCalendar.value = false
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
