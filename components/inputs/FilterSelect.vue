<template>
  <SelectMultiple
      v-model:value="inputValue"
      :options="options"
      :multiple="false"
      :close-on-select="true"
      placeholder=""
      class="!w-64 cursor-pointer"
      select-label=""
      deselect-label=""
      selected-label=""
  />
</template>

<script setup lang="ts">

import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type {PropType} from "vue";
import SelectMultiple from "~/components/inputs/SelectMultiple.vue";

const props = defineProps({
  value: {
    type: Object as PropType<SelectOptions>,
    required: true
  },
  options: {
    type: Array<SelectOptions>,
    required: true,
  },
  direction: {
    type: String,
    default: 'bottom',
  },
  label: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disableAutoSelect: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:value'])
const selectOptions = ref([] as Array<SelectOptions>)

const inputValue = ref({} as SelectOptions)

watch(() => props.value, () => {
  inputValue.value = props.value
}, {deep: true, immediate: true})

watch(inputValue, () => {
  emit('update:value', inputValue.value)
})

watch(() => props.options, () => {
  if (props.options?.length === 1 && !props.disableAutoSelect) {
    setOption(props.options[0])
    selectOptions.value = props.options;
  } else if (props.options?.length > 1 || (props.options?.length === 1 && props.disableAutoSelect)) {
    selectOptions.value = props.direction === 'top' ? props.options.toReversed() : props.options
  }
}, {
  deep: true,
  immediate: true
})

function setOption(optionValue: SelectOptions) {
  if (!optionValue.disabled) {
    emit('update:value', optionValue)
  }
}
</script>