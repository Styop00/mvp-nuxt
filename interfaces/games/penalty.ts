export default interface Penalty {
    id: number;
    gameId: number;
    value: number | null;
    number: number;
    side: "home" | "away";
}