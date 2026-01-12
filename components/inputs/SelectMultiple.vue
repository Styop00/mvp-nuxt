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
  @apply bg-bg-primary border-border-default text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 placeholder:text-text-tertiary placeholder:text-xs min-h-11 px-3 py-2.5 flex items-center rounded-lg hover:border-border-light hover:shadow-sm;
  background-color: var(--color-bg-primary) !important;
  border-color: var(--color-border-default) !important;
}

.multiselect__tags:focus-within {
  border-color: var(--tw-brand-primary, #6366F1) !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
}

/* Content wrapper (dropdown) */
.multiselect__content-wrapper {
  @apply rounded-lg;
  background-color: var(--color-surface-elevated) !important;
  border: 1px solid var(--color-border-default) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  z-index: 99999 !important;
  position: absolute !important;
  margin-top: 4px !important;
}

/* Single selected value */
.multiselect__single {
  line-height: unset;
  @apply mb-0 text-sm px-0 text-text-primary;
  background: transparent !important;
  color: var(--color-text-primary) !important;
}

/* Input field */
.multiselect__input,
.multiselect__input:focus {
  @apply text-sm mb-0 px-0 text-text-primary;
  background: transparent !important;
  color: var(--color-text-primary) !important;
  border: none !important;
  box-shadow: none !important;
}

.multiselect__input::placeholder {
  color: var(--color-text-tertiary) !important;
}

/* Placeholder */
.multiselect__placeholder {
  @apply text-sm mb-0 text-text-tertiary;
  color: var(--color-text-tertiary) !important;
  background: transparent !important;
}

/* Options list */
.multiselect__content {
  background-color: var(--color-surface-elevated) !important;
}

/* Individual option */
.multiselect__element {
  @apply text-sm mb-0;
  background-color: var(--color-surface-elevated) !important;
}

.multiselect__option {
  background-color: var(--color-surface-elevated) !important;
  color: var(--color-text-primary) !important;
  padding: 10px 12px !important;
  border-bottom: 1px solid var(--color-border-default) !important;
  transition: all 200ms !important;
}

.multiselect__option:last-child {
  border-bottom: none !important;
}

/* Highlighted option (hover) */
.multiselect__option--highlight {
  background-color: var(--color-bg-hover) !important;
  color: var(--color-text-primary) !important;
}

/* Selected option */
.multiselect__option--selected {
  background-color: var(--color-surface-default) !important;
  color: var(--color-text-primary) !important;
  font-weight: 500 !important;
}

/* Selected and highlighted */
.multiselect__option--selected.multiselect__option--highlight {
  background-color: var(--color-bg-hover) !important;
  color: var(--color-text-primary) !important;
}

/* Selected checkmark */
.multiselect__option--selected::after {
  background-color: transparent !important;
  color: #6366F1 !important;
  border-color: #6366F1 !important;
}

/* Tag (selected item chip) */
.multiselect__tag {
  background-color: var(--color-surface-default) !important;
  color: var(--color-text-primary) !important;
  border: 1px solid var(--color-border-light) !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  margin: 2px 4px 2px 0 !important;
  font-size: 0.875rem !important;
}

.multiselect__tag-icon {
  background-color: transparent !important;
  color: var(--color-text-tertiary) !important;
  border-left: 1px solid var(--color-border-light) !important;
  padding-left: 6px !important;
  margin-left: 6px !important;
}

.multiselect__tag-icon:hover {
  background-color: var(--color-bg-hover) !important;
  color: var(--color-text-primary) !important;
}

.multiselect__tag-icon:focus {
  background-color: var(--color-bg-hover) !important;
  color: var(--color-text-primary) !important;
}

.multiselect__tag-icon::after {
  color: var(--color-text-tertiary) !important;
}

.multiselect__tag-icon:hover::after {
  color: var(--color-text-primary) !important;
}

/* Strong tag (when multiple selected) */
.multiselect__strong {
  background-color: var(--color-surface-default) !important;
  color: var(--color-text-primary) !important;
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

/* Override any remaining backgrounds with CSS variables */
.multiselect__tags,
.multiselect__content-wrapper,
.multiselect__content {
  background-color: var(--color-surface-elevated) !important;
  background: var(--color-surface-elevated) !important;
}

.multiselect__tags {
  background-color: var(--color-bg-primary) !important;
  background: var(--color-bg-primary) !important;
}

.multiselect__option {
  background-color: var(--color-surface-elevated) !important;
  background: var(--color-surface-elevated) !important;
}

.multiselect__tag {
  background-color: var(--color-surface-default) !important;
  background: var(--color-surface-default) !important;
}

/* Ensure text colors use CSS variables */
.multiselect__option,
.multiselect__tag,
.multiselect__single {
  color: var(--color-text-primary) !important;
}

/* Fix search input inside multiselect */
.multiselect__input {
  color: var(--color-text-primary) !important;
  background: transparent !important;
}

.multiselect__input::placeholder {
  color: var(--color-text-tertiary) !important;
  background: transparent !important;
}

/* Fix any span or div elements inside multiselect */
.multiselect__tags span,
.multiselect__tags div {
  background-color: transparent !important;
  color: inherit !important;
}
</style>