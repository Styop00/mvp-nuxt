import type Users from "~/interfaces/users/users";
import type UserRole from "~/interfaces/users/userRole";

export default interface Clubs {
  id: number;
  name: string;
  building: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
  postal_city: string;
  country: string;
  region_id: string;
  phone_number1: string;
  phone_number2: string;
  email: string;
  public_notes: string;
  internal_notes: string;
  web_address: string;
  short_name: string;
  deleted: boolean;
  district: string;
  status: string;
  is_active: boolean;
  cal_key: string;
  license: number;
  managers: Users[];
  clubVenues: { venueId: number; clubId: number }[];
  user_roles?: UserRole[],
}
