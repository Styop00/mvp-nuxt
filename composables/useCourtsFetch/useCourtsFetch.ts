import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Courts from "~/interfaces/courts/courts";


export function useCourtsFetch() {
  const courts = ref([] as Array<Courts>);
  const loading = ref(false);

  async function fetchCourtsByVenueId(venueId: number) {
    loading.value = true;
    courts.value = []
    try {
      const response = await useApiV5Fetch("courts", {
        query: {
          venueId,
        },
      });

      if (!response.data?.value) {
        console.error(
          `Court associated with specific venue: ${venueId} not found`
        );
        return null;
      }

      return response.data.value;
    } finally {
      loading.value = false;
    }
  }

  async function createCourt(
    court: Partial<Courts>,
    courtRequirement1: number | null,
    courtRequirement2: number | null,
    courtRequirement3: number | null,
    courtRequirement4: number | null
  ) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("courts", {
        method: "POST",
        body: court, 
        query: {
          courtRequirement1,
          courtRequirement2,
          courtRequirement3,
          courtRequirement4,
        },
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateCourt(
    id: number,
    court: Partial<Courts>,
    courtRequirement1: number | null,
    courtRequirement2: number | null,
    courtRequirement3: number | null,
    courtRequirement4: number | null
  ) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`courts/${id}`, {
        method: "PUT",
        body: court, 
        query: {
          courtRequirement1,
          courtRequirement2,
          courtRequirement3,
          courtRequirement4,
        },
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCourtById(id: number) {
    const response = await useApiV5Fetch(`courts/${id}`);
    if (!response.data?.value) {
      return {} as Courts;
    }
    return response.data?.value as Courts;
  }

  async function fetchAllCourts(seasonSportId: number) {
    const response = await useApiV5Fetch(`courts/all`, {
      query: {
        seasonSportId: seasonSportId
      }
    });

    return response.data?.value as Array<Courts>;
  }

  async function fetchCourtsForClubs(clubIds: Array<number>) {
    const response = await useApiV5Fetch(`courts/for-clubs`, {
      query: {
        clubIds: clubIds
      }
    });

    return response.data?.value as Array<Courts>;
  }

  async function deleteCourt(id: number) {
    loading.value = true;
    courts.value = []
    try {
      const response = await useApiV5Fetch(`courts/${id}`, {
        method: "DELETE",
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    fetchCourtsByVenueId,
    createCourt,
    updateCourt,
    fetchCourtById,
    deleteCourt,
    courts,
    loading,
    fetchAllCourts,
    fetchCourtsForClubs
  };
}
