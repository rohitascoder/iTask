import React, { useContext, useState, useEffect } from 'react';
import { AppContext, View } from '../contexts/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const TaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 13a5.995 5.995 0 00-3-5.197" />
  </svg>
);
const TeamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const PathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2z" />
  </svg>
);
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

interface NavItem {
  to?: View;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  roles: UserRole[];
  children?: (Omit<NavItem, 'children'> & { to: View })[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, currentView, navigate } = useContext(AppContext);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const role = currentUser?.role;

  useEffect(() => {
    // Open settings menu if a child route is active
    if (currentView.startsWith('/settings')) {
      setSettingsMenuOpen(true);
    }
  }, [currentView]);

  const navLinkClasses = "flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left";
  const activeLinkClasses = "bg-primary-500 text-white hover:bg-primary-500 hover:text-white";
  const subNavLinkClasses = "flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left";
  const activeSubNavLinkClasses = "bg-primary-50 text-primary-600 font-semibold";

  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: HomeIcon, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER] },
    { to: '/tasks', label: 'Tasks', icon: TaskIcon, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER] },
    { to: '/users', label: 'Manage Users', icon: UsersIcon, roles: [UserRole.ADMIN] },
    { to: '/teams', label: 'Manage Teams', icon: TeamIcon, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { 
      label: 'Settings', 
      icon: SettingsIcon, 
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TEAM_LEADER],
      children: [
          { to: '/settings', label: 'General', icon: SettingsIcon, roles: [UserRole.ADMIN, UserRole.MANAGER] },
          { to: '/settings/paths', label: 'System Paths', icon: PathIcon, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.TEAM_LEADER] }
      ]
    },
  ];

  const handleNavigate = (path: View) => {
    navigate(path);
    if (window.innerWidth < 1024) { // Close sidebar on mobile
        setSidebarOpen(false);
    }
  };

  const isPathActive = (path: string, isParent: boolean = false) => {
    if (isParent) {
        return currentView.startsWith(path);
    }
    return currentView === path;
  };
  
  const visibleNavItems = navItems.filter(item => role && item.roles.includes(role));

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-800">Gemini Tasks</span>
          </div>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {visibleNavItems.map((item) => (
            <div key={item.label}>
                {item.children ? (
                    <>
                        <button
                          onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                          className={`${navLinkClasses} ${isPathActive('/settings', true) ? 'text-primary-600 bg-primary-50' : ''} justify-between`}
                        >
                            <div className="flex items-center">
                                <item.icon className="h-5 w-5" />
                                <span className="mx-4 font-medium">{item.label}</span>
                            </div>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${settingsMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {settingsMenuOpen && (
                            <div className="pl-8 pt-2 space-y-1">
                                {item.children.filter(child => role && child.roles.includes(role)).map(child => (
                                    <button
                                        key={child.to}
                                        onClick={() => handleNavigate(child.to)}
                                        className={`${subNavLinkClasses} ${isPathActive(child.to) ? activeSubNavLinkClasses : ''}`}
                                    >
                                        <span className="font-medium">{child.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <button
                      onClick={() => item.to && handleNavigate(item.to)}
                      className={`${navLinkClasses} ${isPathActive(item.to || '') ? activeLinkClasses : ''}`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="mx-4 font-medium">{item.label}</span>
                    </button>
                )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;