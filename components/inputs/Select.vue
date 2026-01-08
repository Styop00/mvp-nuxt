<template>
  <div class="w-full relative text-sm" ref="selectContainer">
    <p class="font-inter-medium text-dark-text-primary">
      {{ label }}
      <span v-if="required && label"
            class="text-red-500"
      >
        *
      </span>
    </p>
    <div
        class="flex items-center border border-dark-border-default bg-dark-bg-primary text-sm text-dark-text-primary px-3 py-2.5 gap-2 justify-between w-full rounded-lg min-h-11 cursor-pointer transition-all duration-200 hover:border-dark-border-light hover:shadow-sm focus-within:border-brand-primary-color focus-within:ring-2 focus-within:ring-brand-primary-color/20"
        :class="selectStyles"
        @click="openDropdown">
      <span :class="!value?.label ? 'text-dark-text-tertiary' : 'text-dark-text-primary'">
        {{ value?.label || 'Select an option' }}
      </span>
      <template v-if="!dropdownOpened">
        <font-awesome :icon="['fas', 'angle-down']" class="ml-auto text-dark-text-tertiary transition-transform"/>
      </template>
      <template v-else>
        <font-awesome
            :icon="['fas', 'angle-up']"
            @click.stop="() => dropdownOpened = false"
            class="cursor-pointer ml-auto text-brand-primary-color transition-transform"
        />
      </template>
    </div>
    <Transition name="dropdown">
      <div
          v-if="dropdownOpened"
          :class="direction === 'bottom' ? 'top-full' : 'bottom-11'"
          class="absolute shadow-2xl border border-dark-border-default w-full text-sm max-h-52 overflow-y-auto small-scrollbar bg-dark-surface-elevated rounded-lg mt-1"
          style="z-index: 99999 !important; position: absolute !important; min-width: 100%;"
      >
        <template v-for="(option, index) in selectOptions" :key="index">
          <div
              class="px-3 py-2.5 border-b border-dark-border-default last:border-b-0 text-sm text-dark-text-primary bg-dark-surface-elevated transition-all duration-200"
              @click="setOption(option)"
              :class="!option.disabled ? 'cursor-pointer hover:bg-dark-bg-hover hover:text-brand-primary-color' : '!bg-dark-bg-secondary opacity-50 cursor-not-allowed'"
          >
            {{ option.label }}
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type {PropType} from "vue";

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
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal'
  },
  disableAutoSelect: {
    type: Boolean,
    default: false
  }
})
const dropdownOpened = ref(false)
const emit = defineEmits(['update:value'])
const selectOptions = ref([] as Array<SelectOptions>)
const selectContainer = ref<HTMLElement | null>(null)

const inputValue = toRef(props.value)
const initialValue = toRef(props.value)

watch(initialValue, () => {
  inputValue.value = initialValue.value
}, {deep: true, immediate: true})

watch(inputValue, (value, oldValue) => {
  if (value || oldValue) {
    emit('update:value', inputValue.value)
  }
})

watch(() => props.options, (newOptions) => {
  if (!newOptions || newOptions.length === 0) {
    selectOptions.value = [];
    return;
  }
  
  if (newOptions.length === 1 && !props.disableAutoSelect) {
    setOption(newOptions[0])
    selectOptions.value = [...newOptions];
  } else if (newOptions.length > 1 || (newOptions.length === 1 && props.disableAutoSelect)) {
    selectOptions.value = props.direction === 'top' ? [...newOptions].reverse() : [...newOptions];
  }
}, {
  deep: true,
  immediate: true
})

const selectStyles = computed(() => {
  return {
    'bg-disabled-gray/30': props.disabled,
    'cursor-pointer': !props.disabled,
    'text-xs': props.size === 'small',
    'text-sm': props.size === 'normal'
  }
})

function setOption(optionValue: SelectOptions) {
  if (!optionValue.disabled) {
    emit('update:value', optionValue)
  }
}

function closeDropdown(): void {
  dropdownOpened.value = false
}

function openDropdown(): void {
  if (props.disabled) {
    return
  }
  setTimeout(() => {
    dropdownOpened.value = true
  }, 50)
  document.body.addEventListener('click', closeDropdown)
  const modal = document.querySelector('#modal-body')
  if (modal) {
    modal.addEventListener('click', closeDropdown)
  }
}

defineExpose({
  closeDropdown,
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 200ms ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
