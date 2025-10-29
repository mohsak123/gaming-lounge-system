import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Page } from '../../types';
import { SunIcon, MoonIcon, SparklesIcon } from '../ui/Icons';
import { useTranslation } from '../../hooks/useTranslation';
import Clock from './Clock';


const Header: React.FC = () => {
  const { theme, toggleTheme, page, setPage, labels } = useAppContext();
  const { t } = useTranslation();

  const NavLink: React.FC<{ targetPage: Page, children: React.ReactNode }> = ({ targetPage, children }) => (
    <button
      onClick={() => setPage(targetPage)}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        page === targetPage 
        ? 'bg-gray-900 dark:bg-gray-700 text-white' 
        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  const renderThemeIcon = () => {
    if (theme === 'light') return <MoonIcon className="h-6 w-6" />;
    if (theme === 'dark') return <SparklesIcon className="h-6 w-6" />;
    return <SunIcon className="h-6 w-6" />
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">نظام صالة الألعاب</h1>
            <nav className="hidden md:flex ms-10 space-x-4 space-x-reverse">
              <NavLink targetPage={Page.DASHBOARD}>{t('dashboard')}</NavLink>
              <NavLink targetPage={Page.REPORTS}>{t('reports')}</NavLink>
              <NavLink targetPage={Page.ADMIN}>{t('admin')}</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Clock />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={t('theme_switcher')}
            >
              {renderThemeIcon()}
            </button>
          </div>
        </div>
         <div className="md:hidden flex justify-center pb-3 space-x-2 space-x-reverse">
            <NavLink targetPage={Page.DASHBOARD}>{t('dashboard')}</NavLink>
            <NavLink targetPage={Page.REPORTS}>{t('reports')}</NavLink>
            <NavLink targetPage={Page.ADMIN}>{t('admin')}</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;