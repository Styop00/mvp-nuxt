export default interface Rounds {
    id: Number,
    number: number;
    tournament_id: Number;
    from_date: Date | String;
    to_date: Date | String;
    week: Number;
    year: Number;
    type: number;
    force_cross: Boolean;
    deleted: Boolean;
}