<template>
  <div class="py-2 lg:p-6">
   <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 bg-dark-surface-default">
      <div>
        <p
          class="text-base font-bold pb-4 flex items-center justify-start tracking-widest"
        >
          <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-red-500/50 to-pink-500/50 mr-3"
          />
          Create Venue
        </p>
        <VenueForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VenueForm from '~/components/forms/VenueForm.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

</script>
