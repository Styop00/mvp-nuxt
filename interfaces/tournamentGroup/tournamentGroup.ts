import type League from "~/interfaces/league/leagues";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import type Team from "~/interfaces/teams/team";
import type Tournament from "~/interfaces/tournament/tournament";

export default interface TournamentGroup {
    id: number;
    name: string;
    shortName: string;
    hideFromRankings: Boolean;
    allowMentorProspect: Boolean;
    starRating: number;
    scoreSheetTypeId: number | null;
    isActive: Boolean;
    minTeams: number;
    maxTeams: number;
    regionId: number;
    registrationFee: number;
    information: string;
    tournamentTypeId: number | null;
    tournamentStructureId: number | null;
    tournamentRegistrationTypeId: number | null;
    startDate: Date | string | null;
    endDate: Date | string | null;
    refNominationId: number | null;
    officialsTypeId: number | null;
    levels: number;
    setGameStrategyId: number | null;
    movingStrategyId: number | null;
    playerLicenseTypeId: number | null;
    penaltyTypeId: number | null;
    showBirthInScoreSheet: Boolean;
    tournamentConfigsId: number;
    ageGroup: string | null,
    gender: string | null,
    leagueId?: number;
    league?: League;
    tournamentConfig?: TournamentConfigs;
    teams?: Array<Team>;
    tournaments?: Array<Tournament>;
}