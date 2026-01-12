<template>
  <div>
    <input
        type="checkbox"
        class="form-check-input"
        :class="props.inputClasses"
        v-model="inputValue"
        :id="'checkbox_input_' + name"
        :disabled="disabled"
    />
    <label class="ml-3" :for="'checkbox_input_' + name">
      {{ props.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: Boolean || Number,
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
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:value'])

const inputValue = toRef(props.value)
const initialValue = toRef(props.value)

watch(initialValue, () => {
  inputValue.value = !!initialValue.value
}, {deep: true, immediate: true})

watch(() => props.value, () => {
  if (props.value !== initialValue.value) {
    initialValue.value = !!props.value
  }
})

watch(inputValue, (value, oldValue) => {
  if (value || oldValue) {
    emit('update:value', inputValue.value)
  }
})
</script>

<style scoped>
.form-check-input {
  flex-shrink: 0;
  width: 1.125em;
  height: 1.125em;
  margin-block-start: 0.25em;
  vertical-align: top;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: var(--bs-form-check-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: var(--color-surface-default);
  border: 2px solid var(--color-border-default);
  border-radius: 0.375rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  cursor: pointer;
  transition: all 200ms;
}

.form-check-input:hover {
  border-color: var(--color-border-light);
  background-color: var(--color-bg-hover);
}

.form-check-input:focus {
  border-color: var(--tw-brand-primary, #6366F1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  outline: none;
}

.form-check-input[type=checkbox] {
  border-radius: 0.375rem;
}

.form-check-input:checked {
  background-color: var(--tw-brand-primary, #6366F1);
  border-color: var(--tw-brand-primary, #6366F1);
}

.form-check-input:checked:hover {
  background-color: var(--tw-brand-hover, #818CF8);
  border-color: var(--tw-brand-hover, #818CF8);
}

.form-check-input:checked[type=checkbox] {
  --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}

.form-check-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-surface-default);
  border-color: var(--color-border-default);
}

label {
  color: var(--color-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
}

</style>