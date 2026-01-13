<template>
  <BaseModalComponent
    :visible="visible"
    title="Add Sport & Role"
    :width="3"
    @update:visible="(val) => emit('update:visible', val)"
    @close="handleClose"
  >
    <template #icon>
      <font-awesome :icon="['fas', 'futbol']" class="text-brand-primary-color text-sm"/>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Sport Selection -->
      <div>
        <label class="block mb-1.5 text-sm font-medium text-dark-text-primary">
          Sport <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select
            v-model="selectedSportId"
            required
            class="w-full text-sm px-3 py-2.5 border rounded-lg bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all appearance-none cursor-pointer"
            :disabled="loadingSports"
          >
            <option value="" disabled>
              {{ loadingSports ? 'Loading...' : 'Choose a sport' }}
            </option>
            <option
              v-for="sport in availableSports"
              :key="sport.id"
              :value="sport.id"
            >
              {{ sport.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text-tertiary">
            <font-awesome :icon="['fas', 'chevron-down']" class="text-xs"/>
          </div>
        </div>
      </div>

      <!-- Role Selection -->
      <div>
        <label class="block mb-1.5 text-sm font-medium text-dark-text-primary">
          Role <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select
            v-model="selectedRoleId"
            required
            class="w-full text-sm px-3 py-2.5 border rounded-lg bg-dark-bg-primary border-dark-border-default text-dark-text-primary outline-none focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20 transition-all appearance-none cursor-pointer"
            :disabled="loadingRoles"
          >
            <option value="" disabled>
              {{ loadingRoles ? 'Loading...' : 'Choose your role' }}
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
            <font-awesome :icon="['fas', 'chevron-down']" class="text-xs"/>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="flex items-center gap-2 p-2.5 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-xs"
      >
        <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-xs"/>
        <span>{{ error }}</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-1">
        <button
          type="button"
          @click="handleClose"
          class="flex-1 py-2.5 px-3 rounded-lg bg-dark-bg-primary border border-dark-border-default text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-hover transition-all text-sm font-medium"
        >
          Cancel
        </button>
        <BaseButton
          type="submit"
          class="flex-1 py-2.5 text-sm"
          :disabled="isSubmitting || !selectedSportId || !selectedRoleId"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </span>
          <span v-else>Add</span>
        </BaseButton>
      </div>
    </form>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import { useSportsFetch } from '~/composables/useSportsFetch/useSportsFetch';
import { useApiV5Fetch } from '~/composables/useApiV5Fetch';
import { useUserStore } from '~/store/user';
import type Roles from '~/interfaces/roles/roles';

const props = defineProps<{
  visible: boolean;
  existingSportIds?: number[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}>();

const userStore = useUserStore();
const { user } = userStore;

// Sports
const { sports, loading: loadingSports, fetchSports } = useSportsFetch();

// Roles
const roles = ref<Roles[]>([]);
const loadingRoles = ref(false);

// Form state
const selectedSportId = ref<number | string>('');
const selectedRoleId = ref<number | string>('');
const isSubmitting = ref(false);
const error = ref('');

// Filter out Super Admin role
const filteredRoles = computed(() => {
  return roles.value.filter(role => 
    role.value?.toLowerCase() !== 'super_admin' && 
    role.description?.toLowerCase() !== 'super admin' &&
    role.id !== 1
  );
});

// Filter out sports the user already has
const availableSports = computed(() => {
  const existingIds = props.existingSportIds || [];
  return sports.value.filter(sport => !existingIds.includes(sport.id));
});

// Fetch roles
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

// Handle form submit
async function handleSubmit() {
  error.value = '';
  
  if (!selectedSportId.value || !selectedRoleId.value) {
    error.value = 'Please select both sport and role';
    return;
  }

  isSubmitting.value = true;

  try {
    // Create user season sport using sport_id (backend will find the newest season)
    const userSeasonSportResponse = await useApiV5Fetch('user-season-sports', {
      method: 'POST',
      body: {
        user_id: user.id,
        sport_id: selectedSportId.value,
        role_id: selectedRoleId.value,
        is_active: true,
      },
    });

    if (!userSeasonSportResponse.data?.value) {
      const errorMsg = userSeasonSportResponse.error?.value?.data?.message || 'Failed to add sport';
      throw new Error(errorMsg);
    }

    const createdUserSeasonSport = userSeasonSportResponse.data.value as any;

    // Assign role to user
    await useApiV5Fetch(`roles/${selectedRoleId.value}/users/${user.id}`, {
      method: 'POST',
      body: {
        season_sport_id: createdUserSeasonSport.season_sport_id,
      },
    });

    // Refresh user data
    await userStore.getMe();

    emit('success');
    handleClose();

  } catch (e) {
    console.error('Failed to add sport:', e);
    error.value = e instanceof Error ? e.message : 'Failed to add sport. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

// Handle close
function handleClose() {
  emit('update:visible', false);
  resetForm();
}

// Reset form
function resetForm() {
  selectedSportId.value = '';
  selectedRoleId.value = '';
  error.value = '';
}

// Fetch data when modal opens
watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchSports();
    fetchRoles();
    resetForm();
  }
});
</script>

