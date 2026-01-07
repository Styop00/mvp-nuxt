import type Users from "../users/users";

export interface Referee {
  id: number;
  license: number;
  isActive?: boolean | null;
  userId: number;
  examDate?: string | null;
  menGroup?: string | null;
  womenGroup?: string | null;
  absenseUpdated?: string | null;
  absenseStatus?: number | null;
  absenseActionId?: number | null;
  prio?: number | null;
  prioMax?: number | null;
  onlyWithBetter?: number | null;
  maxStarRating?: number | null;
  mentor?: number | null;
  prospect?: number | null;
  reserve?: number | null;
  showwinMvpMin: number;
  showwinMvpMax: number;
  showwinMvpMaxDistance: number;
  showwinMvpNotifyOnNew: number;
  commisionerLevel?: number | null;
  evaluatorLevel?: number | null;
  inActive?: boolean | null;
  canThree?: boolean | null;
  createdAt: string;
  updatedAt: string;
  user?: Users;
}

export interface RefereeGetRefList {
  id: number;
  license: number;
  user: {
    name: string | null;
  };
  prio: number;
  maxStarRating: number;
  gameInWeek: number;
  maxPossibleGamesWeek: number;
  mentor: boolean;
  defactounavailable: number;
  prospect: boolean;
  distance: number;
  days: {
    [key: string]: {
      available: boolean | null;
      availablefrom: string | null;
      availabelto: string | null;
      games: {
        id: number;
        number: number;
        date: string;
        strTime: string;
        venuename: string;
        tournamentshortname: string;
      }[];
      absent: boolean;
    };
  };
}

export interface IReferee {
  userId: number | null;
  number: number;
  fee: number;
  name: string;
  prio: number | null;
  stars: number;
  status: number;
  prospect: string | null;
  mentor: string | null;
}
