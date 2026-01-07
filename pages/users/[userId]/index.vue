<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <TeamUserEditPage/>
    </div>
  </div>
</template>

<script setup lang="ts">

import TeamUserEditPage from "~/components/users/TeamUserEditPage.vue";
import Breadcrumb from "~/components/breadcrumb/Breadcrumb.vue";
</script>