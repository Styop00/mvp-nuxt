<template>
  <div class="p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden pb-4">
      <RefereeAttachmentForm :game-id="gameId" :ref-id="refId" :pos="pos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import RefereeAttachmentForm from "~/components/forms/RefereeAttachmentForm.vue"
import { useRoute } from 'vue-router';

const route = useRoute()
const refId = Number(route.query.refId)
const pos = Number(route.query.pos)
console.log(refId,"refIdrefIdrefIdrefIdrefId");
const gameId = Number(route.params.refereeattachmentId)
</script>
