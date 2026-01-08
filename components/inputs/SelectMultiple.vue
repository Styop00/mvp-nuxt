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
/* Main multiselect container */
.multiselect {
  position: relative;
  color: inherit;
}

/* Tags container (input area) */
.multiselect__tags {
  @apply bg-dark-bg-primary border-dark-border-default text-sm text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all duration-200 placeholder:text-dark-text-tertiary placeholder:text-xs min-h-11 px-3 py-2.5 flex items-center rounded-lg hover:border-dark-border-light hover:shadow-sm;
  background-color: #0F172A !important;
  border-color: #334155 !important;
}

.multiselect__tags:focus-within {
  border-color: #6366F1 !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}

/* Content wrapper (dropdown) */
.multiselect__content-wrapper {
  @apply rounded-lg;
  background-color: #1E293B !important;
  border: 1px solid #334155 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2) !important;
  z-index: 99999 !important;
  position: absolute !important;
  margin-top: 4px !important;
}

/* Single selected value */
.multiselect__single {
  line-height: unset;
  @apply mb-0 text-sm px-0 text-dark-text-primary;
  background: transparent !important;
  color: #F1F5F9 !important;
}

/* Input field */
.multiselect__input,
.multiselect__input:focus {
  @apply text-sm mb-0 px-0 text-dark-text-primary;
  background: transparent !important;
  color: #F1F5F9 !important;
  border: none !important;
  box-shadow: none !important;
}

.multiselect__input::placeholder {
  color: #94A3B8 !important;
}

/* Placeholder */
.multiselect__placeholder {
  @apply text-sm mb-0 text-dark-text-tertiary;
  color: #94A3B8 !important;
  background: transparent !important;
}

/* Options list */
.multiselect__content {
  background-color: #1E293B !important;
}

/* Individual option */
.multiselect__element {
  @apply text-sm mb-0;
  background-color: #1E293B !important;
}

.multiselect__option {
  background-color: #1E293B !important;
  color: #F1F5F9 !important;
  padding: 10px 12px !important;
  border-bottom: 1px solid #334155 !important;
  transition: all 200ms !important;
}

.multiselect__option:last-child {
  border-bottom: none !important;
}

/* Highlighted option (hover) */
.multiselect__option--highlight {
  background-color: #475569 !important;
  color: #F1F5F9 !important;
}

/* Selected option */
.multiselect__option--selected {
  background-color: #334155 !important;
  color: #F1F5F9 !important;
  font-weight: 500 !important;
}

/* Selected and highlighted */
.multiselect__option--selected.multiselect__option--highlight {
  background-color: #475569 !important;
  color: #F1F5F9 !important;
}

/* Selected checkmark */
.multiselect__option--selected::after {
  background-color: transparent !important;
  color: #6366F1 !important;
  border-color: #6366F1 !important;
}

/* Tag (selected item chip) */
.multiselect__tag {
  background-color: #334155 !important;
  color: #F1F5F9 !important;
  border: 1px solid #475569 !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  margin: 2px 4px 2px 0 !important;
  font-size: 0.875rem !important;
}

.multiselect__tag-icon {
  background-color: transparent !important;
  color: #94A3B8 !important;
  border-left: 1px solid #475569 !important;
  padding-left: 6px !important;
  margin-left: 6px !important;
}

.multiselect__tag-icon:hover {
  background-color: #475569 !important;
  color: #F1F5F9 !important;
}

.multiselect__tag-icon:focus {
  background-color: #475569 !important;
  color: #F1F5F9 !important;
}

.multiselect__tag-icon::after {
  color: #94A3B8 !important;
}

.multiselect__tag-icon:hover::after {
  color: #F1F5F9 !important;
}

/* Strong tag (when multiple selected) */
.multiselect__strong {
  background-color: #334155 !important;
  color: #F1F5F9 !important;
}

/* Spinner */
.multiselect__spinner {
  background-color: #1E293B !important;
  border-top-color: #6366F1 !important;
}

/* Clear button */
.multiselect__clear {
  background-color: transparent !important;
  color: #94A3B8 !important;
}

.multiselect__clear:hover {
  background-color: #475569 !important;
  color: #F1F5F9 !important;
}

/* Arrow icon */
.multiselect__single + .multiselect__tags-wrap {
  background: transparent !important;
}

/* Custom scrollbar for multiselect */
.multiselect__content-wrapper .multiselect__content {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1E293B;
}

.multiselect__content-wrapper .multiselect__content::-webkit-scrollbar {
  width: 6px;
}

.multiselect__content-wrapper .multiselect__content::-webkit-scrollbar-track {
  background: #1E293B;
}

.multiselect__content-wrapper .multiselect__content::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.multiselect__content-wrapper .multiselect__content::-webkit-scrollbar-thumb:hover {
  background: #64748B;
}

/* Disabled state */
.multiselect--disabled .multiselect__tags {
  background-color: #1E293B !important;
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.multiselect--disabled .multiselect__single,
.multiselect--disabled .multiselect__placeholder {
  color: #64748B !important;
}

/* Active state */
.multiselect--active .multiselect__tags {
  border-color: #6366F1 !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}

/* Above direction */
.multiselect--above .multiselect__content-wrapper {
  border-bottom: 1px solid #334155 !important;
  border-top: none !important;
}

/* Ensure tags container children have transparent backgrounds */
.multiselect__tags > * {
  background-color: transparent !important;
}

/* Override any remaining white backgrounds with specific selectors */
.multiselect__tags,
.multiselect__content-wrapper,
.multiselect__content {
  background-color: #1E293B !important;
  background: #1E293B !important;
}

.multiselect__tags {
  background-color: #0F172A !important;
  background: #0F172A !important;
}

.multiselect__option {
  background-color: #1E293B !important;
  background: #1E293B !important;
}

.multiselect__tag {
  background-color: #334155 !important;
  background: #334155 !important;
}

/* Ensure text colors are correct */
.multiselect__option,
.multiselect__tag,
.multiselect__single {
  color: #F1F5F9 !important;
}

/* Fix search input inside multiselect */
.multiselect__input {
  color: #F1F5F9 !important;
  background: transparent !important;
}

.multiselect__input::placeholder {
  color: #94A3B8 !important;
  background: transparent !important;
}

/* Fix any span or div elements inside multiselect */
.multiselect__tags span,
.multiselect__tags div {
  background-color: transparent !important;
  color: inherit !important;
}
</style>