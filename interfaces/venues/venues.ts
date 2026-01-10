import type Courts from "~/interfaces/courts/courts";
import type Clubs from "~/interfaces/clubs/club";

export default interface Venues {
  id: number;
  courts: Courts[];
  clubs: Clubs[];
  name: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  city: string;
  country: string;
  phone_number: string;
  webAddress: string;
  is_active: boolean;
  latLng: string;
  placeId: string;
  calKey: string;
}
