import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Federations from "~/interfaces/federations/federation";
import type FederationsTableData from "~/interfaces/federations/federationsTableData";
import { useUserStore } from "~/store/user";

export function useFederationsFetch() {
  const federations = ref([] as Array<FederationsTableData>);
  const originalData = ref([] as Array<Federations>);
  const orderBy = ref("id");
  const orderDirection = ref("asc");
  const userStore = useUserStore();

  const { seasonSportId } = userStore;
  const loading = ref(false);

  async function fetchFederations() {
    loading.value = true;
    federations.value = []
    try {
      const response = await useApiV5Fetch("organizers", {
        query: {
          seasonSportId: seasonSportId || 19, //todo (maybe)
          deleted: false,
          orderBy: orderBy.value,
          orderDirection: orderDirection.value,
        },
      });

      if (!response.data?.value) {
        return;
      }

      const res = response.data.value as Array<Federations>;
      federations.value = [];

      res.forEach((data) => {
        federations.value.push({
          id: data.id,
          name: data.name,
          invoicePrefix: data.invoicePrefix,
        });
      });
      originalData.value = res;
    } finally {
      loading.value = false;
    }
  }

  async function createFederation(federation: Partial<Federations>) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("organizers", {
        method: "POST",
        body: federation,
      });
      if (response.data?.value) {
        fetchFederations();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateFederation(
    id: number,
    federation: Partial<Federations>
  ) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`organizers/${id}`, {
        method: "PUT",
        body: federation,
      });
      if (response.data?.value) {
        fetchFederations();
      }
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFederation(id: number) {
    loading.value = true;
    federations.value = []
    try {
      const response = await useApiV5Fetch(`organizers/${id}`, {
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
    fetchFederations();
  }

  return {
    federations,
    originalData,
    orderBy,
    orderDirection,
    fetchFederations,
    createFederation,
    updateFederation,
    deleteFederation,
    sort,
    loading,
  };
}
