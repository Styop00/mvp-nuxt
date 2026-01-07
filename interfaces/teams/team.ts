import type Users from "~/interfaces/users/users";
import type TournamentGroup from "~/interfaces/tournamentGroup/tournamentGroup";
import type Tournament from "~/interfaces/tournament/tournament";
import type Clubs from "~/interfaces/clubs/club";
import type UserRole from "~/interfaces/users/userRole";

export default interface Team {
    id: number,
    clubId: Number | null;
    localName: String | null;
    deleted: boolean;
    ancestorId: Number | null;
    calKey: String | null;
    license: Number | null;
    tournamentName: String | null;
    gender: String | null;
    clubRank: Number | null;
    teamStaff: Array<Users> | []
    tournamentGroups: Array<TournamentGroup> | []
    tournaments?: Array<Tournament> | []
    TeamTournament?: Array<any>
    teamTournamentGroups?: Array<any> | []
    ageGroup: String | null;
    officialTypeId: Number;
    officialTeamId: Number;
    club?: Clubs;
    UserRoles?: UserRole;
}