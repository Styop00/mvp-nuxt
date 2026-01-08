import type Clubs from "~/interfaces/clubs/club";

export default interface League {
    id: Number,
    name: String,
    start_date: Date,
    end_date: Date,
    organizer?: Object,
    club_id: number | null,
    deleted: Boolean,
    information: String,
    is_active: Boolean,
    organizer_id: Number,
    season_sport_id: Number,
    sport_id: Number,
    user_id: Number,
    club: Clubs,
}