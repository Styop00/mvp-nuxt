import type Rounds from "~/interfaces/rounds/rounds";
import type Team from "~/interfaces/teams/team";
import type League from "~/interfaces/league/leagues";

export default interface Tournament {
    id: number;
    name: string;
    alias: string;
    short_name: string;
    gender: string | null;
    age_group: string | null;
    is_active: boolean;
    cross_standing_group_game_count: number;
    deleted: boolean;
    end_date: Date | string;
    information: string;
    region: any;
    region_id: number | null;
    round_type: number;
    standing_group_count: number;
    start_date: Date | string;
    team_count: number | null;
    tournament_structure_id: number | null;
    tournament_registration_type_id: number | null;
    league_id?: number;
    league?: League;
    free_reschedule_until_date: Date | string | null;
    registration_dead_line: Date | string | null;
    minimum_warmup_minutes: number | null;
    expected_duration_minutes: number;
    earliest_start: string | null;
    latest_start: string | null;
    season_sport_id?: number;
    rounds?: Array<Rounds>;
    teams?: Array<Team>;
    TeamTournament?: any;
    tournamentMatches?: Array<any>;
    tournament_groups?: Array<any>;
    tournament_config?: {
        id?: number;
        tournament_id?: number;
        settings?: {
            // Regular League
            teams_count?: number;
            games_between?: number;
            // Playoff
            final_games_between?: number;
            // Group Stage + Playoff
            groups_count?: number;
            teams_per_group?: number;
            playoff_teams_count?: number;
            games_between_in_group_stage?: number;
            games_between_in_playoff_stage?: number;
            games_between_in_final?: number;
        };
    };
    tournament_structure?: {
        id: number;
        name: string;
        value: string; // 'regular_league', 'playoffs', 'group_stage_and_playoffs'
    };
}