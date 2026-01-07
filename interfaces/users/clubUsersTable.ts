export default interface ClubUsersTable {
    id: number,
    name: string,
    email: string,
    active_roles: string,
    license: string,
    is_coach: number | null | undefined,
    coach_id: number | null | undefined,
}