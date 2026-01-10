import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type Venues from "~/interfaces/venues/venues";
import type VenuesTableData from "~/interfaces/venues/venuesTableData";
import { useUserStore } from "~/store/user";

export function useVenuesFetch() {
  const venues = ref([] as Array<VenuesTableData>);
  const originalData = ref([] as Array<Venues>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");
  const page = ref(1);
  const limit = ref({
    label: "10",
    value: 10,
    disabled: false,
  } as SelectOptions);

  const count = ref(0 as Number);
  const searchQuery = ref("");
  const loading = ref(false);
  const userStore = useUserStore();
  const seasonSportId = userStore.seasonSportId;

  async function fetchVenues() {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("venues", {
        query: {
          page: page.value,
          limit: limit.value.value,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          searchTerm: searchQuery.value,
          seasonSportId,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const result = response.data.value as { rows: Venues[]; count: number };
      venues.value = result.rows.map(data => {
        return {
          id: data.id,
          name: data.name,
          country: data.country,
          courts: data.courts
              .map((court) => `<p class="text-[14px]">${court.name}</p>`)
              .join(""),
        }
      })
      originalData.value = result.rows;
      count.value = result.count;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllVenues(data: any) {
    const response = await useApiV5Fetch("venues/all", {
      query: data,
    });

    if (!response.data?.value) {
      return [] as Venues[];
    }

    return response.data.value as Venues[]
  }

  async function createVenue(sport: Partial<Venues>) {
    const response = await useApiV5Fetch("venues", {
      method: "POST",
      body: sport,
      query: { season_sport_id: seasonSportId },
    });
    if (response.data?.value) {
      return response.data?.value as Venues;
    }
    return null;
  }

  async function updateVenue(
    id: number,
    venue: Partial<Venues>,
    additionalData = {}
  ) {
    const response = await useApiV5Fetch(`venues/${id}`, {
      method: "PUT",
      body: { ...venue, ...additionalData },
    });
    if (response.data?.value) {
      return response.data?.value;
    }
    return null;
  }

  async function deleteVenue(id: number) {
    loading.value = true;
    venues.value = [];
    try {
      const response = await useApiV5Fetch(`venues/${id}`, {
        method: "DELETE",
      });
      if (response.data?.value) {
        fetchVenues();
        return response.data?.value;
      }
    } finally {
      loading.value = false;
    }
  }

  function sort(column: string) {
    if (orderBy.value === column) {
      orderDirection.value = orderDirection.value === "asc" ? "desc" : "asc";
    } else {
      orderBy.value = column;
      orderDirection.value = "asc";
    }
    fetchVenues();
  }

  return {
    venues,
    originalData,
    orderBy,
    orderDirection,
    fetchVenues,
    createVenue,
    updateVenue,
    deleteVenue,
    fetchAllVenues,
    searchQuery,
    sort,
    page,
    limit,
    count,
    loading,
  };
}
