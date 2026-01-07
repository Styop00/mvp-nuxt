import type Clubs from "~/interfaces/clubs/club";

export default interface League {
    id: Number,
    name: String,
    startDate: Date,
    endDate: Date,
    organizer?: Object,
    clubId: number | null,
    deleted: Boolean,
    information: String,
    isActive: Boolean,
    organizerId: Number,
    seasonSportId: Number,
    sportId: Number,
    userId: Number,
    club: Clubs,
}