<template>
  <div class="min-h-screen flex font-inter" ref="mainPageRef">
    <LoadingSpinner v-if="isLoading" />
    <Sidebar
      :showFullSidebar="showFullSidebar"
      class="lg:inline-block hidden"
    />

    <div
      class="lg:hidden fixed top-0 left-0 w-screen h-screen bg-brand-blue-900/50 z-50"
      v-if="showFullSidebar"
      @click="() => showFullSidebar = false"
    >
      <Sidebar
        :showFullSidebar="showFullSidebar"
        class="fixed top-0 left-0"
        @click.stop
      />
    </div>

    <div
      class="bg-body-gray transition-all	max-lg:!w-full"
      :class="showFullSidebar ? 'contentWidth' : 'contentBigWidth'"
    >
      <Header
        v-model:showDropdowns="showDropdowns"
        v-model:showFullSidebar="showFullSidebar"
      />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

import Sidebar from "~/components/sidebar/Sidebar.vue";
import Header from "~/components/header/Header.vue";
import LoadingSpinner from "~/components/loadingSpinner/LoadingSpinner.vue";
import { useLoading } from '@/composables/useLoading/useLoading';

const { isLoading } = useLoading();

const mainPageRef = ref(null)
const showDropdowns = ref(false)
const showFullSidebar = ref(window.innerWidth > 1024)


onMounted(() => {
  if(mainPageRef.value) {
    mainPageRef.value.addEventListener("click", () => {
      showDropdowns.value = false
    })
  }
})
</script>

<style scoped>
.contentWidth {
  width: calc(100% - 240px);
}
.contentBigWidth {
  width: calc(100% - 80px);
}
</style>
