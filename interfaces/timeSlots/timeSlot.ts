import type Courts from "~/interfaces/courts/courts";
import type Clubs from "~/interfaces/clubs/club";
import type {Reservation} from "~/interfaces/reservations/reservation";

export default interface TimeSlot {
    id: number,
    date: Date | String,
    expiration: Date | String,
    startTime: String,
    endTime: String,
    courtId: number,
    clubId: number,
    seasonSportId: number,
    isDeleted: boolean
    court: Courts,
    club: Clubs,
    reservations: Reservation[],
}