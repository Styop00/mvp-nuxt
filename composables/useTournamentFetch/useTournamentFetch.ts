import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Tournament from "~/interfaces/tournament/tournament";
import type Team from "~/interfaces/teams/team";

export const useTournamentFetch = () => {

    async function fetchTournaments(
        tournamentGroupId?: number,
        orderBy?: string,
        orderDirection?: string,
        page?: number,
        limit?: number,
        searchQuery?: string,
    ) {
        const response = await useApiV5Fetch('tournaments',
            {
                query: {
                    tournamentGroupId: tournamentGroupId,
                    orderBy: orderBy,
                    orderDirection: orderDirection,
                    page: page,
                    limit: limit,
                    searchTerm: searchQuery,
                }
            })

        if (response.data?.value) {
            return response.data.value as { count: Number, rows: Array<Tournament> }
        }
        return null
    }

    async function fetchTournamentById(id: number): Promise<Tournament | null> {
        const response = await useApiV5Fetch(`tournaments/${id}`)

        if (response.data?.value) {
            return response.data.value as Tournament
        }
        return null
    }

    async function updateTournament(id: number, data: object) {
        const response = await useApiV5Fetch(`tournaments/${id}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function deleteTournament(id: number) {
        const response = await useApiV5Fetch(`tournaments/${id}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function createTournament(data: any) {
        const response = await useApiV5Fetch(`tournaments`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as Tournament
        }
        return null
    }

    async function fetchPossibleTeams(id: number) {
        const response = await useApiV5Fetch(`tournaments/${id}/possible-teams`)

        if (response.data?.value) {
            return response.data.value as Array<Team>
        }
        return [] as Array<Team>
    }

    return {
        fetchTournaments,
        fetchTournamentById,
        updateTournament,
        createTournament,
        deleteTournament,
        fetchPossibleTeams
    };
}