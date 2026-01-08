<template>
  <div class="relative text-sm w-40 mx-auto">
    <div
        class="flex items-center text-sm text-dark-text-primary px-3 py-2.5 min-h-11 gap-2 justify-between w-full rounded-lg cursor-pointer border border-dark-border-default bg-dark-bg-primary hover:border-dark-border-light hover:shadow-sm focus-within:border-brand-primary-color focus-within:ring-2 focus-within:ring-brand-primary-color/20 transition-all duration-200"
        @click="openDropdown">
      {{ selectOptions[value] }}
      <template v-if="!dropdownOpened">
        <font-awesome :icon="['fas', 'angle-down']" class="ml-auto"/>
      </template>
      <template v-else>
        <font-awesome
            :icon="['fas', 'angle-up']"
            @click.stop="() => dropdownOpened = false"
            class="cursor-pointer ml-auto"
        />
      </template>
    </div>
    <div
        v-if="dropdownOpened"
        class="absolute border rounded-lg border-dark-border-default w-full text-sm overflow-y-auto small-scrollbar bg-dark-surface-elevated top-full shadow-xl mt-1"
        style="z-index: 99999 !important; position: absolute !important;"
    >
      <template v-for="(option, index) in selectOptions">
        <p
            class="px-3 py-2.5 cursor-pointer text-sm text-dark-text-primary hover:bg-dark-bg-hover hover:text-brand-primary-color transition-all duration-200 border-b border-dark-border-default last:border-b-0"
            @click="setOption(index)"
        >
          {{ option }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number,
  options: Array<string>
}

const props = defineProps<Props>()
const dropdownOpened = ref(false)
const emit = defineEmits(['update:value'])
const selectOptions = ref([] as Array<String>)

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

watch(() => props.options, () => {
  selectOptions.value = props.options;
}, {
  deep: true,
  immediate: true
})

function setOption(optionValue: number) {
  emit('update:value', optionValue)
}

function closeDropdown(): void {
  dropdownOpened.value = false
}

function openDropdown(): void {
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
