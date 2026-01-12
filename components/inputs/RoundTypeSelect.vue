<template>
  <div class="relative text-sm w-40 mx-auto">
    <div
        class="flex items-center text-sm text-text-primary px-3 py-2.5 min-h-11 gap-2 justify-between w-full rounded-lg cursor-pointer border border-border-default bg-bg-primary hover:border-border-light hover:shadow-sm focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-[background-color,border-color,color] duration-200"
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
        class="absolute border rounded-lg border-border-default w-full text-sm overflow-y-auto small-scrollbar bg-surface-elevated text-text-primary top-full shadow-sm mt-1 transition-[background-color,border-color,color] duration-200"
        style="z-index: 99999 !important; position: absolute !important;"
    >
      <template v-for="(option, index) in selectOptions">
        <p
            class="px-3 py-2.5 cursor-pointer text-sm text-text-primary hover:bg-bg-hover hover:text-brand-primary transition-[background-color,color] duration-200 border-b border-border-default last:border-b-0"
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
