export default interface Registration {
  id: number;
  count: number;
  level: number;
  tournamentId: number;
  clubId: number;
  club: { name: string };
}

export interface RegistrationRequestData {
  success: boolean;
  message: string;
  level: number;
}
