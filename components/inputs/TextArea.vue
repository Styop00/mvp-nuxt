<template>
  <label class="flex flex-col text-sm font-inter-medium text-text-primary">
    {{ props.label }}
    <textarea
        :placeholder="props.placeholder"
        class="px-3 py-2.5 border w-full rounded-lg bg-bg-primary border-border-default text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 resize-none small-scrollbar placeholder:text-text-tertiary placeholder:text-xs hover:border-border-light hover:shadow-sm"
        :class="props.inputClasses"
        v-model="inputValue"
        :name="name"
        :required="required"
        :disabled="disabled"
        :rows="rows"
    />
  </label>
</template>

<script setup lang="ts">
const props = defineProps({
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
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 4
  }
})
const emit = defineEmits(['update:value'])

const inputValue = toRef(props.value)

watch(() => props.value, () => {
  inputValue.value = props.value
}, {deep: true, immediate: true})

watch(inputValue, () => {
  if (inputValue.value !== props.value) {
    emit('update:value', inputValue.value)
  }
})
</script>

<style scoped>

</style>