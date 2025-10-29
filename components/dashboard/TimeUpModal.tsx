
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { TimeMode } from '../../types';

interface Props {
  deviceId: number;
  onClose: () => void;
}

const TimeUpModal: React.FC<Props> = ({ deviceId, onClose }) => {
  const { endSession, updateSession } = useAppContext();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      handleEndNow();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, deviceId, endSession, onClose]);

  const handleExtend = () => {
    updateSession(deviceId, { showExtendModal: true });
    onClose();
  };

  const handleSwitchToOpen = () => {
    updateSession(deviceId, { timeMode: TimeMode.Open, endTime: undefined });
    onClose();
  };

  const handleEndNow = () => {
    endSession(deviceId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg m-4 text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-yellow-500">{t('session_time_ended_for')} PS{deviceId}</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{t('choose_action')}</p>
        
        <div className="my-6">
            <div className="text-6xl font-mono font-bold text-red-500">{countdown}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('session_will_end_in', String(countdown))}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
                onClick={handleExtend} 
                className="px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                {t('extend_time')}
            </button>
            <button 
                onClick={handleSwitchToOpen} 
                className="px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
                {t('switch_to_open_time')}
            </button>
            <button 
                onClick={handleEndNow} 
                className="px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                {t('end_session_now')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TimeUpModal;
