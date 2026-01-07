import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";

export function useCourtPriorityFetch() {
  const loading = ref(false);

  async function createCourtPrioritiesBulk(
    createCourtBody: {
      courtId: number;
      clubId: number;
    }[],
    clubId: number
  ) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch("court-priorities/bulk", {
        method: "POST",
        query: { clubId },
        body: createCourtBody,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    createCourtPrioritiesBulk,
    loading,
  };
}
