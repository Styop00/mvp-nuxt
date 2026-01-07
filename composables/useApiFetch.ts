import {useUserStore} from "~/store/user";

export const useApiFetch: typeof useFetch = (request, opts) => {
    const store = useUserStore()
    const config = useRuntimeConfig()

    const accessToken = computed(() => store.token)

    let baseUrl: string = config.public.apiRoute

    return useFetch(request,
        {
            baseURL: baseUrl,
            headers: {
                Authorization: accessToken.value ? `Bearer ${accessToken.value}` : ''
            },
            onResponse: async ({ response, options }) => {
                if (response.status === 401) {
                    store.resetState()
                    await navigateTo('/login')
                }

                if (!response.ok && response._data && response._data.message && Array.isArray(response._data.message) && response._data.message.length) {
                    if (typeof response._data.message[0] === "string") {
                        return response._data.message
                    } else {
                        return response._data.message[0]
                    }
                }
            },
            ...opts
        })
}