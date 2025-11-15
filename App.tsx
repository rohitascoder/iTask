import React, { useContext } from 'react';
import { AppContextProvider, AppContext } from './contexts/AppContext';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import TasksView from './views/TasksView';
import UsersView from './views/UsersView';
import TeamsView from './views/TeamsView';
import PathsView from './views/PathsView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';

const CurrentViewRenderer: React.FC = () => {
  const { currentView } = useContext(AppContext);

  switch (currentView) {
    case '/dashboard':
      return <DashboardView />;
    case '/tasks':
      return <TasksView />;
    case '/users':
      return <UsersView />;
    case '/teams':
      return <TeamsView />;
    case '/settings':
      return <SettingsView />;
    case '/settings/paths':
      return <PathsView />;
    default:
      return <DashboardView />;
  }
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useContext(AppContext);

  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
             <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-200">Loading Application...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <Layout>
      <CurrentViewRenderer />
    </Layout>
  );
};


function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;