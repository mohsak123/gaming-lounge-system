import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Page } from '../../types';
import { SunIcon, MoonIcon, PaintBrushIcon } from '../ui/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const DateTimeDisplay: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Damascus',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Damascus',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedTime = currentDateTime.toLocaleString('en-US', timeOptions);
  const formattedDate = currentDateTime.toLocaleString('en-US', dateOptions);

  return (
    <div className="text-right truncate">
      <div className="hidden sm:block text-xs font-semibold text-gray-600 dark:text-gray-400">{formattedDate}</div>
      <div className="text-base sm:text-lg font-mono font-bold text-gray-800 dark:text-gray-200">{formattedTime}</div>
    </div>
  );
};


const Header: React.FC = () => {
  const { theme, toggleTheme, page, setPage } = useAppContext();
  const { t } = useTranslation();

  const NavLink: React.FC<{ targetPage: Page, children: React.ReactNode, isMobile?: boolean }> = ({ targetPage, children, isMobile = false }) => (
    <button
      onClick={() => setPage(targetPage)}
      className={`font-medium transition-colors duration-200 ${
        page === targetPage 
        ? 'bg-gray-900 dark:bg-gray-700 text-white' 
        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      } ${isMobile ? 'px-5 py-3 rounded-lg text-base' : 'px-3 py-2 rounded-md text-sm'}`}
    >
      {children}
    </button>
  );

  const renderThemeIcon = () => {
    if (theme === 'light') {
      return <MoonIcon className="h-6 w-6" />; // Shows icon to switch to Dark
    }
    if (theme === 'dark') {
      return <PaintBrushIcon className="h-6 w-6" />; // Shows icon to switch to Blue/Orange
    }
    // theme is 'blue_orange'
    return <SunIcon className="h-6 w-6" />; // Shows icon to switch to Light
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* LEFT WING */}
          <div className="flex-1 flex justify-start min-w-0">
            <DateTimeDisplay />
          </div>

          {/* CENTER */}
          <div className="flex-shrink-0 px-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {t('app_title')}
            </h1>
          </div>

          {/* RIGHT WING */}
          <div className="flex-1 flex justify-end items-center min-w-0">
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              <NavLink targetPage={Page.DASHBOARD}>{t('dashboard')}</NavLink>
              <NavLink targetPage={Page.REPORTS}>{t('reports')}</NavLink>
              <NavLink targetPage={Page.ADMIN}>{t('admin')}</NavLink>
            </nav>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-4"
              aria-label={t('theme_switcher')}
            >
              {renderThemeIcon()}
            </button>
          </div>
        </div>
         <nav className="md:hidden border-t border-gray-200 dark:border-gray-700">
           <div className="flex justify-around items-center py-2">
            <NavLink targetPage={Page.DASHBOARD} isMobile>{t('dashboard')}</NavLink>
            <NavLink targetPage={Page.REPORTS} isMobile>{t('reports')}</NavLink>
            <NavLink targetPage={Page.ADMIN} isMobile>{t('admin')}</NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;