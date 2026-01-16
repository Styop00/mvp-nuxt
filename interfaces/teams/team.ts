import type Users from "~/interfaces/users/users";
import type Tournament from "~/interfaces/tournament/tournament";
import type Clubs from "~/interfaces/clubs/club";
import type UserRole from "~/interfaces/users/userRole";

export default interface Team {
    id: number,
    club_id: Number | null;
    local_name: String | null;
    deleted: boolean;
    ancestor_id: Number | null;
    cal_key: String | null;
    license: Number | null;
    tournament_name: String | null;
    gender: String | null;
    club_rank: Number | null;
    team_staff?: Array<Users> | []
    tournaments?: Array<Tournament> | []
    TeamTournament?: Array<any>
    team_tournament_assignments?: Array<any> | []
    age_group: String | null;
    official_type_id: Number;
    official_team_id: Number;
    club?: Clubs;
    user_roles?: UserRole;
}
