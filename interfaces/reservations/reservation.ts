import type {ReservationType} from "~/interfaces/reservations/reservationType";

export interface Reservation {
    id: number,
    start_time: string,
    end_time: string,
    text: string,
    time_slot_id: number,
    game_id: number,
    club_id: number,
    team_id: number | null,
    type_id: number | null,
    user_id: number | null,
    age_group: string | null,
    is_deleted: true,
    type: ReservationType,
}