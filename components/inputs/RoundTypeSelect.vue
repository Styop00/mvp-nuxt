<template>
  <div class="relative text-sm w-40 mx-auto">
    <div
        class="flex items-center text-xs  px-2 py-px my-px gap-2 justify-between w-full rounded cursor-pointer"
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
        class="absolute border rounded border-gray-300 w-full text-xs overflow-y-auto small-scrollbar bg-gray-100 z-[100] top-full"
    >
      <template v-for="(option, index) in selectOptions">
        <p
            class="px-2 py-1 cursor-pointer hover:bg-white hover:text-black"
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
