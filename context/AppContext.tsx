import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Device, Session, Report, DeviceStatus, GameType, TimeMode, Page, AppLabels, Credentials } from '../types';
import { INITIAL_DEVICES, INITIAL_PRICES, INITIAL_LABELS, INITIAL_CREDENTIALS } from '../constants';

interface AppContextType {
  theme: 'light' | 'dark' | 'blue_orange';
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
  addReport: (report: Omit<Report, 'id' | 'date'>) => Report;
  deleteReports: () => void;
  prices: { single: number; double: number; quad: number };
  updatePrices: (newPrices: { single: number; double: number; quad: number }) => void;
  page: Page;
  setPage: (page: Page) => void;
  labels: AppLabels;
  updateLabels: (newLabels: AppLabels) => void;
  credentials: Credentials;
  updateCredentials: (newCreds: Credentials) => void;
  lastEndedSession: Report | null;
  clearLastEndedSession: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const APP_STATE_KEY = 'gamingLoungeState';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark' | 'blue_orange'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [sessions, setSessions] = useState<{ [key: number]: Session | undefined }>({
     3: { deviceId: 3, startTime: Date.now() - 30 * 60 * 1000, gameType: GameType.Double, timeMode: TimeMode.Open, status: 'active', playerName: 'أحمد' }
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [page, setPage] = useState<Page>(Page.DASHBOARD);
  const [labels, setLabels] = useState<AppLabels>(INITIAL_LABELS);
  const [credentials, setCredentials] = useState<Credentials>(INITIAL_CREDENTIALS);
  const [lastEndedSession, setLastEndedSession] = useState<Report | null>(null);

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

  const toggleTheme = () => setTheme(currentTheme => {
    if (currentTheme === 'light') return 'dark';
    if (currentTheme === 'dark') return 'blue_orange';
    return 'light'; // from blue_orange to light
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
      status: 'active',
      playerName: playerName || undefined,
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

  const addReport = (reportData: Omit<Report, 'id' | 'date'>): Report => {
    const newReport: Report = {
      ...reportData,
      id: `${Date.now()}-${reportData.deviceId}`,
      date: new Date(reportData.startTime).toISOString().split('T')[0],
      cost: parseFloat(reportData.cost.toFixed(2)),
    };
    setReports(prev => [...prev, newReport]);
    return newReport;
  };

  const endSession = (deviceId: number) => {
    const session = sessions[deviceId];
    if (!session) return;

    const endTime = Date.now();
    const durationMinutes = Math.floor((endTime - session.startTime) / (1000 * 60));
    
    let pricePerHour: number;
    switch (session.gameType) {
        case GameType.Single:
            pricePerHour = prices.single;
            break;
        case GameType.Double:
            pricePerHour = prices.double;
            break;
        case GameType.Quad:
            pricePerHour = prices.quad;
            break;
        default:
            pricePerHour = 0; // Fallback
    }

    const cost = (durationMinutes / 60) * pricePerHour;
    
    const newReport = addReport({ deviceId, startTime: session.startTime, endTime, durationMinutes, gameType: session.gameType, cost });
    setLastEndedSession(newReport);
    
    setSessions(prev => {
        const newSessions = { ...prev };
        delete newSessions[deviceId];
        return newSessions;
    });
    updateDeviceStatus(deviceId, DeviceStatus.Available);
  };

  const deleteReports = () => setReports([]);
  
  const updatePrices = (newPrices: { single: number; double: number; quad: number }) => setPrices(newPrices);
  
  const updateLabels = (newLabels: AppLabels) => setLabels(newLabels);

  const updateCredentials = (newCreds: Credentials) => setCredentials(newCreds);
  
  const clearLastEndedSession = () => setLastEndedSession(null);

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
    lastEndedSession, clearLastEndedSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};