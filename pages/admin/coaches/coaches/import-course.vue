<template>
  <div class="py-2 lg:p-6 ">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 xl:w-2/3 w-full bg-dark-surface-default">
      <div>
        <CoachForm
          :isShowFileInput="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CoachForm from '~/components/forms/CoachForm.vue';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
</script>
