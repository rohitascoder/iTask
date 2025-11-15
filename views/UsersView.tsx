import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { User, UserRole } from '../types';
import { api } from '../services/mockApi';
import AccessDenied from '../components/AccessDenied';

const UsersView: React.FC = () => {
    const { users, loading, currentUser, teams, addUser } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.TEAM_MEMBER);
    const [newUserTeamId, setNewUserTeamId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetModal = () => {
        setIsModalOpen(false);
        setNewUsername('');
        setNewUserRole(UserRole.TEAM_MEMBER);
        setNewUserTeamId('');
        setIsSubmitting(false);
    };
    
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername) return;

        setIsSubmitting(true);
        const newUserData = {
            username: newUsername,
            role: newUserRole,
            status: 'active' as 'active',
            first_login: true,
            teamId: newUserTeamId ? Number(newUserTeamId) : undefined,
        };

        try {
            const createdUser = await api.createUser(newUserData);
            addUser(createdUser);
            resetModal();
        } catch (error) {
            console.error("Failed to create user", error);
            setIsSubmitting(false);
        }
    };

    if (currentUser?.role !== UserRole.ADMIN) {
        return <AccessDenied />;
    }

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Create User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user: User) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-primary-600 hover:text-primary-800 font-medium px-3 py-1 rounded-md hover:bg-primary-50 transition-colors">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New User</h2>
                        <form onSubmit={handleCreateUser}>
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                    <select id="role" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as UserRole)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team (Optional)</label>
                                    <select id="team" value={newUserTeamId} onChange={(e) => setNewUserTeamId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                                        <option value="">No team</option>
                                        {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={resetModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
                                    {isSubmitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersView;
