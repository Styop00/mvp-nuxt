export default interface GamesTable {
    id: number,
    day: string,
    date: Date|string,
    time: string,
    number: number,
    teamIdHome: string,
    teamIdAway: string,
    tournament: string,
    court: string,
    status: string,
}