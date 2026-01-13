<template>
  <BaseModalComponent v-model:visible="modalVisible" :width="4" title="Switch Season Sport">
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <font-awesome :icon="['fas', 'spinner']" class="fa-spin text-2xl text-brand-primary-color"/>
      </div>

      <div v-else class="space-y-4">
        <!-- Current Season Sports -->
        <div v-if="currentSeasonSports.length > 0">
          <h3 class="text-sm font-semibold text-dark-text-primary mb-2">Your Current Season Sports</h3>
          <div class="space-y-2">
            <div
                v-for="seasonSport in currentSeasonSports"
                :key="seasonSport.id"
                @click="selectSeasonSport(seasonSport)"
                :class="[
                'p-3 rounded-lg border cursor-pointer transition-all',
                selectedSeasonSportId === seasonSport.id
                  ? 'border-brand-primary-color bg-brand-primary-color/10'
                  : 'border-dark-border-default hover:border-brand-primary-color/50 hover:bg-dark-bg-hover'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-dark-text-primary">
                    {{ seasonSport.season?.name }} {{ seasonSport.sport?.name }}
                  </p>
                  <p v-if="seasonSport.id === userStore.seasonSportId" class="text-xs text-brand-primary-color mt-1">
                    Currently Active
                  </p>
                </div>
                <font-awesome
                    v-if="selectedSeasonSportId === seasonSport.id"
                    :icon="['fas', 'check-circle']"
                    class="text-brand-primary-color"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Season Sports -->
        <div v-if="latestSeasonSports.length > 0" class="pt-4 border-t border-dark-border-default">
          <h3 class="text-sm font-semibold text-dark-text-primary mb-2">Latest Seasons Available</h3>
          <div class="space-y-2">
            <div
                v-for="seasonSport in latestSeasonSports"
                :key="seasonSport.id"
                @click="selectSeasonSport(seasonSport)"
                :class="[
                'p-3 rounded-lg border cursor-pointer transition-all',
                selectedSeasonSportId === seasonSport.id
                  ? 'border-brand-primary-color bg-brand-primary-color/10'
                  : 'border-dark-border-default hover:border-brand-primary-color/50 hover:bg-dark-bg-hover'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-dark-text-primary">
                    {{ seasonSport.season?.name }} {{ seasonSport.sport?.name }}
                  </p>
                  <p class="text-xs text-dark-text-secondary mt-1">
                    Click to attach to this season
                  </p>
                </div>
                <font-awesome
                    v-if="selectedSeasonSportId === seasonSport.id"
                    :icon="['fas', 'check-circle']"
                    class="text-brand-primary-color"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- No season sports message -->
        <div v-if="!loading && currentSeasonSports.length === 0 && latestSeasonSports.length === 0"
             class="text-center py-8">
          <p class="text-sm text-dark-text-secondary">No season sports available</p>
        </div>

        <!-- Error message -->
        <div v-if="error"
             class="flex items-center gap-2 p-2.5 rounded-lg bg-red-900/20 border border-red-500/50 text-red-400 text-xs">
          <font-awesome :icon="['fas', 'triangle-exclamation']" class="text-xs"/>
          <span>{{ error }}</span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4 border-t border-dark-border-default">
          <button
              type="button"
              @click="closeModal"
              class="flex-1 py-2.5 px-3 rounded-lg bg-dark-bg-primary border border-dark-border-default text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-hover transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <BaseButton
              type="button"
              class="flex-1 py-2.5 text-sm"
              :disabled="!selectedSeasonSportId || isSwitching"
              @click="switchSeasonSport"
          >
            <span v-if="isSwitching" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Switching...
            </span>
            <span v-else>Switch</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import {useUserStore} from '~/store/user';
import {useApiV5Fetch} from '~/composables/useApiV5Fetch';
import type SeasonSport from '~/interfaces/seasonSports/seasonSports';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'success']);

const userStore = useUserStore();
const {user} = userStore;

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const loading = ref(false);
const error = ref('');
const isSwitching = ref(false);
const selectedSeasonSportId = ref<number | null>(null);
const currentSeasonSports = ref<SeasonSport[]>([]);
const latestSeasonSports = ref<SeasonSport[]>([]);

// Load current and latest season sports from backend
async function loadSeasonSports() {
  loading.value = true;
  error.value = '';

  try {
    // Fetch existing and latest season sports from backend
    const response = await useApiV5Fetch('user-season-sports/existing-and-latest');

    if (!response.data?.value) {
      error.value = 'Failed to load season sports. Please try again.';
      return;
    }

    const data = response.data.value as {
      existing: SeasonSport[];
      latest: SeasonSport[];
    };

    currentSeasonSports.value = data.existing || [];
    latestSeasonSports.value = data.latest || [];

    // Set initial selection to current active season sport
    if (userStore.seasonSportId) {
      selectedSeasonSportId.value = userStore.seasonSportId;
    } else if (currentSeasonSports.value.length > 0) {
      selectedSeasonSportId.value = currentSeasonSports.value[0].id;
    }
  } catch (e) {
    console.error('Failed to load season sports:', e);
    error.value = e instanceof Error ? e.message : 'Failed to load season sports. Please try again.';
  } finally {
    loading.value = false;
  }
}

function selectSeasonSport(seasonSport: SeasonSport) {
  selectedSeasonSportId.value = seasonSport.id;
}

async function switchSeasonSport() {
  if (!selectedSeasonSportId.value || !user?.id) {
    return;
  }

  isSwitching.value = true;
  error.value = '';

  try {
    // Check if user already has this season_sport
    const userHasSeasonSport = currentSeasonSports.value.some(
        (ss) => ss.id === selectedSeasonSportId.value
    );

    if (!userHasSeasonSport) {
      // Create user_season_sport entry
      await useApiV5Fetch('user-season-sports', {
        method: 'POST',
        body: {
          user_id: user.id,
          season_sport_id: selectedSeasonSportId.value,
          is_active: true,
        },
      });
    }

    // Update store with selected season_sport_id
    userStore.setSeasonSportId(selectedSeasonSportId.value);

    // Refresh user data
    await userStore.getMe();

    emit('success');
    closeModal();
  } catch (e) {
    console.error('Failed to switch season sport:', e);
    error.value = e instanceof Error ? e.message : 'Failed to switch season sport. Please try again.';
  } finally {
    isSwitching.value = false;
  }
}

function closeModal() {
  modalVisible.value = false;
  selectedSeasonSportId.value = null;
  error.value = '';
}

// Load data when modal opens
watch(modalVisible, (newValue) => {
  if (newValue) {
    loadSeasonSports();
  }
});

// Set initial selection when current season sports change
watch(() => userStore.seasonSportId, (newId) => {
  if (newId && modalVisible.value) {
    selectedSeasonSportId.value = newId;
  }
});
</script>

