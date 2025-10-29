import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Device, DeviceStatus, Session } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import StartSessionModal from './StartSessionModal';
import ExtendSessionModal from './ExtendSessionModal';
import TimeUpModal from './TimeUpModal';
import { useTranslation } from '../../hooks/useTranslation';
import { UsersIcon, UserGroupIcon, ClockIcon, InformationCircleIcon } from '../ui/Icons';

const DeviceCard: React.FC<{ device: Device }> = ({ device }) => {
  const { sessions, endSession, updateSession, prices } = useAppContext();
  const session = sessions[device.id];
  const [isStartModalOpen, setStartModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    let interval: number | undefined;
    if (session?.status === 'active' && session.timeMode === 'timed' && session.endTime) {
      interval = setInterval(() => {
        const remaining = session.endTime! - Date.now();
        if (remaining <= 0) {
          setTimeRemaining('00:00:00');
          clearInterval(interval);
        } else {
          const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((remaining / 1000 / 60) % 60);
          const seconds = Math.floor((remaining / 1000) % 60);
          setTimeRemaining(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }
      }, 1000);
    } else if(session?.status === 'active' && session.timeMode === 'open') {
        interval = setInterval(() => {
            const elapsed = Date.now() - session.startTime;
            const hours = Math.floor((elapsed / (1000 * 60 * 60)));
            const minutes = Math.floor((elapsed / 1000 / 60) % 60);
            const seconds = Math.floor((elapsed / 1000) % 60);
            setTimeRemaining(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
      if (session?.status === 'ending') {
          endSession(device.id);
      }
  }, [session?.status, device.id, endSession]);

  const handleEndSessionRequest = () => {
    if (!session) return;

    const endTime = Date.now();
    const durationMinutes = Math.floor((endTime - session.startTime) / (1000 * 60));
    const pricePerHour = session.gameType === 'double' ? prices.double : prices.quad;
    const cost = (durationMinutes / 60) * pricePerHour;

    toast.custom((tst) => (
      <div
        className={`${
          tst.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
               <div className="p-2 bg-blue-500 rounded-full">
                  <InformationCircleIcon className="h-6 w-6 text-white" />
               </div>
            </div>
            <div className="ms-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('confirm_end_session')} - {device.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('duration')}: {durationMinutes} {t('minute_short')}
              </p>
               <p className="mt-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                {t('cost')}: {cost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-s border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              endSession(device.id);
              toast.dismiss(tst.id);
            }}
            className="w-full border-b border-gray-200 dark:border-gray-700 rounded-none rounded-tr-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t('confirm')}
          </button>
          <button
            onClick={() => toast.dismiss(tst.id)}
            className="w-full border border-transparent rounded-none rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    ), { duration: 15000 });
  };


  const getStatusClasses = () => {
    switch (device.status) {
      case DeviceStatus.Available:
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case DeviceStatus.Busy:
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case DeviceStatus.Maintenance:
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const StatusBadge: React.FC = () => {
    switch (device.status) {
        case DeviceStatus.Available:
            return <div className="absolute top-3 left-3 text-xs font-bold text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-800/50 px-2 py-1 rounded-full">{t('available')}</div>;
        case DeviceStatus.Busy:
            return <div className="absolute top-3 left-3 text-xs font-bold text-red-800 dark:text-red-300 bg-red-200 dark:bg-red-800/50 px-2 py-1 rounded-full">{t('busy')}</div>;
        case DeviceStatus.Maintenance:
            return <div className="absolute top-3 left-3 text-xs font-bold text-yellow-800 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded-full">{t('maintenance')}</div>;
    }
  };

  return (
    <>
      <div className={`relative p-4 rounded-lg border-2 shadow-sm transition-all duration-300 ${getStatusClasses()}`}>
        <StatusBadge />
        <h3 className="text-xl font-bold text-center mt-6">{t('device')} {device.name}</h3>
        
        <div className="mt-4 min-h-[120px] flex flex-col items-center justify-center">
            {device.status === DeviceStatus.Available && (
                <button onClick={() => setStartModalOpen(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">{t('start_session')}</button>
            )}
            {device.status === DeviceStatus.Maintenance && (
                <p className="text-yellow-600 dark:text-yellow-400">{t('maintenance')}</p>
            )}
            {device.status === DeviceStatus.Busy && session && (
                <div className="w-full text-center">
                    <div className="flex justify-center items-center gap-4 text-lg font-semibold">
                        {session.gameType === 'double' ? <UsersIcon className="h-6 w-6"/> : <UserGroupIcon className="h-6 w-6" />}
                        <span>{session.gameType === 'double' ? t('double') : t('quad')}</span>
                    </div>
                     {session.playerName && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 font-semibold truncate" title={session.playerName}>
                        {session.playerName}
                      </p>
                    )}
                    <div className="my-2 text-2xl font-mono tracking-wider">
                      {timeRemaining}
                    </div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.timeMode === 'timed' ? t('time_remaining') : t('open_time')}
                     </p>
                    <button onClick={handleEndSessionRequest} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{t('end_session')}</button>
                </div>
            )}
        </div>
      </div>
      {isStartModalOpen && <StartSessionModal deviceId={device.id} onClose={() => setStartModalOpen(false)} />}
      {session?.showExtendModal && <ExtendSessionModal deviceId={device.id} onClose={() => updateSession(device.id, { showExtendModal: false })} />}
      {session?.showTimeUpModal && <TimeUpModal deviceId={device.id} onClose={() => updateSession(device.id, { showTimeUpModal: false })} />}
    </>
  );
};

export default DeviceCard;