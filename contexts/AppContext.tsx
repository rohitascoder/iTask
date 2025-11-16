import React, { createContext, useState, useEffect } from 'react';

export type View = '/tasks' | '/login' | '/register';
export type Theme = 'light' | 'dark';

interface AppContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    currentView: View;
    navigate: (view: View) => void;
    theme: Theme;
    toggleTheme: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const AppContext = createContext<AppContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    currentView: '/login',
    navigate: () => {},
    theme: 'light',
    toggleTheme: () => {},
    searchTerm: '',
    setSearchTerm: () => {},
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('jwt_token'));
    const [currentView, setCurrentView] = useState<View>(isAuthenticated ? '/tasks' : '/login');
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
    
    // Clear search term when navigating away from the tasks view
    useEffect(() => {
        if (currentView !== '/tasks') {
            setSearchTerm('');
        }
    }, [currentView]);

    const login = (token: string) => {
        localStorage.setItem('jwt_token', token);
        setIsAuthenticated(true);
        setCurrentView('/tasks');
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
        setCurrentView('/login');
    };

    const navigate = (view: View) => {
        setCurrentView(view);
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        currentView,
        navigate,
        theme,
        toggleTheme,
        searchTerm,
        setSearchTerm,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
