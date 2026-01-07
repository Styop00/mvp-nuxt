import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import type Pools from "~/interfaces/pools/pools";

export const usePoolsFetch = () => {

    async function fetchPoolById(id: number): Promise<Pools | null> {
        const response = await useApiV5Fetch(`pools/${id}`)

        if (response.data?.value) {
            return response.data.value as Pools
        }
        return null
    }

    async function updatePool(id: number, data: object) {
        const response = await useApiV5Fetch(`pools/${id}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function deletePool(id: number) {
        const response = await useApiV5Fetch(`pools/${id}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function createPools(data: any) {
        const response = await useApiV5Fetch(`pools`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function createOrUpdatePools(tournamentId: number, data: any) {
        const response = await useApiV5Fetch(`pools/recreate/${tournamentId}`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    return {fetchPoolById, updatePool, deletePool, createPools, createOrUpdatePools};
}