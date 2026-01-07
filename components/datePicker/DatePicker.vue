<template>
  <VCalendarDatePicker
    v-model="date"
    v-bind="{ ...attrs, ...$attrs }"
    :min-date="minDate"
    :max-date="maxDate"
  />
</template>

<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import type {PropType} from "vue";
import type {DatePickerDate, DatePickerRangeObject} from "~/node_modules/v-calendar/src/use/datePicker";
import moment from "moment";

const props = defineProps({
  modelValue: {
    type: [Date, Object, String] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  minDate: {
    type: [Date, Object, String] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  },
  maxDate: {
    type: [Date, Object, String] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
     if (value === "") {
      emit('update:model-value', "")
    } else {
      emit('update:model-value', moment(value).format(props.format))
    }
    emit('close')

  }
})

const attrs = {
  transparent: true,
  borderless: true,
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}
</script>
