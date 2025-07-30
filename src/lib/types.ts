import { ObjectId } from "mongodb";

export type Urgency = 'Low' | 'Moderate' | 'High';
export type Status = 'New' | 'In Progress' | 'Resolved';

export interface Report {
  _id: string | ObjectId;
  description: string;
  latitude: number;
  longitude: number;
  urgency: Urgency;
  status: Status;
  imageUrl?: string;
  reportedBy: string; // Should be ObjectId (User reference)
  assignedTo?: string; // Should be ObjectId (User reference)
  createdAt: string; // Should be Date
  updatedAt: string; // Should be Date
  resolvedAt?: string; // Should be Date
}
