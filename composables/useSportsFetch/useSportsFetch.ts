import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Sports from "~/interfaces/sports/sports";
import type SportsTableData from "~/interfaces/sports/sportsTableData";

export function useSportsFetch() {
  const sports = ref([] as Array<SportsTableData>);
  const originalData = ref([] as Array<Sports>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");
  const loading = ref(false);

  async function fetchSports() {
    loading.value = true;
    sports.value = []
    try {
      const response = await useApiV5Fetch("sports", {
        query: {
          deleted: false,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const res = response.data.value as Array<Sports>;
      sports.value = [];

      res.forEach((data) => {
        sports.value.push({
          id: data.id,
          name: data.name,
        });
      });
      originalData.value = res;
    } finally {
      loading.value = false;
    }
  }

  async function createSport(sport: Partial<Sports>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("sports", {
        method: "POST",
        body: sport,
      });
      if (response.data?.value) {
        fetchSports();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateSport(id: number, sport: Partial<Sports>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`sports/${id}`, {
        method: "PUT",
        body: sport,
      });
      if (response.data?.value) {
        fetchSports();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSport(id: number) {
    loading.value = true;
    sports.value = []
    try {
      const response = await useApiV5Fetch(`sports/${id}`, {
        method: "DELETE",
      });
      if (response.data?.value) {
        fetchSports();
      }
      return response.data?.value;
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
    fetchSports();
  }

  return {
    sports,
    originalData,
    orderBy,
    orderDirection,
    fetchSports,
    createSport,
    updateSport,
    deleteSport,
    sort,
    loading,
  };
}
