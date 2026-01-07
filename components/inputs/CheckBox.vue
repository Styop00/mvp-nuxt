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
  --bs-form-check-bg: #fff;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  margin-block-start: 0.25em;
  vertical-align: top;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: var(--bs-form-check-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid gray;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  cursor: pointer;
}

.form-check-input[type=checkbox] {
  border-radius: 0.25em;
}

.form-check-input:checked {
  background-color: #111c43;
  border-color: #0d6efd;
}

.form-check-input:checked[type=checkbox] {
  --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}

</style>