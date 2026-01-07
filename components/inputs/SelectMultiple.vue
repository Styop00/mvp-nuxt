<template>
  <Multiselect v-model="inputValue"
               :options="options"
               :multiple="multiple"
               :close-on-select="closeOnSelect"
               :clear-on-select="clearOnSelect"
               :placeholder="placeholder"
               :label="label"
               :track-by="trackBy"
               :select-label="selectLabel"
               :deselect-label="deselectLabel"
               :selected-label="selectedLabel"
               :max-height="250"
               @open="() => clickBody()"
  >
    <template #selection="{ values, isOpen }">
        <span class="multiselect__single"
              v-if="values.length"
              v-show="!isOpen">
          {{ values.length }} options selected
        </span>
    </template>
  </Multiselect>
</template>

<script setup lang="ts">
import Multiselect from "vue-multiselect";
import type SelectOptions from "~/interfaces/inputs/selectOptions";

const props = defineProps({
  value: {
    type: [String, Number, Array, Object] as PropType<string | number | SelectOptions | Array<any>>,
    required: true
  },
  options: Array,
  multiple: {
    type: Boolean,
    default: true,
  },
  closeOnSelect: {
    type: Boolean,
    default: false,
  },
  clearOnSelect: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    default: 'label',
  },
  trackBy: {
    type: String,
    default: 'value',
  },
  selectLabel: {
    type: String,
    default: 'Press enter to select',
  },
  deselectLabel: {
    type: String,
    default: 'Press enter to remove',
  },
  selectedLabel: {
    type: String,
    default: 'Selected',
  }
})

const emit = defineEmits(['update:value'])

const inputValue = ref()

watch(() => props.value, () => {
  inputValue.value = props.value
}, {
  deep: true,
  immediate: true
})

watch(inputValue, () => {
  emit('update:value', inputValue.value)
})

function clickBody() {
  document.body.click()
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"/>
<style lang="scss">
.multiselect__tags {
  @apply bg-white border-gray-300 outline-none focus:shadow placeholder:text-xs min-h-11 py-2 flex items-center;
}

.multiselect__content-wrapper {
  @apply rounded-none
}

.multiselect__single {
  line-height: unset;
  @apply mb-0 text-sm
}

.multiselect__input {
  @apply text-sm mb-0
}

.multiselect__placeholder {
  @apply text-sm mb-0
}

.multiselect__element {
  @apply text-sm mb-0
}

.multiselect__option--highlight {
  @apply bg-gray-100 text-black
}

.multiselect__option--selected {
  @apply bg-gray-200
}

.multiselect__option--selected.multiselect__option--highlight {
  @apply bg-gray-100 text-black
}

.multiselect__option--selected::after {
  @apply bg-gray-200 text-black
}

.multiselect__option--selected::after:hover {
  @apply bg-gray-100 text-black
}

.multiselect__option--highlight::after {
  @apply bg-gray-100 text-black
}

.multiselect__option--highlight::after:hover {
  @apply bg-gray-100 text-black
}

.multiselect__option--selected.multiselect__option--highlight::after {
  @apply bg-gray-100 text-black
}

.multiselect__option--selected.multiselect__option--highlight::after:hover {
  @apply bg-gray-100 text-black
}
</style>