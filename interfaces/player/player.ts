import type PlayerLicense from "~/interfaces/player/playerLicense";

export default interface Player {
    id: number;
    personId: number;
    playerLicenses: PlayerLicense[];
    jerseyNumber: number;
}