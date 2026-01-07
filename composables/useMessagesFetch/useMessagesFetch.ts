import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {useUserStore} from "~/store/user";

export const useMessageFetch = () => {

    const userStore = useUserStore()

    async function createMessage(data: any) {
        const response = await useApiV5Fetch(`messages`, {
            method: 'POST',
            body: data,
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function getMessagesCount() {
        try {
            const response = await useApiV5Fetch(`messages/counts`, {
                query: {
                    seasonSportId: userStore.seasonSportId
                }
            })

            if (response.data?.value !== undefined && typeof response.data.value === 'number') {
                return response.data.value as number
            }

            // If response is an error object, return 0
            if (response.data?.value && typeof response.data.value === 'object' && 'error' in response.data.value) {
                return 0
            }

            return 0
        } catch (error) {
            console.error('Error fetching messages count:', error);
            return 0
        }
    }

    return {createMessage, getMessagesCount}
}