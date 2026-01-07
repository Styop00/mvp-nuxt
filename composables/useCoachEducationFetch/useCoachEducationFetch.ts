import { ref } from "vue";
import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type CoachEducation from "~/interfaces/coachEducation/coachEducation";
import { type CoachEducationGet } from "~/interfaces/coachEducation/coachEducation";
import { useUserStore } from "~/store/user";

export function useCoachEducationFetch() {
  const userStore = useUserStore();
  const loading = ref(false);

  async function createCoursesOrCoachEducation(body: CoachEducation) {
    loading.value = true;

    try {
      const response = await useApiV5Fetch("coach-education", {
        method: "POST",
        body: {
          ...body,
          seasonSportId: userStore.seasonSportId,
        },
      });

      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function editCoursesOrCoachEducation(id: number, body: CoachEducation) {
    loading.value = true;

    try {
      const response = await useApiV5Fetch(`coach-education${id}`, {
        method: "PUT",
        body: {
          ...body,
        },
      });

      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCourse(id: number) {
    loading.value = true;

    try {
      const response = await useApiV5Fetch(`coach-education/${id}`, {
        method: "DELETE",
      });

      return response.data?.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCourseById(id: number): Promise<CoachEducationGet> {
    const response = await useApiV5Fetch(`coach-education/${id}`);
    if (!response.data?.value) {
      return {} as any;
    }

    return response.data?.value as CoachEducationGet;
  }

  return {
    createCoursesOrCoachEducation,
    editCoursesOrCoachEducation,
    deleteCourse,
    loading,
    fetchCourseById,
  };
}
