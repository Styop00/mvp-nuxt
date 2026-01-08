<template>
  <label class="flex flex-col text-sm">
    <span class="font-inter-medium flex gap-1 text-dark-text-primary"
    >
      {{ label }}
      <span v-if="required && label"
            class="text-red-500"
      >
        *
      </span>
    </span
    >
    <input
        :type="type"
        :placeholder="placeholder"
        class="px-3 py-2.5 border min-h-11 w-full rounded-lg bg-dark-bg-primary border-dark-border-default text-sm text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all duration-200 placeholder:text-dark-text-tertiary placeholder:text-xs hover:border-dark-border-light hover:shadow-sm"
        :class="inputClasses"
        v-model="inputValue"
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        :disabled="disabled"
        @keydown="(e) => {if(preventInput) e.preventDefault()}"
        @focusout="emit('focus-out')"
        :min="+min"
        :max="+max"
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
    type: [String, Number, null],
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
  },
  disabled: {
    type: Boolean,
    defaultValue: false
  },
  preventInput: {
    type: Boolean,
    defaultValue: false
  },
  min: {
    type: Number,
    defaultValue: null
  },
  max: {
    type: Number,
    defaultValue: null
  }
})
const emit = defineEmits(['update:value', 'focus-out'])

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
