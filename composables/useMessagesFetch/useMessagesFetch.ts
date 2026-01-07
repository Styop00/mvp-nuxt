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
        const response = await useApiV5Fetch(`messages/counts`, {
            query: {
                seasonSportId: userStore.seasonSportId
            }
        })

        if (response.data?.value) {
            return response.data.value as number
        }
        return 0
    }

    return {createMessage, getMessagesCount}
}