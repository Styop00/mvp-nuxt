<template>
  <div
      @click="navigate"
      class="hover:-translate-y-1 h-[135px] w-full no-underline bg-surface-default border border-border-default text-text-primary rounded-xl p-6 shadow-sm hover:shadow-sm hover:shadow-brand-primary/10 transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-in-out card-hover"
      :class="props.to ? 'cursor-pointer' : ''"
  >
    <div class="flex sm:flex-row gap-6 relative h-full">
      <font-awesome 
        :icon="['fas', icon]" 
        class="text-3xl transition-[color,opacity] duration-300 ease-in-out" 
        :class="color"
      />
      <div class="content flex w-full">
        <div>
          <span
              class="text-text-tertiary text-sm text-center mb-4 whitespace-nowrap transition-[color] duration-300 ease-in-out"
          >
            {{ text }}
          </span>
          <p class="text-2xl text-text-primary font-semibold transition-[color] duration-300 ease-in-out">
            <template v-if="loading">
              <font-awesome
                  :icon="['fas', 'spinner']"
                  class="fa-spin text-2xl transition-[color,opacity] duration-300 ease-in-out"
                  :class="color"
              />
            </template>
            <template v-else>
              {{ count }}
            </template>
          </p>
        </div>
        <p
            v-if="!!to"
            class="text-xs absolute bottom-0 right-0 mt-4 font-medium transition-[color,transform,opacity] duration-300 ease-in-out hover:translate-x-1"
            :class="color"
        >
          View all
          <font-awesome
              :icon="['fas', 'arrow-right']"
              class="text-sm inline-block ml-1 transition-[color,opacity,transform] duration-300 ease-in-out"
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
