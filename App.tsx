import React, { useEffect } from 'react';
import Login from './components/auth/Login';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ReportsView from './components/reports/ReportsView';
import AdminView from './components/admin/AdminView';
import { useAppContext } from './hooks/useAppContext';
import { Toaster } from 'react-hot-toast';
import { Page, TimeMode, Session, Report } from './types';
import { useTranslation } from './hooks/useTranslation';

const App: React.FC = () => {
  const { theme, isAuthenticated, page, sessions, updateSession, lastEndedSession, clearLastEndedSession, devices } = useAppContext();
  const { t } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-blue-orange');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'blue_orange') {
      root.classList.add('dark', 'theme-blue-orange');
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
  
  useEffect(() => {
    if (lastEndedSession) {
      const timer = setTimeout(() => {
        clearLastEndedSession();
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [lastEndedSession, clearLastEndedSession]);


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
  
  const deviceName = lastEndedSession ? devices.find(d => d.id === lastEndedSession.deviceId)?.name ?? '' : '';

  return (
    <>
      {lastEndedSession && deviceName && (
        <SessionEndSummaryModal 
          report={lastEndedSession} 
          deviceName={deviceName}
          onClose={clearLastEndedSession} 
        />
      )}
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </>
  );
};

export default App;

// --- Helper Component for Session End Summary ---

interface SessionEndSummaryModalProps {
  report: Report;
  deviceName: string;
  onClose: () => void;
}

const SessionEndSummaryModal: React.FC<SessionEndSummaryModalProps> = ({ report, deviceName, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm m-4 text-center shadow-2xl transition-opacity duration-300 opacity-100">
        <h2 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">{t('session_ended_summary_title')}</h2>
        <p className="text-lg font-semibold mb-4">{t('device')} {deviceName}</p>
        
        <div className="text-right dark:text-gray-200 space-y-2 my-4 border-t border-b dark:border-gray-700 py-4">
            <div className="flex justify-between"><span>{t('duration')}:</span> <strong>{report.durationMinutes} {t('minute_short')}</strong></div>
            <div className="flex justify-between"><span>{t('game_type')}:</span> <strong>{t(report.gameType)}</strong></div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-300 text-lg">{t('player_must_pay')}</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 my-2">{report.cost.toFixed(2)}</p>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold transition-colors"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};