<template>
  <div class="py-2 sm:py-4 lg:p-6 px-2 sm:px-4">
    <div class="animate-fade-in">
      <Breadcrumb />
      <div class="flex flex-col xl:flex-row gap-6 lg:gap-8 mt-4">
        <!-- Profile Information Card -->
        <div class="rounded-2xl bg-dark-surface-default shadow-xl border border-dark-border-default xl:w-2/3 w-full">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-dark-border-default bg-gradient-to-r from-dark-surface-default/50 to-dark-bg-primary/30 rounded-t-2xl">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-dark-text-primary">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"/>
              Profile Information
            </p>
          </div>

          <!-- Avatar Section -->
          <div class="p-6 border-b border-dark-border-default bg-gradient-to-br from-dark-bg-primary/30 to-dark-surface-default/30 overflow-hidden rounded-t-2xl">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div class="relative group">
                <div
                  class="relative rounded-full w-24 h-24 sm:w-28 sm:h-28 overflow-hidden border-4 border-dark-border-default hover:border-brand-primary-color transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-brand-primary-color/20"
                  @click="selectFiles"
                >
                  <input
                    type="file"
                    class="hidden"
                    ref="fileInput"
                    @click.stop
                    @change="onChangeFile"
                    accept="image/png, image/jpeg, image/jpg"
                  />

                  <div
                    class="absolute inset-0 flex items-center justify-center bg-dark-surface-elevated/90 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <font-awesome
                        :icon="['fas', 'upload']"
                        class="w-6 h-6 text-brand-primary-color"
                      />
                      <span class="text-xs font-semibold text-dark-text-primary">Upload</span>
                    </div>
                  </div>

                  <div
                    v-if="!user.picture"
                    class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-surface-elevated to-dark-bg-secondary"
                  >
                    <font-awesome :icon="['fas', 'user']" class="w-10 h-10 sm:w-12 sm:h-12 text-dark-text-tertiary" />
                  </div>

                  <img
                    v-if="user.picture"
                    :src="`${apiUrl}${userData.picture}`"
                    alt="User's profile picture"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-primary-color rounded-full border-4 border-dark-surface-default flex items-center justify-center shadow-lg">
                  <font-awesome :icon="['fas', 'camera']" class="text-white text-xs"/>
                </div>
              </div>

              <div class="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
                <h2 class="text-2xl sm:text-3xl font-bold text-dark-text-primary mb-2">
                  {{ user.name ? user.name : "User" }}
                </h2>
                <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span
                    v-for="(role, index) in user.roles"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary-color/10 text-brand-primary-color border border-brand-primary-color/20"
                  >
                    {{ role.description }}
                  </span>
                </div>
                <p class="text-sm text-dark-text-secondary mt-3 flex items-center gap-2">
                  <font-awesome :icon="['fas', 'envelope']" class="text-xs"/>
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Current Season Sport Section -->
          <div class="p-6 border-b border-dark-border-default">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-dark-text-primary flex items-center gap-2">
                <font-awesome :icon="['fas', 'calendar-alt']" class="text-brand-primary-color"/>
                Current Season Sport
              </h3>
              <button
                @click="showSwitchSeasonModal = true"
                class="px-3 py-1.5 rounded-lg bg-brand-primary-color/10 hover:bg-brand-primary-color/20 text-brand-primary-color border border-brand-primary-color/30 text-sm font-medium transition-all flex items-center gap-2"
              >
                <font-awesome :icon="['fas', 'sync-alt']" class="text-xs"/>
                Switch Season
              </button>
            </div>
            
            <!-- Current Active Season Sport -->
            <div v-if="currentActiveSeasonSport" class="p-4 rounded-xl bg-gradient-to-br from-brand-primary-color/10 to-brand-primary-color/5 border border-brand-primary-color/20">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-brand-primary-color/20 flex items-center justify-center">
                  <font-awesome :icon="['fas', 'trophy']" class="text-brand-primary-color text-lg"/>
                </div>
                <div>
                  <p class="font-semibold text-dark-text-primary">
                    {{ currentActiveSeasonSport.season?.name }} {{ currentActiveSeasonSport.sport?.name }}
                  </p>
                  <p class="text-xs text-dark-text-tertiary mt-0.5">
                    Currently Active
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-sm text-dark-text-tertiary">No active season sport selected</p>
            </div>
          </div>

          <!-- Sport & Role Section -->
          <div class="p-6 border-b border-dark-border-default">
            <h3 class="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <font-awesome :icon="['fas', 'futbol']" class="text-brand-primary-color"/>
              Sport & Role
            </h3>
            
            <!-- Current Sport & Roles -->
            <div class="space-y-4">
              <div v-if="userSeasonSports.length > 0">
                <div 
                  v-for="(seasonSport, index) in userSeasonSports" 
                  :key="index"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-dark-bg-primary/50 border border-dark-border-default"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary-color/20 to-brand-primary-color/5 flex items-center justify-center">
                      <font-awesome :icon="['fas', 'trophy']" class="text-brand-primary-color"/>
                    </div>
                    <div>
                      <p class="font-semibold text-dark-text-primary">
                        {{ seasonSport.season_sport?.sport?.name || 'Unknown Sport' }}
                      </p>
                      <p class="text-xs text-dark-text-tertiary">
                        Season: {{ seasonSport.season_sport?.season?.name || 'Current Season' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(role, roleIndex) in getUserRolesForSeasonSport(seasonSport.season_sport_id)"
                      :key="roleIndex"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20"
                    >
                      {{ role.description }}
                    </span>
                    <span 
                      v-if="getUserRolesForSeasonSport(seasonSport.season_sport_id).length === 0"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-dark-surface-elevated text-dark-text-tertiary border border-dark-border-default"
                    >
                      No role assigned
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-6">
                <div class="w-16 h-16 rounded-full bg-dark-bg-primary mx-auto mb-3 flex items-center justify-center">
                  <font-awesome :icon="['fas', 'futbol']" class="text-2xl text-dark-text-tertiary"/>
                </div>
                <p class="text-dark-text-tertiary text-sm">No sport assigned yet</p>
              </div>

              <!-- Add Sport Button -->
              <button
                @click="showAddSportModal = true"
                class="w-full mt-4 py-3 px-4 rounded-xl border-2 border-dashed border-dark-border-default hover:border-brand-primary-color text-dark-text-secondary hover:text-brand-primary-color transition-all duration-200 flex items-center justify-center gap-2"
              >
                <font-awesome :icon="['fas', 'plus']"/>
                <span class="font-medium">Add Sport & Role</span>
              </button>
            </div>
          </div>

          <!-- Error Messages -->
          <div class="px-6 pt-4 space-y-2">
            <div
              v-if="errorMessageInvalidTypeOfPicture"
              class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
            >
              <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
              <span>Only .png, .jpg and .jpeg format allowed!</span>
            </div>
            <div
              v-if="errorMessageInvalidSize"
              class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
            >
              <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
              <span>The file size exceeds 2MB. Please choose a different file.</span>
            </div>
          </div>

          <!-- User Form -->
          <div class="p-6">
            <UserForm :userId="user.id" :showDisableEmails="showDisableEmails" />
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="rounded-2xl bg-dark-surface-default shadow-xl border border-dark-border-default xl:w-1/3 w-full">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-5 border-b border-dark-border-default bg-gradient-to-r from-dark-surface-default/50 to-dark-bg-primary/30 rounded-t-2xl">
            <p class="text-lg sm:text-xl font-bold flex items-center justify-start tracking-wide text-dark-text-primary">
              <span class="inline-block w-1 h-7 rounded-full bg-gradient-to-b from-red-500 via-orange-500 to-pink-500 mr-3 shadow-sm"/>
              Change Password
            </p>
          </div>

          <!-- Password Form -->
          <form @submit.prevent="changePassword" class="p-6">
            <div class="space-y-5">
              <div>
                <label
                  for="current-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  Current Password
                </label>
                <PasswordInput
                  v-model="currentPassword"
                  type="password"
                  name="currentPsw"
                  id="current-password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label
                  for="new-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  New Password
                </label>
                <PasswordInput
                  v-model="password"
                  type="password"
                  name="newPsw"
                  id="new-password"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label
                  for="confirm-password"
                  class="block mb-2 text-sm font-semibold text-dark-text-primary"
                >
                  Confirm Password
                </label>
                <PasswordInput
                  v-model="confirmPassword"
                  type="password"
                  name="confirmPsw"
                  id="confirm-password"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <!-- Error Messages -->
              <div class="space-y-2">
                <div
                  v-if="!isCorrectCurrentPassword"
                  class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
                >
                  <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
                  <span>Incorrect current password</span>
                </div>
                <div
                  v-if="errorMessage"
                  class="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-sm"
                >
                  <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-red-400"/>
                  <span>{{ errorMessage }}</span>
                </div>
              </div>

              <!-- Submit Button -->
              <BaseButton
                type="submit"
                class="w-full py-3 mt-2 font-semibold"
              >
                <span class="flex items-center justify-center gap-2">
                  <font-awesome :icon="['fas', 'key']" class="text-sm"/>
                  Change Password
                </span>
              </BaseButton>
            </div>
          </form>
        </div>
      </div>

      <SuccessAlert
        v-model:visible="showSuccessAlertUpdate"
        text="Your password has been successfully changed."
      />

      <SuccessAlert
        v-model:visible="showSuccessAlertSport"
        text="Sport and role have been added successfully."
      />

      <!-- Add Sport Modal -->
      <AddSportRoleModal
        v-model:visible="showAddSportModal"
        :existingSportIds="existingSportIds"
        @success="handleAddSportSuccess"
      />

      <!-- Switch Season Sport Modal -->
      <SwitchSeasonSportModal
        v-model:visible="showSwitchSeasonModal"
        @success="handleSeasonSportSwitched"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserForm from '~/components/forms/UserForm.vue';
import { useUserStore } from "~/store/user";
import Breadcrumb from '~/components/breadcrumb/Breadcrumb.vue';
import PasswordInput from '~/components/inputs/PasswordInput.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SuccessAlert from '~/components/alerts/SuccessAlert.vue';
import AddSportRoleModal from '~/components/modals/profile/AddSportRoleModal.vue';
import SwitchSeasonSportModal from '~/components/modals/season-sport/SwitchSeasonSportModal.vue';
import { useApiV5Fetch } from '~/composables/useApiV5Fetch';

const config = useRuntimeConfig()

const apiUrl = config.public.backendURL

const showDisableEmails = ref(false)

const { user, token } = useUserStore();
const userStore = useUserStore()

const userData = computed(() => {
  return useUserStore().user
})

// Sport & Role modal
const showAddSportModal = ref(false);
const showSuccessAlertSport = ref(false);

// Switch Season Sport modal
const showSwitchSeasonModal = ref(false);

// User's season sports with details
const userSeasonSports = ref<any[]>([]);
const loadingUserSeasonSports = ref(false);

// Existing sport IDs for filtering in modal
const existingSportIds = computed(() => {
  return userSeasonSports.value.map(
    (uss: any) => uss.season_sport?.sport_id || uss.season_sport?.sport?.id
  ).filter(Boolean);
});

// Current active season sport
const currentActiveSeasonSport = computed(() => {
  if (!userStore.seasonSportId || !userSeasonSports.value.length) {
    return null;
  }
  
  // Find the season sport that matches the current active one
  const activeUserSeasonSport = userSeasonSports.value.find((uss: any) => {
    const ssId = uss.season_sport?.id || uss.season_sport_id;
    return ssId === userStore.seasonSportId;
  });
  
  return activeUserSeasonSport?.season_sport || null;
});

const fileInput = ref()
const selectedFile = ref()
const errorMessageInvalidTypeOfPicture = ref(false)
const errorMessageInvalidSize = ref(false)
const isCorrectCurrentPassword = ref(true)
const password = ref("")
const confirmPassword = ref("")
const currentPassword = ref("")
const showSuccessAlertUpdate = ref(false)
const errorMessage = ref("");

// Get roles for a specific season_sport
function getUserRolesForSeasonSport(seasonSportId: number) {
  // Check both user_roles and userRoles (camelCase)
  const userRoles = user.user_roles || user.userRoles || [];
  if (!Array.isArray(userRoles)) {
    return [];
  }
  return userRoles
    .filter((ur: any) => ur.season_sport_id === seasonSportId && ur.user_role_approved_by_user_id >= 0)
    .map((ur: any) => ur.role)
    .filter(Boolean);
}

// Fetch user's season sports with details
async function fetchUserSeasonSports() {
  if (!user.id) return;
  
  loadingUserSeasonSports.value = true;
  try {
    const response = await useApiV5Fetch(`user-season-sports`, {
      query: {
        user_id: user.id,
        include: 'seasonSport.sport,seasonSport.season',
      },
    });

    if (response.data?.value && Array.isArray(response.data.value) && response.data.value.length > 0) {
      userSeasonSports.value = response.data.value as any[];
    } else {
      // Fallback to user's season_sports from store
      const seasonSports = user.season_sports || [];
      userSeasonSports.value = seasonSports.map((ss: any) => ({
        user_id: user.id,
        season_sport_id: ss.id,
        season_sport: ss,
        is_active: true,
      }));
    }
  } catch (e) {
    console.error('Failed to fetch user season sports:', e);
    const seasonSports = user.season_sports || [];
    userSeasonSports.value = seasonSports.map((ss: any) => ({
      user_id: user.id,
      season_sport_id: ss.id,
      season_sport: ss,
      is_active: true,
    }));
  } finally {
    loadingUserSeasonSports.value = false;
  }
}

// Handle successful sport addition
async function handleAddSportSuccess() {
  showSuccessAlertSport.value = true;
  await fetchUserSeasonSports();
}

async function handleSeasonSportSwitched() {
  await userStore.getMe();
  await fetchUserSeasonSports();
}

// Initialize data on mount
onMounted(() => {
  fetchUserSeasonSports();
});

async function selectFiles() {
    fileInput.value.click()
}

async function onChangeFile() {
  try {
    errorMessageInvalidTypeOfPicture.value = false
    errorMessageInvalidSize.value = false
    selectedFile.value = fileInput.value.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (selectedFile.value.size > maxSize) {
      errorMessageInvalidSize.value = true;
    } else {
      const data = new FormData();
        data.append('picture', selectedFile.value);
        const response = await useApiV5Fetch(`users/${user.id}`, {
          method: "put",
          headers: {
            'Authorization':`Bearer ${token}`,
          },
          body: data,
        });

      useUserStore().getMe()

      if(!response.data.value ) {
        errorMessageInvalidTypeOfPicture.value = true
      }
    }
    } catch (error) {
    console.error('Error saving user:', error);
  }
}

const validatePasswords = () => {
  errorMessage.value = "";

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return false;
  }

  if (password.value.length < 8 || confirmPassword.value.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long.";
    return false;
  }

  return true;
};

const changePassword = async () => {
  isCorrectCurrentPassword.value = true;
errorMessage.value = ""
  if (!validatePasswords()) {
    return; 
  }

  try {
    const response: any = await userStore.changePassword(
      user.email as string,
      currentPassword.value,
      password.value
    );

    if (response && response.value && response.value === "Incorrect current password") {
      isCorrectCurrentPassword.value = false;
    } else {
      isCorrectCurrentPassword.value = true;
      showSuccessAlertUpdate.value = true;
      currentPassword.value = "";
      password.value = "";
      confirmPassword.value = "";
    }

  } catch (error) {
    console.error("Password reset failed:", error);
  }
};
</script>

<style scoped>
/* Avatar hover effects */
.group:hover .user-icon {
  display: none;
}
</style>
