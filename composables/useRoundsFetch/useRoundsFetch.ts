import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Rounds from "~/interfaces/rounds/rounds";

export const useRoundsFetch = () => {
    async function createRounds(data: any): Promise<Rounds[]> {
        const response = await useApiV5Fetch(`rounds`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as Array<Rounds>
        }
        return [] as Array<Rounds>
    }

    async function recreate(data: any): Promise<Rounds[]> {
        const response = await useApiV5Fetch(`rounds/recreate`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as Array<Rounds>
        }
        return [] as Array<Rounds>
    }

    async function deleteGeneratedRounds(tournamentId: number): Promise<Boolean> {
        const response = await useApiV5Fetch(`rounds/delete-generated`, {
            method: 'DELETE',
            query: {
                tournament_id: tournamentId
            }
        })
        if (response.data?.value) {
            return !!response.data.value as Boolean
        }
        return false
    }

    async function deleteGeneratedRoundsByIds(rounds: any): Promise<Boolean> {
        const response = await useApiV5Fetch(`rounds/delete-rounds`, {
            method: 'DELETE',
            query: {
                rounds: rounds
            }
        })
        if (response.data?.value) {
            return !!response.data.value as Boolean
        }
        return false
    }

    async function attachRoundsToTournaments(data: Array<Rounds>) {
        const response = await useApiV5Fetch(`rounds/attach-to-tournament`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return !!response.data.value as Boolean
        }
        return false
    }

    return {createRounds, recreate, deleteGeneratedRounds, attachRoundsToTournaments, deleteGeneratedRoundsByIds}
}