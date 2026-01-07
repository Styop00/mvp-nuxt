import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Coach from "~/interfaces/coaches/coach";
import type CoachTableData from "~/interfaces/coaches/coachTableData";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import { useUserStore } from "~/store/user";
import type CoachInfoDto from "~/interfaces/coaches/coachInfoData";

export function useCoachesFetch() {
  const coaches = ref([] as Array<CoachTableData>);
  const originalData = ref([] as Array<Coach>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");
  const page = ref(1);
  const tournamentGroupId = ref();
  const ageGroup = ref();

  const userStore = useUserStore();
  const limit = ref({
    label: "10",
    value: 10,
    disabled: false,
  } as SelectOptions);

  const searchQuery = ref("");
  const count = ref(0 as Number);
  const loading = ref(false);

  async function fetchAllCoaches() {
    loading.value = true;
    try {
      const activeSeasonSport = userStore.seasonSportId;

      const response = await useApiV5Fetch("coaches", {
        query: {
          page: page.value,
          limit: limit.value.value,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          searchTerm: searchQuery.value,
          deleted: false,
          tournamentGroupId: tournamentGroupId.value,
          ageGroup: ageGroup.value,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const result = response.data.value as { rows: Coach[]; count: number };

      coaches.value = result.rows.map((data) => {
        let teams = "";

        let activeForTeamsData: string = "";
        if (data.person?.user?.userRoles.length > 0) {
          data.person.user.userRoles.map((team) => {
            if (team.team) {
              teams += `${team?.team?.club?.name || ""} - ${
                team?.team?.localName
                  ? team?.team?.localName
                  : team?.team?.tournamentName
              } <br>`;
            }
          });
        }
        let coachEducation: string = "";
        if (data.coachEducation.length > 0) {
          const sortedEducation = data.coachEducation.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          coachEducation = `${sortedEducation[0].date
            .split("-")
            .reverse()
            .join("-")} ${sortedEducation[0]?.module}`;
        }

        return {
          id: data.id,
          name: data.person?.name ? `${data.person?.name}` : "",
          license: data.license,
          status: `
            <span class="px-2 py-1 rounded-sm text-[9px] font-bold ${
              data.person?.user?.userRoles?.length
                ? "text-brand-green bg-green-100"
                : "text-red-500 bg-red-100"
            }">
              ${data.person?.user?.userRoles?.length ? "Active" : "Inactive"}
            </span>
            ${
              new Date(data.end).getTime() <= Date.now()
                ? '<span class="text-red-500 pl- text-[10px]">expired</span>'
                : ""
            }
          `,
          email: data.person?.email,
          level: data.level ? data.level : "No education",
          activeForTeam: teams,
          latestCourse: coachEducation || "",
        };
      });
      originalData.value = result.rows;
      count.value = result.count;
    } finally {
      loading.value = false;
    }
  }

  async function createCoach(name: string, email: string) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("coaches/create-coach", {
        method: "POST",
        body: { name, email, seasonSportId: userStore.seasonSportId },
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCoach(id: number) {
    loading.value = true;
    coaches.value = [];
    try {
      const response = await useApiV5Fetch(`coaches/${id}`, {
        method: "DELETE",
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function editCoach(id: number, body: Coach) {
    loading.value = true;
    coaches.value = [];
    try {
      const response = await useApiV5Fetch(`coaches/${id}`, {
        method: "PUT",
        body: body,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function editCoachInfo(body: CoachInfoDto) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`coaches/coachinfo`, {
        method: "PUT",
        body: body,
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
    fetchAllCoaches();
  }

  async function fetchCoachById(id: number) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`coaches/${id}`, {
        method: "GET",
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }
  return {
    originalData,
    orderBy,
    orderDirection,
    fetchAllCoaches,
    coaches,
    sort,
    page,
    count,
    limit,
    searchQuery,
    loading,
    deleteCoach,
    createCoach,
    tournamentGroupId,
    ageGroup,
    fetchCoachById,
    editCoachInfo,
  };
}
