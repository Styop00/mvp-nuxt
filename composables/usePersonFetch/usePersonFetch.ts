import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Coach from "~/interfaces/coaches/coach";
import type CoachTableData from "~/interfaces/coaches/coachTableData";
import type SelectOptions from "~/interfaces/inputs/selectOptions";
import { useUserStore } from "~/store/user";

export function usePersonFetch() {
  const loading = ref(false);

  async function editPerson(id: number, body: { name: string }) {
    loading.value = true;
    try {
      const response = await useApiV5Fetch(`persons/${id}`, {
        method: "PUT",
        body: body,
      });
      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function savePlayerLicense(data: any) {
    const response = await useApiV5Fetch(`persons/player-license`, {
      method: "PUT",
      body: data,
    });
    return response.data?.value;
  }

  return {
    editPerson,
    loading,
    savePlayerLicense,
  };
}
