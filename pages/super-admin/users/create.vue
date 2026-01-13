<template>
 
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="rounded-lg p-6 bg-dark-surface-default">
      <div class="xl:w-2/3 w-full">
        <p
          class="text-base font-bold pb-4 flex items-center justify-start tracking-widest"
        >
          <span
            class="inline-block w-1 h-6 rounded-2xl bg-gradient-to-b from-violet-500/50 to-sky-400/50 mr-3"
          />
          Create User
        </p>
        <UserForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserForm from '~/components/forms/UserForm.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

</script>
