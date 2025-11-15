import React, { createContext, useState, useEffect } from 'react';
import { User, Task, Team, SystemPath, UserRole } from '../types';
import { api } from '../services/mockApi';

export type View = '/dashboard' | '/tasks' | '/users' | '/teams' | '/settings' | '/settings/paths';
export type Theme = 'light' | 'dark';

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
    updateTask: (task: Task) => void;
    deleteTask: (taskId: number) => void;
    theme: Theme;
    toggleTheme: () => void;
    logout: () => void;
    login: (username: string, password: string) => Promise<void>;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
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
    updateTask: () => {},
    deleteTask: () => {},
    theme: 'light',
    toggleTheme: () => {},
    logout: () => {},
    login: async () => {},
    searchTerm: '',
    setSearchTerm: () => {},
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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'light';
    });

     useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

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

    // Clear search term when navigating away from the tasks view
    useEffect(() => {
        if (currentView !== '/tasks') {
            setSearchTerm('');
        }
    }, [currentView]);

    const switchUser = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        }
    };
    
    const login = async (username: string, password: string): Promise<void> => {
        // Note: This is a mock authentication. In a real app, this would be an API call.
        const userToLogin = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!userToLogin) {
            throw new Error('Invalid username or password.');
        }

        // Special check for the admin user as requested.
        if (userToLogin.role === UserRole.ADMIN) {
            if (password !== 'admin') {
                throw new Error('Invalid username or password.');
            }
        }
        // For other users, we can assume any password works for this simulation.

        setCurrentUser(userToLogin);
        navigate('/dashboard');
        return Promise.resolve();
    };

    const logout = () => {
        setCurrentUser(null);
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

    const updateTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const deleteTask = (taskId: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
        updateTask,
        deleteTask,
        theme,
        toggleTheme,
        logout,
        login,
        searchTerm,
        setSearchTerm,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};