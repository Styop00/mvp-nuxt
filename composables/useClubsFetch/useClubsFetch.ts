import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Clubs from "~/interfaces/clubs/club";
import type ClubsTableData from "~/interfaces/clubs/clubTableData";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import { useUserStore } from "~/store/user";
import type Users from "~/interfaces/users/users";

export function useClubsFetch() {
  const clubs = ref([] as Array<ClubsTableData>);
  const originalData = ref([] as Array<Clubs>);
  const orderBy = ref("name");
  const orderDirection = ref("asc");
  const page = ref(1);
  const userStore = useUserStore();
  const limit = ref({
    label: "10",
    value: 10,
    disabled: false,
  } as SelectOptions);

  const searchQuery = ref("");
  const count = ref(0 as Number);
  const loading = ref(false);

  async function fetchClubsByIds(ids: number[]) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("clubs", {
        query: {
          clubIds: ids,
        },
      });

      if (!response.data?.value) {
        console.error(`Club with ids: ${ids} not found`);
        return {rows: [], count: 0}  as { rows: Clubs[], count: number };
      }

      return response.data.value as { rows: Clubs[], count: number };
    } finally {
      loading.value = false;
    }
  }

  async function fetchClubs() {
    loading.value = true;
    try {
      const activeSeasonSport = userStore.seasonSportId;

      const response = await useApiV5Fetch("clubs", {
        query: {
          page: page.value,
          limit: limit.value.value,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          searchTerm: searchQuery.value,
          seasonSportId: activeSeasonSport,
          deleted: false,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const result = response.data.value as { rows: Clubs[]; count: number };

      clubs.value = result.rows.map(data => {
        const managers = data.managers
            .map((user) => user.name)
            .filter((name) => !!name)
            .map((name) => `<span class="text-[14px]">${name}</span>`)
            .join(", ");
        return {
          id: data.id,
          name: `${data.name} (${data.shortName})`,
          managers: managers,
          license: data.license,
          isActive: data.isActive,
        };
      })
      originalData.value = result.rows;
      count.value = result.count;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllClubs(data: any) {
    const response = await useApiV5Fetch("clubs/all", {
      query: {
        ...data,
        deleted: false,
      },
    });

    if (response.data?.value) {
      return response.data.value as Array<Clubs>;
    }

    return [];
  }

  async function createClub(clubs: Partial<Clubs>) {
    loading.value = true;
    try {
      const activeSeasonSport = userStore.seasonSportId;
      const response = await useApiV5Fetch("clubs", {
        method: "POST",
        body: clubs,
        query: {
          seasonSportId: activeSeasonSport,
        },
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateClub(id: number, club: Partial<Clubs>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`clubs/${id}`, {
        method: "PUT",
        body: club,
      });

      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteClub(id: number) {
    loading.value = true;
    clubs.value = [];
    try {
      const response = await useApiV5Fetch(`clubs/${id}`, {
        method: "DELETE",
      });
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
    fetchClubs();
  }

  async function fetchClubById(id: number) {
    const response = await useApiV5Fetch(`clubs/${id}`);
    if (!response.data?.value) {
      return {} as Clubs;
    }

    return response.data?.value as Clubs;
  }

  async function fetchClubByIdWithCourts(id: number) {
    const response = await useApiV5Fetch(`clubs/${id}/courts`);
    if (!response.data?.value) {
      return {} as Clubs;
    }

    return response.data?.value as Clubs;
  }

  async function fetchClubByCondition(requestData?: object) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("clubs", {
        query: {
          ...requestData,
          seasonSportId: userStore.seasonSportId,
          deleted: false,
        },
      });

      if (!response.data?.value) {
        return {count: 0, rows: []};
      }

      return response.data.value as { count: Number; rows: Array<Clubs> };
    } finally {
      loading.value = false;
    }
  }

  async function getClubUsers(id: number, data?: any) {
    const response = await useApiV5Fetch(`clubs/${id}/users`, {
      query: {
        ...data,
        seasonSportId: userStore.seasonSportId,
      },
    });

    if (!response.data?.value) {
      return null;
    }

    return response.data.value as { rows: Users[], count: number };
  }

  async function getAllClubUsers(id: number, data?: any) {
    const response = await useApiV5Fetch(`clubs/${id}/users/all`, {
      query: {
        ...data,
        seasonSportId: userStore.seasonSportId,
      },
    });

    if (!response.data?.value) {
      return [];
    }

    return response.data.value as Users[];
  }

  async function addClubUser(id: number, data: any) {
    const response = await useApiV5Fetch(`clubs/${id}/users`, {
      method: "POST",
      body: data
    })

    return response.data?.value;
  }

  return {
    clubs,
    originalData,
    orderBy,
    orderDirection,
    fetchClubs,
    createClub,
    updateClub,
    deleteClub,
    fetchClubById,
    sort,
    page,
    count,
    limit,
    searchQuery,
    fetchClubsByIds,
    fetchClubByIdWithCourts,
    loading,
    fetchClubByCondition,
    fetchAllClubs,
    getClubUsers,
    addClubUser,
    getAllClubUsers,
  };
}
