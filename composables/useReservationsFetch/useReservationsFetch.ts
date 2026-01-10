import {useApiV5Fetch} from "~/composables/useApiV5Fetch";
import {useUserStore} from "~/store/user";
import type {Reservation} from "~/interfaces/reservations/reservation";
import type {ReservationType} from "~/interfaces/reservations/reservationType";

export const useReservationsFetch = () => {
    async function createReservation(data: any) {
        const response = await useApiV5Fetch(`reservations`, {
            method: 'POST',
            body: data
        })

        if (response.data?.value) {
            return response.data.value as (Reservation | {name: String, message: String})
        }
        return {} as (Reservation | {name: String, message: String})
    }

    async function fetchReservations(
        requestData?: object | null
    ) {
        const response = await useApiV5Fetch(`reservations`, {
            query: {
                is_deleted: false,
                ...requestData
            },
        })

        if (response.data?.value) {
            return response.data.value as Array<Reservation>
        }
        return [] as Array<Reservation>
    }

    async function fetchReservationById(reservationId: number) {
        const response = await useApiV5Fetch(`reservations/${reservationId}`)

        if (response.data?.value) {
            return response.data.value as Reservation
        }
        return {} as Reservation
    }

    async function deleteReservationById(reservationId: number) {
        const response = await useApiV5Fetch(`reservations/${reservationId}`, {
            method: 'DELETE',
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function updateReservation(reservationId: number, data: any) {

        const response = await useApiV5Fetch(`reservations/${reservationId}`, {
            method: 'PUT',
            body: data
        })

        if (response.data?.value) {
            return response.data.value
        }
        return null
    }

    async function fetchReservationTypes() {
        const response = await useApiV5Fetch(`reservation-types`)

        if (response.data?.value) {
            return response.data.value as Array<ReservationType>
        }
        return [] as Array<ReservationType>
    }

    return {
        createReservation,
        fetchReservations,
        fetchReservationById,
        updateReservation,
        deleteReservationById,
        fetchReservationTypes
    }
}