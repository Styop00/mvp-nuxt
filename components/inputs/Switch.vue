<template>
  <div class="custom-toggle-switch flex items-center mt-3 gap-4">
    <span class="text-xs lg:text-base" :class="labelStyles">{{uncheckedLabel}}</span>
    <div class="min-w-[15%] lg:min-w-fit -translate-y-1/4">
      <label class="switch-label relative cursor-pointer inline-block">
        <input type="checkbox"  class="hidden" v-model="inputValue">
      </label>
    </div>
    <span class="text-xs lg:text-base" :class="labelStyles">{{ checkedLabel }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  uncheckedLabel: {
    type: String,
    default: ''
  },
  checkedLabel: {
    type: String,
    default: ''
  },
  value: {
    type: Boolean || Number,
    required: true
  },
  labelStyles: {
    type: String,
    required: false
  },
})
const emit = defineEmits(['update:value'])

const inputValue = toRef(props.value)

watch(() => props.value, () => {
  if (props.value !== inputValue.value) {
    inputValue.value = props.value
  }
})

watch(() => inputValue.value, () => {
  if (props.value !== inputValue.value) {
    emit('update:value', inputValue.value)
  }
})
</script>

<style scoped lang="scss">
.switch-label {
  width: 2.5rem;
  transition: all 0.4s ease-in-out;
  background-color: #49b6f5;


  &::before, &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #8c9097;
  }

  &::before {
    border-radius: 0.5rem;
    height: 1rem;
    width: 2.5rem;
    opacity: 30%;
  }

  &::after {
    border-radius: 1rem;
    height: 1.5rem;
    width: 1.5rem;
    transition: all 0.4s ease-in-out;
    background-color: #fff;
    box-shadow: 0 0 0.3rem #e4e5edcc;
  }

  &:has(input:checked) {
    &:after, &:before {
      background-color: #49b6f5;
    }
    &:after {
      right: 0;
    }
    &:before {
      opacity: 50%;
    }
  }
}
</style>