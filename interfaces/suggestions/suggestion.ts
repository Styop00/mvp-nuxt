import type Users from "~/interfaces/users/users";
import type Courts from "~/interfaces/courts/courts";

export default interface Suggestion {
    id: number,
    date: Date | null | String | string,
    time: string,
    courtId: number,
    gameId: number,
    requestedBy: number,
    acceptedBy: number | null,
    rejectedBy: number | null,
    approvedBy: number | null,
    requestedDate: Date | null | String | string,
    acceptedDate: Date | null | String | string,
    approvedDate: Date | null | String | string,
    rejectedDate: Date | null | String | string,
    requestedByUser?: Users,
    court?: Courts,
}