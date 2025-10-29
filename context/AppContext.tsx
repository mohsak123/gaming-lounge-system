import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Device, Session, Report, DeviceStatus, GameType, TimeMode, Page, AppLabels, Credentials } from '../types';
import { INITIAL_DEVICES, INITIAL_PRICES, INITIAL_LABELS, INITIAL_CREDENTIALS } from '../constants';

interface AppContextType {
  theme: 'light' | 'dark' | 'neon';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  devices: Device[];
  addDevice: () => void;
  deleteDevice: (id: number) => void;
  updateDeviceStatus: (id: number, status: DeviceStatus) => void;
  sessions: { [key: number]: Session | undefined };
  startSession: (deviceId: number, gameType: GameType, timeMode: TimeMode, playerName?: string, initialMinutes?: number) => void;
  endSession: (deviceId: number) => void;
  updateSession: (deviceId: number, updates: Partial<Session>) => void;
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'date'>) => void;
  deleteReports: () => void;
  prices: { double: number; quad: number };
  updatePrices: (newPrices: { double: number; quad: number }) => void;
  page: Page;
  setPage: (page: Page) => void;
  labels: AppLabels;
  updateLabels: (newLabels: AppLabels) => void;
  credentials: Credentials;
  updateCredentials: (newCreds: Credentials) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const APP_STATE_KEY = 'gamingLoungeState';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark' | 'neon'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [sessions, setSessions] = useState<{ [key: number]: Session | undefined }>({
     3: { deviceId: 3, startTime: Date.now() - 30 * 60 * 1000, gameType: GameType.Double, timeMode: TimeMode.Open, status: 'active', playerName: 'لاعب تجريبي' }
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [page, setPage] = useState<Page>(Page.DASHBOARD);
  const [labels, setLabels] = useState<AppLabels>(INITIAL_LABELS);
  const [credentials, setCredentials] = useState<Credentials>(INITIAL_CREDENTIALS);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(APP_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setTheme(parsed.theme || 'dark');
        setIsAuthenticated(parsed.isAuthenticated || false);
        setDevices(parsed.devices || INITIAL_DEVICES);
        setSessions(parsed.sessions || {});
        setReports(parsed.reports || []);
        setPrices(parsed.prices || INITIAL_PRICES);
        setLabels(parsed.labels || INITIAL_LABELS);
        setCredentials(parsed.credentials || INITIAL_CREDENTIALS);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const stateToSave = {
        theme,
        isAuthenticated,
        devices,
        sessions,
        reports,
        prices,
        labels,
        credentials,
      };
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(stateToSave));
    }
  }, [theme, isAuthenticated, devices, sessions, reports, prices, labels, credentials, isLoaded]);

  const toggleTheme = () => setTheme(prev => {
    if (prev === 'light') return 'dark';
    if (prev === 'dark') return 'neon';
    return 'light';
  });

  const login = (user: string, pass: string): boolean => {
    if (user === credentials.loginUser && pass === credentials.loginPass) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => setIsAuthenticated(false);

  const addDevice = () => {
    setDevices(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(d => d.id)) + 1 : 1;
      return [...prev, { id: newId, name: `PS-${newId}`, status: DeviceStatus.Available }];
    });
  };

  const deleteDevice = (id: number) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const updateDeviceStatus = (id: number, status: DeviceStatus) => {
    setDevices(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const startSession = (deviceId: number, gameType: GameType, timeMode: TimeMode, playerName?: string, initialMinutes?: number) => {
    const now = Date.now();
    const newSession: Session = {
      deviceId,
      startTime: now,
      gameType,
      timeMode,
      playerName,
      status: 'active',
    };
    if (timeMode === TimeMode.Timed && initialMinutes) {
      newSession.initialMinutes = initialMinutes;
      newSession.endTime = now + initialMinutes * 60 * 1000;
    }
    setSessions(prev => ({ ...prev, [deviceId]: newSession }));
    updateDeviceStatus(deviceId, DeviceStatus.Busy);
  };
  
  const updateSession = (deviceId: number, updates: Partial<Session>) => {
    setSessions(prev => {
        const currentSession = prev[deviceId];
        if (!currentSession) return prev;
        return {
            ...prev,
            [deviceId]: { ...currentSession, ...updates },
        };
    });
  };


  const endSession = (deviceId: number) => {
    const session = sessions[deviceId];
    if (!session) return;

    const endTime = Date.now();
    const durationMinutes = Math.floor((endTime - session.startTime) / (1000 * 60));
    const pricePerHour = session.gameType === GameType.Double ? prices.double : prices.quad;
    const cost = (durationMinutes / 60) * pricePerHour;
    
    addReport({ deviceId, playerName: session.playerName, startTime: session.startTime, endTime, durationMinutes, gameType: session.gameType, cost });
    
    setSessions(prev => {
        const newSessions = { ...prev };
        delete newSessions[deviceId];
        return newSessions;
    });
    updateDeviceStatus(deviceId, DeviceStatus.Available);
  };

  const addReport = (reportData: Omit<Report, 'id' | 'date'>) => {
    const newReport: Report = {
      ...reportData,
      id: `${Date.now()}-${reportData.deviceId}`,
      date: new Date(reportData.startTime).toISOString().split('T')[0],
      cost: parseFloat(reportData.cost.toFixed(2)),
    };
    setReports(prev => [...prev, newReport]);
  };

  const deleteReports = () => setReports([]);
  
  const updatePrices = (newPrices: { double: number; quad: number }) => setPrices(newPrices);
  
  const updateLabels = (newLabels: AppLabels) => setLabels(newLabels);

  const updateCredentials = (newCreds: Credentials) => setCredentials(newCreds);

  const value = {
    theme, toggleTheme,
    isAuthenticated, login, logout,
    devices, addDevice, deleteDevice, updateDeviceStatus,
    sessions, startSession, endSession, updateSession,
    reports, addReport, deleteReports,
    prices, updatePrices,
    page, setPage,
    labels, updateLabels,
    credentials, updateCredentials,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};