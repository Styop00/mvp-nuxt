import type League from "~/interfaces/league/leagues";
import type TournamentConfigs from "~/interfaces/tournament/config/tournamentConfigs";
import type Team from "~/interfaces/teams/team";
import type Tournament from "~/interfaces/tournament/tournament";

export default interface TournamentGroup {
    id: number;
    name: string;
    short_name: string;
    hide_from_rankings: Boolean;
    allow_mentor_prospect: Boolean;
    star_rating: number;
    score_sheet_type_id: number | null;
    is_active: Boolean;
    min_teams: number;
    max_teams: number;
    region_id: number;
    registration_fee: number;
    information: string;
    tournament_type_id: number | null;
    tournament_structure_id: number | null;
    tournament_registration_type_id: number | null;
    start_date: Date | string | null;
    end_date: Date | string | null;
    ref_nomination_id: number | null;
    officials_type_id: number | null;
    levels: number;
    set_game_strategy_id: number | null;
    moving_strategy_id: number | null;
    player_license_type_id: number | null;
    penalty_type_id: number | null;
    show_birth_in_score_sheet: Boolean;
    tournament_configs_id: number;
    age_group: string | null,
    gender: string | null,
    league_id?: number;
    league?: League;
    tournament_config?: TournamentConfigs;
    teams?: Array<Team>;
    tournaments?: Array<Tournament>;
}