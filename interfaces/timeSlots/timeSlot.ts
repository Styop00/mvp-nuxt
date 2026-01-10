import type Courts from "~/interfaces/courts/courts";
import type Clubs from "~/interfaces/clubs/club";
import type {Reservation} from "~/interfaces/reservations/reservation";

export default interface TimeSlot {
    id: number,
    date: Date | String,
    expiration: Date | String,
    start_time: String,
    end_time: String,
    court_id: number,
    club_id: number,
    season_sport_id: number,
    is_deleted: boolean
    court: Courts,
    club: Clubs,
    reservations: Reservation[],
}