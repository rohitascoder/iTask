import React, { useContext } from 'react';
import { AppContextProvider, AppContext, View } from './contexts/AppContext';
import Layout from './components/Layout';
import TasksView from './views/TasksView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';

const CurrentViewRenderer: React.FC = () => {
  const { currentView } = useContext(AppContext);

  // All authenticated views lead to TasksView
  return <TasksView />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, currentView } = useContext(AppContext);

  if (!isAuthenticated) {
    switch (currentView) {
      case '/register':
        return <RegisterView />;
      case '/login':
      default:
        return <LoginView />;
    }
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
