import type Pools from "~/interfaces/pools/pools";
import type Rounds from "~/interfaces/rounds/rounds";
import type Team from "~/interfaces/teams/team";
import type TournamentGroup from "../tournamentGroup/tournamentGroup";

export default interface Tournament {
    id: Number,
    alias: String,
    shortName: String,
    poolCount: Number,
    crossPoolGameCount: Number,
    crossStandingGroupGameCount: Number,
    deleted: Boolean,
    endDate: Date | String,
    information: String,
    region: any,
    regionId: Number | null,
    roundType: Number
    standingGroupCount: Number,
    startDate: Date | String,
    teamCount: Number | null,
    tournamentGroupId: Number,
    tournamentProgramId: Number,
    pools: Array<Pools>,
    rounds: Array<Rounds>,
    teams?: Array<Team>,
    TeamTournament?: any
    tournamentGroup: TournamentGroup
}