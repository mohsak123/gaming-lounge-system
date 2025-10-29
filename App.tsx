import React, { useEffect } from 'react';
import Login from './components/auth/Login';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ReportsView from './components/reports/ReportsView';
import AdminView from './components/admin/AdminView';
import { useAppContext } from './hooks/useAppContext';
import { Toaster } from 'react-hot-toast';
import { Page, TimeMode, Session } from './types';
import { useTranslation } from './hooks/useTranslation';

const App: React.FC = () => {
  const { theme, isAuthenticated, page, sessions, updateSession } = useAppContext();
  const { t } = useTranslation();

  useEffect(() => {
    const doc = document.documentElement;
    doc.classList.remove('dark', 'neon');
    if (theme === 'dark') {
      doc.classList.add('dark');
    } else if (theme === 'neon') {
      doc.classList.add('dark', 'neon');
    }
  }, [theme]);

  useEffect(() => {
    const activeSessions = (Object.values(sessions) as (Session | undefined)[]).filter(s => s?.status === 'active');
    const interval = setInterval(() => {
        activeSessions.forEach(session => {
            if (session && session.timeMode === TimeMode.Timed && session.endTime && session.endTime <= Date.now() && !session.timeUpNotified) {
                updateSession(session.deviceId, { timeUpNotified: true, showTimeUpModal: true });
            }
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessions, updateSession]);


  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (page) {
      case Page.DASHBOARD:
        return <DashboardView />;
      case Page.REPORTS:
        return <ReportsView />;
      case Page.ADMIN:
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </>
  );
};

export default App;