<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <RefereeForm
        :refereeId="refereeId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import RefereeForm from '~/components/forms/RefereeForm.vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const refereeId = Number(route.params.refereeId);

</script>
