<template>
  <div
      @click="navigate"
      class="hover:-translate-y-1 h-[135px] w-full no-underline bg-dark-surface-default border border-dark-border-default rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-brand-primary-color/20 transition-all duration-300 ease-in-out card-hover"
      :class="props.to ? 'cursor-pointer' : ''"
  >
    <div class="flex sm:flex-row gap-6 relative h-full">
      <font-awesome :icon="['fas', icon]" class="text-3xl" :class="color"/>
      <div class="content flex w-full">
        <div>
          <span
              class="text-dark-text-tertiary text-sm text-center mb-4 whitespace-nowrap"
          >
            {{ text }}
          </span>
          <p class="text-2xl text-dark-text-primary font-semibold">
            <template v-if="loading">
              <font-awesome
                  :icon="['fas', 'spinner']"
                  class="fa-spin text-2xl"
              />
            </template>
            <template v-else>
              {{ count }}
            </template>
          </p>
        </div>
        <p
            v-if="!!to"
            class="text-xs absolute bottom-0 right-0 mt-4 font-medium transition-all duration-300 hover:translate-x-1"
            :class="color"
        >
          View all
          <font-awesome
              :icon="['fas', 'arrow-right']"
              class="text-sm inline-block ml-1"
              :class="color"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useSidebarStore} from "~/store/sidebar";

const props = defineProps({
  to: {type: String, required: true},
  text: {type: String, required: true},
  color: {type: String, required: true},
  count: {type: [String, Number], required: true},
  icon: {type: String, required: true},
  navigationLabel: {type: String, required: false},
  loading: {type: Boolean, default: false},
});

const sidebarStore = useSidebarStore()

function navigate(): void {
  if (!!props.to) {
    sidebarStore.setActiveTab(props.navigationLabel ?? 'Dashboard')
    navigateTo(props.to)
  }
}
</script>
