<template>
  <div
    class="w-full min-h-screen flex items-center justify-center bg-dark-bg-primary"
  >
    <div class="w-full max-w-lg p-4 sm:p-8 md:p-12 rounded-lg animate-fade-in">
      <div class="mb-6 sm:mb-8 md:mb-12">
        <NuxtLink class="flex justify-center items-center gap-2 group" to="/">
          <span class="text-2xl font-bold bg-gradient-to-br from-white via-red-500 to-red-950 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110">T</span>
          <span class="text-xl text-white font-semibold"> Tourney </span>
        </NuxtLink>
      </div>
      <div
        class="w-full max-w-md p-4 sm:p-8 md:p-12 bg-dark-surface-default border border-dark-border-default shadow-xl rounded-xl backdrop-blur-sm"
      >
        <div class="mb-8">
          <p class="text-xl font-inter-medium text-center mb-2 text-dark-text-primary">
            Complete Your Profile
          </p>
          <p class="text-dark-text-tertiary text-[13px] text-center mb-4">
            Welcome {{ userStore.user?.name }}! Please select your sport and role to continue.
          </p>
        </div>

        <form @submit.prevent="submitProfile">
          <!-- Sport Selection -->
          <div class="mb-6">
            <label class="block mb-2 font-inter-medium text-xs text-dark-text-primary">
              Select Sport <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="selectedSportId"
                required
                class="w-full text-base px-4 py-3 border rounded-lg bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all appearance-none cursor-pointer"
                :disabled="loadingSports"
              >
                <option value="" disabled>
                  {{ loadingSports ? 'Loading sports...' : 'Choose a sport' }}
                </option>
                <option
                  v-for="sport in sports"
                  :key="sport.id"
                  :value="sport.id"
                >
                  {{ sport.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text-tertiary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="errors.sport" class="text-red-500 text-xs mt-1">
              {{ errors.sport }}
            </p>
          </div>

          <!-- Role Selection -->
          <div class="mb-6">
            <label class="block mb-2 font-inter-medium text-xs text-dark-text-primary">
              Select Your Role <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="selectedRoleId"
                required
                class="w-full text-base px-4 py-3 border rounded-lg bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all appearance-none cursor-pointer"
                :disabled="loadingRoles"
              >
                <option value="" disabled>
                  {{ loadingRoles ? 'Loading roles...' : 'Choose your role' }}
                </option>
                <option
                  v-for="role in filteredRoles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.description }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text-tertiary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="errors.role" class="text-red-500 text-xs mt-1">
              {{ errors.role }}
            </p>
          </div>

          <!-- Submit Error -->
          <p v-if="submitError" class="text-red-500 text-sm text-center mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            {{ submitError }}
          </p>

          <!-- Success Message -->
          <p v-if="successMessage" class="text-green-500 text-sm text-center mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            {{ successMessage }}
          </p>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            class="flex items-center justify-center w-full p-3 mt-5"
            :disabled="isSubmitting || !selectedSportId || !selectedRoleId"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
            <span v-else class="text-white">Continue to Dashboard</span>
          </BaseButton>
        </form>

        <!-- Logout Option -->
        <div class="text-center mt-6">
          <p class="text-dark-text-tertiary text-[12px]">
            Wrong account?
            <button
              @click="logout"
              class="text-brand-primary-color hover:text-brand-hover transition-colors hover:underline"
            >
              Sign Out
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import { useSportsFetch } from '~/composables/useSportsFetch/useSportsFetch';
import { useApiV5Fetch } from '~/composables/useApiV5Fetch';
import BaseButton from '~/components/buttons/BaseButton.vue';
import type Roles from '~/interfaces/roles/roles';

definePageMeta({
  layout: 'auth',
});

const userStore = useUserStore();
const { sports, loading: loadingSports, fetchSports } = useSportsFetch();

const roles = ref<Roles[]>([]);
const loadingRoles = ref(false);
const selectedSportId = ref<number | string>('');
const selectedRoleId = ref<number | string>('');
const isSubmitting = ref(false);
const submitError = ref('');
const successMessage = ref('');
const errors = ref({
  sport: '',
  role: '',
});

// Filter out Super Admin role (typically id=1 or value='super_admin')
const filteredRoles = computed(() => {
  return roles.value.filter(role => 
    role.value?.toLowerCase() !== 'super_admin' && 
    role.description?.toLowerCase() !== 'super admin' &&
    role.id !== 1
  );
});

async function fetchRoles() {
  loadingRoles.value = true;
  try {
    const response = await useApiV5Fetch('roles', {
      query: {
        orderBy: 'id',
        orderDirection: 'asc',
      },
    });

    if (response.data?.value) {
      roles.value = response.data.value as Roles[];
    }
  } catch (e) {
    console.error('Failed to fetch roles:', e);
  } finally {
    loadingRoles.value = false;
  }
}

async function submitProfile() {
  errors.value = { sport: '', role: '' };
  submitError.value = '';
  successMessage.value = '';

  if (!selectedSportId.value) {
    errors.value.sport = 'Please select a sport';
    return;
  }

  if (!selectedRoleId.value) {
    errors.value.role = 'Please select a role';
    return;
  }

  isSubmitting.value = true;

  try {
    // Create user season sport using sport_id (backend will find the newest season)
    const userSeasonSportResponse = await useApiV5Fetch('user-season-sports', {
      method: 'POST',
      body: {
        user_id: userStore.user?.id,
        sport_id: selectedSportId.value,
        role_id: selectedRoleId.value,
        is_active: true,
      },
    });

    if (!userSeasonSportResponse.data?.value) {
      const errorMsg = userSeasonSportResponse.error?.value?.data?.message || 'Failed to assign sport to user';
      throw new Error(errorMsg);
    }

    const createdUserSeasonSport = userSeasonSportResponse.data.value as any;

    // Assign role to user with the season_sport_id from the response
    const roleResponse = await useApiV5Fetch(`roles/${selectedRoleId.value}/users/${userStore.user?.id}`, {
      method: 'POST',
      body: {
        season_sport_id: createdUserSeasonSport.season_sport_id,
      },
    });

    if (!roleResponse.data?.value && roleResponse.error?.value) {
      console.warn('Role assignment response:', roleResponse.error.value);
    }

    successMessage.value = 'Profile completed successfully! Redirecting...';

    // Refresh user data
    await userStore.getMe();

    // Redirect to dashboard after short delay
    setTimeout(() => {
      navigateTo('/');
    }, 1500);

  } catch (e) {
    console.error('Failed to complete profile:', e);
    submitError.value = e instanceof Error ? e.message : 'Failed to complete profile. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function logout() {
  userStore.resetState();
  navigateTo('/login');
}

onMounted(() => {
  // Check if user is logged in
  if (!userStore.user?.id) {
    navigateTo('/login');
    return;
  }

  // Check if user already has season_sports
  const existingSeasonSports = userStore.user?.season_sports || [];
  if (existingSeasonSports.length > 0) {
    navigateTo('/');
    return;
  }

  // Fetch data
  fetchSports();
  fetchRoles();
});
</script>

