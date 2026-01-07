import type {ReservationType} from "~/interfaces/reservations/reservationType";

export interface Reservation {
    id: number,
    startTime: string,
    endTime: string,
    text: string,
    timeSlotId: number,
    gameId: number,
    clubId: number,
    teamId: number | null,
    typeId: number | null,
    userId: number | null,
    ageGroup: string | null,
    isDeleted: true,
    type: ReservationType,
}