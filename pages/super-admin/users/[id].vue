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
          Edit User
        </p>
        <div
          class="ml-6 relative rounded-full w-[85px] h-[85px] overflow-hidden bg-gray-100"
        >
          <div
            v-if="!response.picture"
            class=" user-icon absolute inset-0 flex items-center justify-center bg-dark-surface-elevated opacity-50 transition-opacity duration-300 "
          >
            <font-awesome :icon="['fas', 'user']" class="m-auto w-6 h-6" />
          </div>
          <img
            v-if="response.picture"
            :src="`${apiUrl}${response.picture}`"
            alt="User's profile picture"
            class="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
        <UserForm :userId="userId"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserForm from '~/components/forms/UserForm.vue';
import { useUsersFetch } from '~/composables/useUsersFetch/useUsersFetch';
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';

const config = useRuntimeConfig()

const apiUrl = config.public.backendURL

const route = useRoute();
const userId = Number(route.params.id);
const {fetchUserById} = useUsersFetch();
const response = await fetchUserById(userId)

</script>
