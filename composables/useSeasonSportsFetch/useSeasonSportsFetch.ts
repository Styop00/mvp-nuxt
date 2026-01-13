import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";

export interface SeasonSport {
  id: number;
  season_id: number;
  sport_id: number;
  season?: {
    id: number;
    name: string;
  };
  sport?: {
    id: number;
    name: string;
  };
}

export function useSeasonSportsFetch() {
  const seasonSports = ref<SeasonSport[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSeasonSports() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await useApiV5Fetch("season-sport", {
        query: {
          include: 'season,sport',
        },
      });

      if (!response.data?.value) {
        return;
      }

      seasonSports.value = response.data.value as SeasonSport[];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch season sports';
    } finally {
      loading.value = false;
    }
  }

  return {
    seasonSports,
    loading,
    error,
    fetchSeasonSports,
  };
}

