
import { User, UserRole, Team, Task, TaskStatus, SystemPath } from './types';

export const USERS: User[] = [
  { id: 1, username: 'admin', role: UserRole.ADMIN, status: 'active', first_login: false, created_at: '2023-01-01T10:00:00Z', last_login: '2023-10-26T10:00:00Z' },
  { id: 2, username: 'manager.jane', role: UserRole.MANAGER, status: 'active', first_login: false, created_at: '2023-01-02T11:00:00Z', last_login: '2023-10-25T11:00:00Z' },
  { id: 3, username: 'leader.john', role: UserRole.TEAM_LEADER, status: 'active', first_login: false, created_at: '2023-01-03T12:00:00Z', teamId: 1, last_login: '2023-10-26T09:00:00Z' },
  { id: 4, username: 'member.alice', role: UserRole.TEAM_MEMBER, status: 'active', first_login: false, created_at: '2023-01-04T13:00:00Z', teamId: 1, last_login: '2023-10-26T12:00:00Z' },
  { id: 5, username: 'member.bob', role: UserRole.TEAM_MEMBER, status: 'inactive', first_login: false, created_at: '2023-01-05T14:00:00Z', teamId: 1, last_login: '2023-09-01T14:00:00Z' },
  { id: 6, username: 'leader.carl', role: UserRole.TEAM_LEADER, status: 'active', first_login: true, created_at: '2023-02-01T09:00:00Z', teamId: 2 },
  { id: 7, username: 'member.diana', role: UserRole.TEAM_MEMBER, status: 'active', first_login: false, created_at: '2023-02-02T10:00:00Z', teamId: 2, last_login: '2023-10-26T14:00:00Z' },
];

export const TEAMS: Team[] = [
  { id: 1, name: 'Alpha Team', leaderId: 3, memberIds: [4, 5] },
  { id: 2, name: 'Bravo Team', leaderId: 6, memberIds: [7] },
];

export const TASKS: Task[] = [
  { id: 1, title: 'Deploy frontend update', description: 'Deploy the latest changes from the main branch to production.', status: TaskStatus.IN_PROGRESS, assigneeId: 4, creatorId: 3, createdAt: '2023-10-25T08:00:00Z' },
  { id: 2, title: 'Fix login bug', description: 'Users are reporting issues with password reset functionality.', status: TaskStatus.PENDING, assigneeId: 4, creatorId: 2, createdAt: '2023-10-26T09:30:00Z' },
  { id: 3, title: 'Design new dashboard widgets', description: 'Create mockups for the new analytics widgets for the main dashboard.', status: TaskStatus.PENDING, assigneeId: 7, creatorId: 6, createdAt: '2023-10-26T11:00:00Z' },
  { id: 4, title: 'Review Q3 performance', description: 'Analyze team performance metrics for the third quarter.', status: TaskStatus.COMPLETED, assigneeId: 3, creatorId: 2, createdAt: '2023-10-20T14:00:00Z' },
  { id: 5, title: 'Setup new database server', description: 'Provision and configure the new PostgreSQL server.', status: TaskStatus.ARCHIVED, assigneeId: 5, creatorId: 1, createdAt: '2023-08-15T16:00:00Z' },
];

export const PATHS: SystemPath[] = [
  { id: 1, name: 'Windchill Data File', path: 'C:\\PTC\\Windchill\\docs' },
  { id: 2, name: 'PPM Files', path: '\\\\server\\share\\ppm_files' },
  { id: 3, name: 'Database Backups', path: '/var/lib/postgresql/backups' },
];