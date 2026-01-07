import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";

export default interface BlockedPeriod {
    id: number;
    title: string;
    description: string;
    startDate: Date | String | null;
    endDate: Date | String | null;
    blockAll: boolean;
    teamId: number;
    seasonSportId: number;
    isDeleted: boolean;
    tournamentGroups: TournamentGroup[];
}