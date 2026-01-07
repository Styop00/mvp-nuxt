import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Clubs from "~/interfaces/clubs/club";
import type ClubsTableData from "~/interfaces/clubs/clubTableData";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import type { RegistrationRequestData } from "~/interfaces/registration/registration";
import type Registration from "~/interfaces/registration/registration";

export function useRegistrationFetch() {
  const registrations = ref([] as Array<ClubsTableData>);
  const originalData = ref([] as Array<Clubs>);
  const orderBy = ref("name");
  const orderDirection = ref("asc");
  const page = ref(1);
  const limit = ref({
    label: "10",
    value: 10,
    disabled: false,
  } as SelectOptions);

  const searchQuery = ref("");
  const count = ref(0 as Number);
  const clubNames = ref("");

  async function fetchRegistrationsByTournamentGroupId(id: number) {
    const response = await useApiV5Fetch("/registration", {
      query: {
        tournamentGroupId: id,
      },
    });

    if (!response.data?.value) {
      console.error(`Club with id: ${id} not found`);
      return null;
    }

    const result = response.data.value as {
      rows: Registration[];
      count: number;
    };

    clubNames.value = result.rows
      .filter((item) => item.count > 0)
      .map((item, index) => {
        return `
        <div class="class="py-1 text-nowrap"> <p> ${index + 1}. ${
          item.club.name
        } (Pool: ${item.level}, Teams: ${item.count})</p>
        </div>`;
      })
      .join("");

    return response.data.value;
  }
  async function createOrEditBulkRegistration(
    registration: Partial<Registration>
  ): Promise<RegistrationRequestData[]> {
    const response = await useApiV5Fetch("registration/bulk", {
      method: "POST",
      body: registration,
    });

    if (Array.isArray(response.data?.value)) {
      return response.data?.value as RegistrationRequestData[];
    } else {
      throw new Error("Unexpected response format");
    }
  }

  return {
    registrations,
    originalData,
    orderBy,
    orderDirection,
    createOrEditBulkRegistration,
    page,
    count,
    limit,
    searchQuery,
    fetchRegistrationsByTournamentGroupId,
    clubNames,
  };
}
