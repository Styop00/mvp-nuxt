import type Users from "~/interfaces/users/users";
import type UserRole from "~/interfaces/users/userRole";

export default interface Clubs {
  id: number;
  name: string;
  building: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  postalCity: string;
  country: string;
  regionId: string;
  phoneNumber1: string;
  phoneNumber2: string;
  email: string;
  publicNotes: string;
  internalNotes: string;
  webAddress: string;
  shortName: string;
  deleted: boolean;
  district: string;
  status: string;
  isActive: boolean;
  calKey: string;
  license: number;
  user_roles: {}[];
  managers: Users[];
  clubVenues: { venueId: number; clubId: number }[];
  user_roles?: UserRole,
}
