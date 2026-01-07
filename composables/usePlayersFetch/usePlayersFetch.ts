import { useApiV5Fetch } from "~/composables/useApiV5Fetch";

export function usePlayersFetch() {

    async function updatePlayer(id: number, body: any) {
        const response = await useApiV5Fetch(`players/${id}/jersey-number`, {
            method: "PUT",
            body: body,
        });
        return response.data?.value;
    }

    return {
        updatePlayer,
    };
}
