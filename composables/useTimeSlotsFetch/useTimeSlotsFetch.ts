import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {useUserStore} from "~/store/user";
import type TimeSlot from "~/interfaces/timeSlots/timeSlot";

export const useTimeSlotsFetch = () => {
    const userStore = useUserStore()

    async function createTimeSlot(data: any): Promise<TimeSlot> {
        const response = await useApiV5Fetch(`time-slots`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as TimeSlot
        }
        return {} as TimeSlot
    }

    async function fetchTimeSlots(
        requestData?: object | null
    ) {
        const response = await useApiV5Fetch(`time-slots`, {
            query: {
                seasonSportId: userStore.seasonSportId,
                isDeleted: false,
                ...requestData
            },
        })

        if (response.data?.value) {
            return response.data.value as { count: Number, rows: Array<TimeSlot> }
        }
        return {count: 0, rows: []} as { count: Number, rows: Array<TimeSlot> }
    }

    async function fetchTimeSlotById(timeSlotId: number) {
        const response = await useApiV5Fetch(`time-slots/${timeSlotId}`)

        if (response.data?.value) {
            return response.data.value as TimeSlot
        }
        return {} as TimeSlot
    }

    async function deleteTimeSlotById(timeSlotId: number) {
        const response = await useApiV5Fetch(`time-slots/${timeSlotId}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function updateTimeSlot(timeSlotId: number, data: any) {
        const response = await useApiV5Fetch(`time-slots/${timeSlotId}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    return {
        createTimeSlot,
        fetchTimeSlots,
        fetchTimeSlotById,
        updateTimeSlot,
        deleteTimeSlotById,
    }
}