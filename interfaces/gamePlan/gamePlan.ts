import type Users from "../users/users";

export interface GamePlan {
  gameId: number;
  id: number;
  gameRoleId: number;
  statusId: number;
  display: string | null;
  userId: number;
  teamId: number | null;
  responsibleType: string | null;
  responsibleId: number | null;
  responsibleAcceptedById: number | null;
  responsibleAcceptedTimeStamp: string | null;
  assignedToId: number | null;
  assignedAcceptedById: number | null;
  assignedAcceptedTimeStamp: string | null;
  fee: number | null;
  ferryFee: number | null;
  foodFee: number | null;
  gameFee: number | null;
  drivingFee: number | null;
  feeChangedBy: number | null;
  originalFee: number | null;
  feeApproved: boolean | null;
  feeFinal: boolean | null;
  feeComment: string | null;
  feeApprovedByRefTimeStamp: string | null;
  feeApprovedByFinal: boolean | null;
  feeRef: number | null;
  createdAt: string;
  updatedAt: string;
  user: Users;
  
}
