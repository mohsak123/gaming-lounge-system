
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface Props {
  deviceId: number;
  onClose: () => void;
}

const ExtendSessionModal: React.FC<Props> = ({ deviceId, onClose }) => {
  const { sessions, updateSession } = useAppContext();
  const session = sessions[deviceId];
  const [additionalMinutes, setAdditionalMinutes] = useState(30);
  const { t } = useTranslation();

  const handleExtend = () => {
    if (session && session.timeMode === 'timed' && session.endTime) {
      const newEndTime = session.endTime + additionalMinutes * 60 * 1000;
      updateSession(deviceId, { endTime: newEndTime, timeUpNotified: false });
    }
    onClose();
  };

  const timeOptions = [15, 30, 45, 60];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold mb-4">{t('extend_session_for')} {t('device')} {deviceId}</h2>
        
        <div className="mb-4">
          <label className="block font-medium mb-2">{t('additional_time')}</label>
          <div className="grid grid-cols-2 gap-4">
            {timeOptions.map(minutes => (
                <button 
                    key={minutes}
                    onClick={() => setAdditionalMinutes(minutes)} 
                    className={`p-4 text-lg rounded-lg text-center font-semibold ${additionalMinutes === minutes ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    {minutes} {t('duration_minutes')}
                </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500">{t('cancel')}</button>
          <button onClick={handleExtend} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">{t('confirm_extension')}</button>
        </div>
      </div>
    </div>
  );
};

export default ExtendSessionModal;
