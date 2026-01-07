import Users from "~/interfaces/users/users";

export default defineEventHandler(async (event) => {
    // const url = getRequestURL(event).pathname
    // const publicRoutes = ['/login', '/create-password', '/reset-password', '/sign-up']

    const config = useRuntimeConfig()
    let baseUrl: string = config.public.apiRoute

    try {
        const res = await $fetch(
            '/auth/me', {
                baseURL: baseUrl,
                headers: {
                    Authorization: event.context.authToken ? `Bearer ${event.context.authToken}` : ''
                },
            }) as Users

        return res?.id
    } catch (error) {
        return null
    }
})