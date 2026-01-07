import { type Referee } from "../referees/referee";

export default interface Person {
  id: number;
  externalId: number | null;
  email: string;
  name: string;
  seasonSportId: number;
  deleted: boolean | null;
  userId: number;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string | null;
  phoneNumbers: string;
  isActive: boolean | null;
  latlng: string | null;
  placeId: string | null;
  debtorNumber: string;
  recalcCoordinates: boolean | null;
  createdAt: string;
  updatedAt: string;
  referees: Referee;
}
