import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {useUserStore} from "~/store/user";

export default function useCalendarFetch<T>() {
    const userStore = useUserStore();

    async function getAllEvents(query: any) {
        const response = await useApiV5Fetch("calendars", {
            query: {
                seasonSportId: userStore.seasonSportId,
                ...query,
            },
        });

        if (response.data.value) {
            return response.data.value as Array<any>;
        }

        return []
    }

    return {getAllEvents};
}