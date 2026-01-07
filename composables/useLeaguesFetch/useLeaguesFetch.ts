import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type League from "~/interfaces/league/leagues";

export function useLeagueFetch() {

    async function fetchLeagues(
        conditions?: object,
        orderBy?: string,
        orderDirection?: string,
        page?: number,
        limit?: number,
        searchQuery?: string,
    ) {
        const response = await useApiV5Fetch('leagues',
            {
                query: {
                    orderBy: orderBy,
                    orderDirection: orderDirection,
                    page: page,
                    limit: limit,
                    searchTerm: searchQuery,
                    ...conditions
                }
            })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function fetchLeagueById(id: number) {
        const response = await useApiV5Fetch(`leagues/${id}`)

        if (response.data?.value) {
            return response.data.value as League
        }
        return {} as League
    }

    async function updateLeague(id: number, data: object) {
        const response = await useApiV5Fetch(`leagues/${id}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function deleteLeague(id: number) {
        const response = await useApiV5Fetch(`leagues/${id}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    return {fetchLeagues, fetchLeagueById, updateLeague, deleteLeague};
}