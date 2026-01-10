import type Users from "~/interfaces/users/users";
import type Courts from "~/interfaces/courts/courts";

export default interface Suggestion {
    id: number,
    date: Date | null | String | string,
    time: string,
    court_id: number,
    game_id: number,
    requested_by: number,
    accepted_by: number | null,
    rejected_by: number | null,
    approved_by: number | null,
    requested_date: Date | null | String | string,
    accepted_date: Date | null | String | string,
    approved_date: Date | null | String | string,
    rejected_date: Date | null | String | string,
    requested_by_user?: Users,
    court?: Courts,
}