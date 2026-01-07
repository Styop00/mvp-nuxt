<template>
  <VCalendarDatePicker v-model.range="range" v-bind="{ ...attrs, ...$attrs }" :min-date="minDate" :max-date="maxDate"/>
</template>

<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import type {PropType} from "vue";
import type {DatePickerDate, DatePickerRangeObject} from "~/node_modules/v-calendar/src/use/datePicker";
import moment from "moment";

const props = defineProps({
  modelValue: {
    type: Array<DatePickerDate | DatePickerRangeObject | String | null>,
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

const range = computed({
  get: () => {
    return props.modelValue?.length === 2 ? {start: props.modelValue[0], end: props.modelValue[1]} : props.modelValue
  },
  set: (value: {start: Date, end: Date}) => {
    emit('update:model-value', [moment(value.start).format(props.format), moment(value.end).format(props.format)])
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

