
export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  TEAM_LEADER = 'Team Leader',
  TEAM_MEMBER = 'Team Member',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  status: 'active' | 'inactive';
  first_login: boolean;
  created_at: string;
  last_login?: string;
  teamId?: number;
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: number;
  creatorId: number;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  leaderId: number;
  memberIds: number[];
}

export interface SystemPath {
  id: number;
  name: string;
  path: string;
}
