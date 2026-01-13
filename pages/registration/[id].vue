<template>
  <div class="py-2 lg:p-6">
    <Breadcrumb />
    <div class="rounded-lg overflow-hidden p-6 bg-dark-surface-default">
      <div>
        <RegistrationForm
          :tournamentGroupId="tournamentGroupId"
          :clubName="clubName"
          :clubId="clubId"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import RegistrationForm from "~/components/forms/RegistrationForm.vue"
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';


const route = useRoute();
const clubName = ref(route.query.clubName);
const clubId = ref(route.query.clubId);

if(!clubName || !clubId) {
  navigateTo("/registration")
}
const tournamentGroupId = Number(route.params.id);
</script>
