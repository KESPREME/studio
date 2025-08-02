
export type Urgency = 'Low' | 'Moderate' | 'High';
export type Status = 'New' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  urgency: Urgency;
  status: Status;
  imageUrl?: string;
  reportedBy: string; 
  assignedTo?: string; 
  createdAt: string; 
  updatedAt: string; 
  resolvedAt?: string;
  phone?: string;
}

export type User = {
  name: string;
  email: string;
  role: 'reporter' | 'admin';
  phone?: string;
};
