export default interface Rounds {
    id: Number,
    number: number;
    tournamentId: Number;
    fromDate: Date | String;
    toDate: Date | String;
    week: Number;
    year: Number;
    type: number;
    forceCross: Boolean;
    deleted: Boolean;
}