import type Courts from "~/interfaces/courts/courts";

export default interface Venues {
  id: number;
  courts: Courts[];
  name: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  postalCity: string;
  country: string;
  phoneNumber: string;
  webAddress: string;
  inActive: boolean;
  latLng: string;
  placeId: string;
  calKey: string;
}
