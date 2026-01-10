<template>
  <BaseModalComponent v-model:visible="modal" :width="3">
    <div class="p-4">
      <p class="font-bold mb-4">
        {{props.venueName}}
      </p>

      <div class="mb-4">
        <SearchableSelect
          :model-value="selectedTeam"
          :options="teamOptions"
          :is-loading="isLoadingFetchByTeamName"
          label="Team Name"
          placeholder="Search by team local name or tournament name..."
          :required="true"
          :min-search-length="2"
          @update:model-value="handleTeamSelect"
          @search="handleSearch"
        />
        <span class="text-sm text-red-600">
          {{ teamNameError }}
        </span>
        <span class="text-sm text-green-600">
          {{ teamNameSuccessMessage }}
        </span>
        <span class="text-sm text-red-600">
          {{ props.errorMessage1 }}
        </span>
      </div>

      <div class="mb-6">
        Search for a team by its local name or tournament name to find and add its club to this venue.
      </div>

      <div class="flex justify-center">
        <BaseButton
          type="button"
          class="bg-red-600 text-white mr-2"
          @click="cancelAction"
          >Cancel</BaseButton
        >
        <BaseButton
          type="button"
          @click="confirmAction"
          :disabled="isLoadingFetchByTeamName"
          >Confirm</BaseButton
        >
      </div>
    </div>
  </BaseModalComponent>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModalComponent from '~/components/modals/BaseModalComponent.vue';
import BaseButton from '~/components/buttons/BaseButton.vue';
import SearchableSelect from '~/components/inputs/SearchableSelect.vue';
import type Clubs from '~/interfaces/clubs/club';
import type Team from '~/interfaces/teams/team';
import type { SearchableSelectOption } from '~/components/inputs/SearchableSelect.vue';
import { useTeamsFetch } from '~/composables/useTeamsFetch/useTeamsFetch';
import { useClubsFetch } from '~/composables/useClubsFetch/useClubsFetch';
import { debounce } from '~/utils/debounce';

const { fetchTeams } = useTeamsFetch()
const { fetchClubById } = useClubsFetch()

const props = defineProps({
  venueName: String,
  visible: Boolean,
  id: Number,
  message: String,
  showErrorAlert: Boolean,
  errorMessage: String,
  errorMessage1: String,
});


const emit = defineEmits(['update:visible', 'confirm', 'refreshData']);

const modal = ref(false);
const selectedTeam = ref<SearchableSelectOption | null>(null);
const teamOptions = ref<SearchableSelectOption[]>([]);
const team = ref<Team | null>(null)
const club = ref<Clubs | null>(null)
const errorEmpty = ref(false);

watch(() => props.visible, () => {
  selectedTeam.value = null;
  teamOptions.value = [];
  team.value = null;
  club.value = null;
  teamNameError.value = '';
  teamNameSuccessMessage.value = '';
  modal.value = props.visible;
});

watch(() => modal.value, () => {
  if (!modal.value) {
    emit('update:visible', false);
  }
});

const searchedClub = ref({} as Clubs)
const teamNameError = ref('')
const teamNameSuccessMessage = ref('')
const isLoadingFetchByTeamName = ref(false);

// Search function
async function searchTeams(searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) {
    teamOptions.value = [];
    return;
  }

  isLoadingFetchByTeamName.value = true;
  teamNameError.value = '';
  teamNameSuccessMessage.value = '';

  try {
    const res = await fetchTeams(
      null, // clubId
      null, // orderBy
      null, // orderDirection
      1,    // page
      20,   // limit - increased to show more results
      searchTerm.trim() // searchQuery
    ) as { count: Number, rows: Array<Team> };

    if (res.count && res.count > 0) {
      teamOptions.value = res.rows.map((team: Team) => ({
        label: `${team.local_name || team.tournament_name || 'Unknown'}${team.tournament_name && team.local_name ? ` (${team.tournament_name})` : ''}`,
        value: team,
        disabled: false
      }));
    } else {
      teamOptions.value = [];
    }
  } catch (error) {
    teamNameError.value = 'Error searching for teams.';
    teamOptions.value = [];
  } finally {
    isLoadingFetchByTeamName.value = false;
  }
}

// Debounced search function
const debouncedSearchTeams = debounce((searchTerm: string) => {
  searchTeams(searchTerm);
}, 300);

// Wrapper to use debounced search
function handleSearch(searchTerm: string) {
  debouncedSearchTeams(searchTerm);
}

async function handleTeamSelect(option: SearchableSelectOption) {
  if (!option || !option.value) {
    selectedTeam.value = null;
    team.value = null;
    club.value = null;
    teamNameError.value = '';
    teamNameSuccessMessage.value = '';
    return;
  }

  // Set the selected team immediately
  selectedTeam.value = option;
  team.value = option.value as Team;
  
  // Clear previous messages
  teamNameError.value = '';
  teamNameSuccessMessage.value = '';

  // Get the club from the team
  if (team.value.club_id) {
    try {
      const clubData = await fetchClubById(team.value.club_id);
      if (clubData && clubData.id) {
        club.value = clubData as Clubs;

        const existingVenueRelation = club.value.club_venues?.some(venue => {
          return venue.venue_id === props.id
        });

        if (existingVenueRelation) {
          teamNameError.value = 'This club has already been added to this venue.';
          selectedTeam.value = null;
          team.value = null;
          club.value = null;
        } else {
          searchedClub.value = club.value;
          teamNameSuccessMessage.value = `Found club: ${club.value.name}`;
          // Ensure selectedTeam is still set on success
          selectedTeam.value = option;
        }
      } else {
        teamNameError.value = 'Club not found for this team.';
        selectedTeam.value = null;
        team.value = null;
        club.value = null;
      }
    } catch (error) {
      teamNameError.value = 'Error fetching club information.';
      selectedTeam.value = null;
      team.value = null;
      club.value = null;
    }
  } else {
    teamNameError.value = 'Team does not have an associated club.';
    selectedTeam.value = null;
    team.value = null;
    club.value = null;
  }
}

function confirmAction() {
  if (isLoadingFetchByTeamName.value) {
    return;
  }
  
  // Clear any previous error messages first
  teamNameError.value = '';
  
  // Check if we have all required data
  if (!selectedTeam.value || !team.value || !club.value) {
    teamNameError.value = "Please select a team first.";
    return;
  }
  
  // Check if there's an error message (from validation)
  if (teamNameError.value) {
    // If there's an error, don't proceed
    return;
  }
  
  const teamName = team.value.local_name || team.value.tournament_name || '';
  if (teamName && club.value) {
    // Send team name and club object
    emit('confirm', teamName, club.value);
    teamNameSuccessMessage.value = "";
    // Reset after successful confirmation
    selectedTeam.value = null;
    teamOptions.value = [];
    team.value = null;
    club.value = null;
  } else {
    teamNameError.value = "Please select a team first.";
  }
}

function cancelAction() {
  selectedTeam.value = null;
  teamOptions.value = [];
  team.value = null;
  club.value = null;
  teamNameError.value = ""
  teamNameSuccessMessage.value = ""
  modal.value = false;
  emit('update:visible', false);
}
</script>
