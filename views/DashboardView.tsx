import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { TaskStatus, UserRole } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; iconBgColor: string }> = ({ title, value, icon, iconBgColor }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center space-x-4">
        <div className={`rounded-full p-3 ${iconBgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 13a5.995 5.995 0 00-3-5.197" />
  </svg>
);
const TaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DashboardView: React.FC = () => {
    const { currentUser, users, tasks, loading } = useContext(AppContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    const visibleTasks = tasks.filter(task => {
        if (!currentUser) return false;
        switch (currentUser.role) {
            case UserRole.ADMIN:
            case UserRole.MANAGER:
                return true;
            case UserRole.TEAM_LEADER:
                const teamMembers = users.filter(u => u.teamId === currentUser.teamId).map(u => u.id);
                return teamMembers.includes(task.assigneeId);
            case UserRole.TEAM_MEMBER:
                return task.assigneeId === currentUser.id;
        }
    });

    const pendingTasks = visibleTasks.filter(t => t.status === TaskStatus.PENDING).length;
    const completedTasks = visibleTasks.filter(t => t.status === TaskStatus.COMPLETED).length;


    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {currentUser?.username}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Active Users" value={users.filter(u => u.status === 'active').length} icon={<UsersIcon className="w-8 h-8 text-blue-600"/>} iconBgColor="bg-blue-100" />
                <StatCard title="Pending Tasks" value={pendingTasks} icon={<TaskIcon className="w-8 h-8 text-orange-600"/>} iconBgColor="bg-orange-100"/>
                <StatCard title="Completed Tasks" value={completedTasks} icon={<CheckCircleIcon className="w-8 h-8 text-green-600"/>} iconBgColor="bg-green-100"/>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Recent Activity</h2>
                 <ul className="divide-y divide-gray-200">
                    {visibleTasks.slice(0, 5).map(task => (
                        <li key={task.id} className="py-4">
                            <div className="flex space-x-3">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{task.description}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
    );
};

export default DashboardView;