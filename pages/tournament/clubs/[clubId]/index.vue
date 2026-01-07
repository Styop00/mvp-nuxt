<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 bg-white">
      <div>
        <p
          class="text-base font-bold pb-4 flex items-center justify-start tracking-widest"
        >
          <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
          />
          Edit Club
        </p>
        <ClubForm :clubId="clubId" @unsavedChanges="handleUnsavedChanges" />
      </div>
    </div>
  </div>

  <LivePageOrNot
    v-model:visible="showUnsavedChangesModal"
    @confirm="confirmLeavePage"
    @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ClubForm from '~/components/forms/ClubForm.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import LivePageOrNot from '~/components/alerts/LivePageOrNot.vue';

const hasUnsavedChanges = ref(false);
const showUnsavedChangesModal = ref(false);
let routeNext: any = null;

function handleUnsavedChanges(value: any) {
  hasUnsavedChanges.value = value;
}

function confirmLeavePage() {
  showUnsavedChangesModal.value = false;
  if (routeNext) {
    routeNext();
  }
}

function cancelLeavePage() {
  showUnsavedChangesModal.value = false;
  routeNext = null;
}

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true;
    routeNext = next;
  } else {
    next();
  }
});

const route = useRoute();
const clubId = Number(route.params.clubId);
</script>
