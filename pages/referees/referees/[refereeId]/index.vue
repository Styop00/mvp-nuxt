<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <RefereeForm
        :refereeId="refereeId"
        @unsavedChanges="handleUnsavedChanges"
      />
    </div>
  </div>
  <LivePageOrNot
    v-model:visible="showUnsavedChangesModal"
    @confirm="confirmLeavePage"
    @cancel="cancelLeavePage"
  />
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import RefereeForm from '~/components/forms/RefereeForm.vue';
import { useRoute } from 'vue-router';
import LivePageOrNot from '~/components/alerts/LivePageOrNot.vue';

const route = useRoute();
const refereeId = Number(route.params.refereeId);

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
