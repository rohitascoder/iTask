
import React, { createContext, useState, useEffect } from 'react';
import { User, Task, Team, SystemPath, UserRole } from '../types';
import { api } from '../services/mockApi';

export type View = '/dashboard' | '/tasks' | '/users' | '/teams' | '/settings' | '/settings/paths';

interface AppContextType {
    currentUser: User | null;
    users: User[];
    tasks: Task[];
    teams: Team[];
    paths: SystemPath[];
    loading: boolean;
    error: string | null;
    switchUser: (userId: number) => void;
    currentView: View;
    navigate: (view: View) => void;
    addTask: (task: Task) => void;
    addUser: (user: User) => void;
}

export const AppContext = createContext<AppContextType>({
    currentUser: null,
    users: [],
    tasks: [],
    teams: [],
    paths: [],
    loading: true,
    error: null,
    switchUser: () => {},
    currentView: '/dashboard',
    navigate: () => {},
    addTask: () => {},
    addUser: () => {},
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [paths, setPaths] = useState<SystemPath[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('/dashboard');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, tasksData, teamsData, pathsData] = await Promise.all([
                api.getUsers(),
                api.getTasks(),
                api.getTeams(),
                api.getPaths(),
            ]);
            setUsers(usersData);
            setTasks(tasksData);
            setTeams(teamsData);
            setPaths(pathsData);
            
            // Set initial user (Team Member)
            const initialUser = usersData.find(u => u.role === UserRole.TEAM_MEMBER);
            if(initialUser) {
                setCurrentUser(initialUser);
            } else if (usersData.length > 0) {
                setCurrentUser(usersData[0]);
            }
            
        } catch (err) {
            setError('Failed to load data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const switchUser = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        }
    };

    const navigate = (view: View) => {
        setCurrentView(view);
    };

    const addTask = (task: Task) => {
        setTasks(prevTasks => [...prevTasks, task]);
    };

    const addUser = (user: User) => {
        setUsers(prevUsers => [...prevUsers, user]);
    };

    const value = {
        currentUser,
        users,
        tasks,
        teams,
        paths,
        loading,
        error,
        switchUser,
        currentView,
        navigate,
        addTask,
        addUser,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};