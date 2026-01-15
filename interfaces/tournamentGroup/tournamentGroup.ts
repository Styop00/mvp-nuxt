import type League from "~/interfaces/league/leagues";
import type Team from "~/interfaces/teams/team";
import type Tournament from "~/interfaces/tournament/tournament";

export default interface TournamentGroup {
    id: number;
    name: string;
    short_name: string;
    is_active: Boolean;
    min_teams: number;
    max_teams: number;
    region_id: number;
    information: string;
    tournament_structure_id: number | null;
    tournament_registration_type_id: number | null;
    start_date: Date | string | null;
    end_date: Date | string | null;
    set_game_strategy_id: number | null;
    moving_strategy_id: number | null;
    age_group: string | null,
    gender: string | null,
    league_id?: number;
    league?: League;
    teams?: Array<Team>;
    tournaments?: Array<Tournament>;
    // Fields from tournament_configs
    free_reschedule_until_date: Date | string | null;
    registration_dead_line: Date | string | null;
    minimum_warmup_minutes: number | null;
    expected_duration_minutes: number;
    earliest_start: string | null;
    latest_start: string | null;
}