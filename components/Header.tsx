
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleColors: Record<UserRole, string> = {
        [UserRole.ADMIN]: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
        [UserRole.MANAGER]: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
        [UserRole.TEAM_LEADER]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        [UserRole.TEAM_MEMBER]: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-medium leading-5 rounded-full ${roleColors[role]}`}>
            {role}
        </span>
    );
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { currentUser, switchUser, searchTerm, setSearchTerm } = useContext(AppContext);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6H20M4 12H20M4 18H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <div className="relative mx-4 lg:mx-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                    <input
                        className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-primary-500 bg-gray-100 dark:bg-gray-700 border-transparent text-sm py-2 dark:text-gray-200"
                        type="text"
                        placeholder="Search Tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                    <label htmlFor="role-switcher" className="text-sm font-medium hidden sm:block text-gray-600 dark:text-gray-300">Simulate Role:</label>
                    <select
                        id="role-switcher"
                        value={currentUser?.id}
                        onChange={(e) => switchUser(Number(e.target.value))}
                        className="text-sm rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border-transparent focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50 py-2 pl-3 pr-8"
                    >
                        <option value="1">Admin</option>
                        <option value="2">Manager</option>
                        <option value="3">Team Leader</option>
                        <option value="4">Team Member</option>
                    </select>
                </div>
                {currentUser && (
                    <div className="flex items-center">
                        <span className="font-medium mr-3 hidden md:block">{currentUser.username}</span>
                        <RoleBadge role={currentUser.role} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
