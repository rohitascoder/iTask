import React, { useContext } from 'react';
import { AppContextProvider, AppContext } from './contexts/AppContext';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import TasksView from './views/TasksView';
import UsersView from './views/UsersView';
import TeamsView from './views/TeamsView';
import PathsView from './views/PathsView';
import SettingsView from './views/SettingsView';
import AccessDenied from './components/AccessDenied';

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

function App() {
  return (
    <AppContextProvider>
      <Layout>
        <CurrentViewRenderer />
      </Layout>
    </AppContextProvider>
  );
}

export default App;
