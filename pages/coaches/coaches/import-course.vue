<template>
  <div class="py-2 lg:p-6 ">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 xl:w-2/3 w-full bg-white">
      <div>
        <CoachForm
          @unsavedChanges="handleUnsavedChanges"
          :isShowFileInput="true"
        />
      </div>
    </div>
    <LivePageOrNot
      v-model:visible="showUnsavedChangesModal"
      @confirm="confirmLeavePage"
      @cancel="cancelLeavePage"
    />
  </div>
</template>

<script setup lang="ts">
import CoachForm from '~/components/forms/CoachForm.vue';
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
</script>

<style scoped></style>
