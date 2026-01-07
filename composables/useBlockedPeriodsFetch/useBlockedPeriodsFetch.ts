import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {useUserStore} from "~/store/user";
import type BlockedPeriod from "~/interfaces/blockedPeriods/blockedPeriod";

export const useBlockedPeriodsFetch = () => {
    const userStore = useUserStore()

    async function createBlockedPeriod(data: any): Promise<BlockedPeriod> {
        const response = await useApiV5Fetch(`blocked-periods`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as BlockedPeriod
        }
        return {} as BlockedPeriod
    }

    async function fetchBlockedPeriods(
        requestData?: object | null
    ) {
        const response = await useApiV5Fetch(`blocked-periods`, {
            query: {
                seasonSportId: userStore.seasonSportId,
                isDeleted: false,
                ...requestData
            },
        })

        if (response.data?.value) {
            return response.data.value as { count: Number, rows: Array<BlockedPeriod> }
        }
        return {count: 0, rows: []} as { count: Number, rows: Array<BlockedPeriod> }
    }

    async function fetchBlockedPeriodById(blockedPeriodId: number) {
        const response = await useApiV5Fetch(`blocked-periods/${blockedPeriodId}`)

        if (response.data?.value) {
            return response.data.value as BlockedPeriod
        }
        return {} as BlockedPeriod
    }

    async function deleteBlockedPeriodById(blockedPeriodId: number) {
        const response = await useApiV5Fetch(`blocked-periods/${blockedPeriodId}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function updateBlockedPeriod(blockedPeriodId: number, data: any) {
        const response = await useApiV5Fetch(`blocked-periods/${blockedPeriodId}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    return {
        createBlockedPeriod,
        fetchBlockedPeriods,
        fetchBlockedPeriodById,
        updateBlockedPeriod,
        deleteBlockedPeriodById,
    }
}