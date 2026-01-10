import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import { useUserStore } from "~/store/user";
import type RefereeTableData from "~/interfaces/referees/refereeTableData";
import type {
  IReferee,
  Referee,
  RefereeGetRefList,
} from "~/interfaces/referees/referee";

export function useRefereesFetch() {
  const referees = ref([] as Array<RefereeTableData>);
  const originalData = ref([] as Array<Referee>);
  const orderBy = ref("id");
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

  async function fetchAllReferees() {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("referees", {
        query: {
          page: page.value,
          limit: limit.value.value,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
          searchTerm: searchQuery.value,
          deleted: false,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const result = response.data.value as { rows: Referee[]; count: number };

      referees.value = result.rows.map((data) => {
        const baseLevel = `${data.prio || 0}/${data.maxStarRating || 0}`;
        const level = userStore.isAdmin.value
          ? baseLevel +
            (data.mentor ? " (M)" : "") +
            (data.prospect ? " (P)" : "") +
            (data.onlyWithBetter ? " (N)" : "") +
            (data.reserve ? " (R)" : "") +
            (data.commisionerLevel ? " (K)" : "") +
            (data.evaluatorLevel ? " (B)" : "") +
            (data.canThree ? " (3PO)" : "")
          : baseLevel +
            (data.reserve ? " (R)" : "") +
            (data.onlyWithBetter ? " (N)" : "");

        return {
          id: data.id,
          name: data.user?.name,
          address: data.user?.addressLine1,
          no: data.license,
          email: data.user?.email,
          level,
        };
      });
      originalData.value = result.rows;
      count.value = result.count;
    } finally {
      loading.value = false;
    }
  }

  async function createEditRef(body: any) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("referees", {
        method: "POST",
        body: { ...body, season_sport_id: userStore.seasonSportId },
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteReferee(id: number) {
    loading.value = true;
    referees.value = [];
    try {
      const response = await useApiV5Fetch(`referees/${id}`, {
        method: "DELETE",
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function getRefereeById(id: number): Promise<Referee | null> {
    const response: { data?: { value?: Referee } } = await useApiV5Fetch(
      `referees/${id}`,
      {
        method: "GET",
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function performDeleteRef(bodyParams: {
    gameId: number;
    pos: number;
    forUserId: number;
    season_sport_id: number;
    nomoregames: number;
    userId?: number;
  }): Promise<IReferee | null> {
    const response: { data?: { value?: IReferee } } = await useApiV5Fetch(
      `referees/ref-delete-from-game`,
      {
        method: "POST",
        body: bodyParams,
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function performSetRef(
    bodyParams: {
      gameId: number;
      refUserId?: number;
      license?: number;
      pos: number;
      nomoregames?: number;
      userId?: number;
      season_sport_id: number;
    } = {
      gameId: 0,
      refUserId: 0,
      pos: 0,
      season_sport_id: 0,
      nomoregames: 0,
    }
  ): Promise<IReferee | null> {
    const response: { data?: { value?: IReferee } } = await useApiV5Fetch(
      `referees/save-ref-draft`,
      {
        method: "POST",
        body: bodyParams,
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function bulkPerformSetRef(
    bodyParams: {
      gameId: number;
      refUserId?: number;
      license?: number | null;
      pos: number;
      nomoregames?: number;
      userId?: number | null;
      season_sport_id: number;
    }[]
  ): Promise<string | null> {
    const response: { data?: { value?: string | null } } = await useApiV5Fetch(
      `referees/bulk-save-ref-draft`,
      {
        method: "POST",
        body: bodyParams,
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function performSetInMvp(bodyParams: {
    gameId: number;
    pos: number;
    season_sport_id: number;
    userId: number;
  }): Promise<IReferee | null> {
    const response: { data?: { value?: IReferee } } = await useApiV5Fetch(
      `referees/set-free`,
      {
        method: "POST",
        body: bodyParams,
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function selectRefForGame(
    bodyParams: {
      gameId: number;
      pos: number;
      gameRoleId?: number;
      season_sport_id: number;
      userId?: number | null;
      generateRunId?: number;
      onlyForRefs?: any[];
      prioBoost?: number;
    }[]
  ) {
    loading.value = true;
    referees.value = [];
    try {
      const response = await useApiV5Fetch(
        `referees/bulk-select-ref-for-game`,
        {
          method: "POST",
          body: bodyParams,
        }
      );
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function bulkRefApproveDraft(
    params: {
      gameId: number;
      pos: number;
      forUserId?: number;
      season_sport_id: number;
    }[]
  ) {
    loading.value = true;
    referees.value = [];
    try {
      const response = await useApiV5Fetch(`referees/bulk-ref-approve-draft`, {
        method: "POST",
        body: params,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function selectRefForOneGame(bodyParams: {
    gameId: number;
    pos: number;
    gameRoleId?: number;
    season_sport_id: number;
    userId?: number;
    generateRunId?: number;
    onlyForRefs?: any[];
    prioBoost?: number;
  }) {
    loading.value = true;
    referees.value = [];
    try {
      const response = await useApiV5Fetch(`referees/select-ref-for-game`, {
        method: "POST",
        body: bodyParams,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }
  async function getRefList(bodyParams: {
    gameId?: number;
    prioBoost?: number;
    season_sport_id: number;
    pos?: number;
    week?: number;
  }): Promise<RefereeGetRefList[] | null> {
    loading.value = true;
    referees.value = [];
    try {
      const response: { data?: { value?: RefereeGetRefList[] } } =
        await useApiV5Fetch(`referees/get-ref-list`, {
          method: "POST",
          body: bodyParams,
        });
      if (response.data?.value) {
        return response.data.value;
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function performRejectRef(bodyParams: {
    gameId: number;
    pos: number;
    forUserId?: number;
    autoassignnew?: boolean;
    userId?: number;
    season_sport_id: number;
  }): Promise<IReferee | null> {
    loading.value = true;
    referees.value = [];
    try {
      const response: { data?: { value?: IReferee } } = await useApiV5Fetch(
        `referees/ref-rejection`,
        {
          method: "POST",
          body: bodyParams,
        }
      );
      if (response.data?.value) {
        return response.data.value;
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function performApproveRef(bodyParams: {
    gameId: number;
    pos: number;
    forUserId?: number;
    season_sport_id: number;
  }): Promise<IReferee | null> {
    loading.value = true;
    referees.value = [];
    try {
      const response: { data?: { value?: IReferee } } = await useApiV5Fetch(
        `referees/ref-approve-draft`,
        {
          method: "POST",
          body: bodyParams,
        }
      );
      if (response.data?.value) {
        return response.data.value;
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function performGetRefDetails(bodyParams: {
    license: number;
    gameId: number;
    pos: number;
    season_sport_id: number;
  }): Promise<{
    userId: null | number;
    license: number;
    display: string;
  } | null> {
    loading.value = true;
    referees.value = [];
    try {
      const response: {
        data?: {
          value?: {
            userId: null | number;
            license: number;
            display: string;
          };
        };
      } = await useApiV5Fetch(`referees/get-ref-details`, {
        method: "POST",
        body: bodyParams,
      });
      if (response.data?.value) {
        return response.data.value;
      }
      return null;
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
    fetchAllReferees();
  }

  return {
    originalData,
    orderBy,
    orderDirection,
    fetchAllReferees,
    referees,
    sort,
    page,
    count,
    limit,
    searchQuery,
    loading,
    deleteReferee,
    getRefereeById,
    createEditRef,
    selectRefForGame,
    getRefList,
    performRejectRef,
    performDeleteRef,
    selectRefForOneGame,
    performSetRef,
    performSetInMvp,
    performApproveRef,
    performGetRefDetails,
    bulkRefApproveDraft,
    bulkPerformSetRef
  };
}
