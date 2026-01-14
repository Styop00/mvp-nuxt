import type Person from "../person/person";
import type {Referee} from "~/interfaces/referees/referee";
import type UserRole from "~/interfaces/users/userRole";
import type Coach from "~/interfaces/coaches/coach";
import type Roles from "~/interfaces/roles/roles";
import type Team from "~/interfaces/teams/team";
import type Player from "~/interfaces/player/player";
import type Clubs from "~/interfaces/clubs/club";

export default interface Users {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  disableEmails?: boolean;
  gender?: string;
  birthYear?: number | null;
  birthMonth?: number | null;
  birthDay?: number;
  nationality?: string;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  latlng: string;
  debtorNumber: string;
  phoneNumbers: string;
  isVerified: boolean;
  roles?: Roles[];
  person: Person;
  referee?: Referee;
  user_roles?: UserRole[];
  coachLicense?: Coach;
  teams: Team[];
  player?: Player;
  clubs?: Clubs[]
}

export type EditUser = Partial<Users>;
