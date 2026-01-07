import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";

export function useTournamentConfigFetch() {

    async function fetchTournamentConfigs(queryObject: object) {

    }

    async function fetchTournamentConfigNames(queryObject: object = {}) {
        const response = await useApiV5Fetch(`tournament-configs/names`, {
            query: queryObject
        })

        return response.data?.value ?? []
    }

    async function fetchTournamentConfigById(id: number) {
        const response = await useApiV5Fetch(`tournament-configs/${id}`)

        return response.data?.value ?? null
    }

    async function createTournamentConfig(data: object) {
        const response = await useApiV5Fetch(`tournament-configs`, {
            method: 'POST',
            body: data
        })

        return response.data?.value as TournamentConfigs ?? null
    }

    async function updateTournamentConfig(id: number, data: object) {
        const response = await useApiV5Fetch(`tournament-configs/${id}`, {
            method: 'PUT',
            body: {
                ...data,
            }
        })

        return response.data?.value ?? null
    }

    return {
        fetchTournamentConfigs,
        fetchTournamentConfigNames,
        fetchTournamentConfigById,
        createTournamentConfig,
        updateTournamentConfig
    }
}