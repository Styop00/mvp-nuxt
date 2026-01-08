import type Pools from "~/interfaces/pools/pools";
import type Rounds from "~/interfaces/rounds/rounds";
import type Team from "~/interfaces/teams/team";
import type TournamentGroup from "../tournamentGroup/tournamentGroup";

export default interface Tournament {
    id: Number,
    alias: String,
    short_name: String,
    pool_count: Number,
    cross_pool_game_count: Number,
    cross_standing_group_game_count: Number,
    deleted: Boolean,
    end_date: Date | String,
    information: String,
    region: any,
    region_id: Number | null,
    round_type: Number
    standing_group_count: Number,
    start_date: Date | String,
    team_count: Number | null,
    tournament_group_id: Number,
    tournament_program_id: Number,
    pools: Array<Pools>,
    rounds: Array<Rounds>,
    teams?: Array<Team>,
    TeamTournament?: any
    tournament_group: TournamentGroup
}