export default interface UserRole {
    id: number;
    user_id: number;
    role_id: number;
    club_id: number | null;
    team_id: number | null;
    season_sport_id: number | null;
    user_role_approved_by_user_id: number | null;
    user_rolespec: string | null;
}
