export default interface GamesEditableTable {
    id: number,
    day: string,
    dateTime: string,
    number: number,
    match: string,
    homePenalty1: string | number,
    awayPenalty1: string | number,
    penaltyStatus: boolean,
    view: string,
}