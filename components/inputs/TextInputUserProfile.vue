<template>
  <label class="flex flex-col ">
    <span class="text-[12.8px] mb-2.5 font-inter-medium flex gap-1"
      >{{ props.label }}
      <span
        v-if="props.label === 'Email' || props.label === 'Name'"
        class="text-red-600"
        >*</span
      ></span
    >
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      class="px-3 py-2.5 border min-h-11 rounded-lg bg-bg-primary border-border-default text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 placeholder:text-text-tertiary placeholder:text-xs hover:border-border-light hover:shadow-sm w-2/3"
      :class="props.inputClasses"
      v-model="inputValue"
      :name="name"
      :required="required"
      :autocomplete="props.autocomplete"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    required: true
  },
  inputClasses: {
    type: String,
    defaultValue: ''
  },
  name: {
    type: String,
    defaultValue: ''
  },
  required: {
    type: Boolean,
    defaultValue: false
  },
  autocomplete: {
    type: String,
  }
})
const emit = defineEmits(['update:value'])

const inputValue = toRef(props.value)
const initialValue = toRef(props.value)

watch(initialValue, () => {
  inputValue.value = initialValue.value
}, {deep: true, immediate: true})

watch(() => props.value, () => {
  if (props.value !== initialValue.value) {
    initialValue.value = props.value
  }
})

watch(inputValue, (value, oldValue) => {
  if (value || oldValue) {
    emit('update:value', inputValue.value)
  }
})
</script>
