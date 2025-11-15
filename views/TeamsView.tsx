import React, { useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Team, User, UserRole } from '../types';
import AccessDenied from '../components/AccessDenied';

const TeamCard: React.FC<{ team: Team, leader?: User, members: User[] }> = ({ team, leader, members }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{team.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Team Leader: <span className="font-medium text-primary-600 dark:text-primary-400">{leader?.username || 'Not assigned'}</span>
        </p>
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Members ({members.length})</h4>
            <ul className="space-y-2">
                {members.map(member => (
                    <li key={member.id} className="flex items-center space-x-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{member.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const TeamsView: React.FC = () => {
    const { teams, users, loading, currentUser } = useContext(AppContext);
    
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.MANAGER) {
         return <AccessDenied />;
    }
    
    const userMap = useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

    if (loading) return <div>Loading teams...</div>;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Manage Teams</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => {
                    const leader = userMap.get(team.leaderId);
                    const members = team.memberIds.map(id => userMap.get(id)).filter((u): u is User => !!u);
                    return <TeamCard key={team.id} team={team} leader={leader} members={members} />;
                })}
            </div>
        </div>
    );
};

export default TeamsView;