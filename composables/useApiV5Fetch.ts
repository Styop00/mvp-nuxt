export const useApiV5Fetch: typeof useFetch = (request, opts) => {
    const config = useRuntimeConfig()

    let baseUrl: string = config.public.apiRoute + '/v5'

    return useApiFetch(request,
        {
            baseURL: baseUrl,
            ...opts
        })
}