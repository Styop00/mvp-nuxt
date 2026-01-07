import type Venues from "~/interfaces/venues/venues";

export interface CourtUsage {
  id?: number;
  courtUsageCount?: number;
  courtRequirementId?: number;
  courtId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default interface Courts {
  id: number;
  name: string;
  inActive: boolean;
  venueId: number;
  length: number;
  width: number;
  sideSpace: number;
  endSpace: number;
  deleted: boolean;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  courtUsages: CourtUsage[];
  venue: Venues;
  courtPriorities: {
    courtPriorityNumber: number;
    clubId: number;
    teamId: number;
    courtId: number;
  }[];
}
