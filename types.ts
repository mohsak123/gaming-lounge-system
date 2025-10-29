export enum DeviceStatus {
  Available = 'available',
  Busy = 'busy',
  Maintenance = 'maintenance',
}

export enum GameType {
  Double = 'double',
  Quad = 'quad',
}

export enum TimeMode {
  Open = 'open',
  Timed = 'timed',
}

export interface Device {
  id: number;
  name: string;
  status: DeviceStatus;
}

export interface Session {
  deviceId: number;
  startTime: number;
  gameType: GameType;
  timeMode: TimeMode;
  playerName?: string;
  initialMinutes?: number;
  endTime?: number;
  status: 'active' | 'ending' | 'ended';
  timeUpNotified?: boolean;
  showExtendModal?: boolean;
  showTimeUpModal?: boolean;
}

export interface Report {
  id: string;
  deviceId: number;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  gameType: GameType;
  playerName?: string;
  cost: number;
  date: string; // YYYY-MM-DD
}

export enum Page {
    DASHBOARD = 'dashboard',
    REPORTS = 'reports',
    ADMIN = 'admin',
}

export type AppLabels = {
  [key in Page | string]: string;
};

export interface Credentials {
  loginUser: string;
  loginPass: string;
  adminPass: string;
}