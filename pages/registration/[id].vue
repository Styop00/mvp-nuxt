<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 bg-dark-surface-default">
      <div>
        <RegistrationForm
          @unsavedChanges="handleUnsavedChanges"
          :tournamentGroupId="tournamentGroupId"
          :clubName="clubName"
          :clubId="clubId"
        />
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
import RegistrationForm from "~/components/forms/RegistrationForm.vue"
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import LivePageOrNot from '~/components/alerts/LivePageOrNot.vue';

const route = useRoute();
const clubName = ref(route.query.clubName);
const clubId = ref(route.query.clubId);

if(!clubName || !clubId) {
  navigateTo("/registration")
}

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

const tournamentGroupId = Number(route.params.id);
</script>
