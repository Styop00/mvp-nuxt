<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <RefereeForm @unsavedChanges="handleUnsavedChanges" />
    </div>

    <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
    />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import RefereeForm from '~/components/forms/RefereeForm.vue';
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
</script>
