<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <CoachEditForm :coachId="coachId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import CoachEditForm from '~/components/forms/CoachEditForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const coachId = Number(route.params.userId);

</script>

<style scoped></style>
