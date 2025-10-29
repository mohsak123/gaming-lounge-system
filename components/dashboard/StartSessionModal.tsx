import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { GameType, TimeMode } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface Props {
  deviceId: number;
  onClose: () => void;
}

const StartSessionModal: React.FC<Props> = ({ deviceId, onClose }) => {
  const { startSession } = useAppContext();
  const [gameType, setGameType] = useState<GameType>(GameType.Double);
  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.Open);
  const [duration, setDuration] = useState<number>(60);
  const [playerName, setPlayerName] = useState('');
  const { t } = useTranslation();

  const handleStart = () => {
    startSession(deviceId, gameType, timeMode, playerName, timeMode === TimeMode.Timed ? duration : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold mb-4">{t('start_session')} - {t('device')} {deviceId}</h2>
        
        <div className="mb-4">
          <label htmlFor="playerName" className="block font-medium mb-2">{t('player_name')}</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            placeholder={`${t('player_name')} (اختياري)`}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">{t('game_type')}</label>
          <div className="flex gap-4">
            <button onClick={() => setGameType(GameType.Double)} className={`flex-1 p-2 rounded ${gameType === GameType.Double ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('double')}</button>
            <button onClick={() => setGameType(GameType.Quad)} className={`flex-1 p-2 rounded ${gameType === GameType.Quad ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('quad')}</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">{t('time_mode')}</label>
          <div className="flex gap-4">
            <button onClick={() => setTimeMode(TimeMode.Open)} className={`flex-1 p-2 rounded ${timeMode === TimeMode.Open ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('open_time')}</button>
            <button onClick={() => setTimeMode(TimeMode.Timed)} className={`flex-1 p-2 rounded ${timeMode === TimeMode.Timed ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('timed')}</button>
          </div>
        </div>

        {timeMode === TimeMode.Timed && (
          <div className="mb-4">
            <label htmlFor="duration" className="block font-medium mb-2">{t('duration_minutes')}</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              min="15"
              step="15"
            />
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500">{t('cancel')}</button>
          <button onClick={handleStart} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">{t('start')}</button>
        </div>
      </div>
    </div>
  );
};

export default StartSessionModal;