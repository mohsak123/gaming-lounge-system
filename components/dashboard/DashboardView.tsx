
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import DeviceCard from './DeviceCard';
import { useTranslation } from '../../hooks/useTranslation';
import { DeviceStatus } from '../../types';

const DashboardView: React.FC = () => {
  const { devices } = useAppContext();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');

  const filteredDevices = useMemo(() => {
    return devices
      .filter(device => {
        if (statusFilter === 'all') return true;
        return device.status === statusFilter;
      })
      .filter(device => {
        return device.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [devices, searchTerm, statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <input
          type="text"
          placeholder={t('search_by_device_name')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          aria-label={t('search_by_device_name')}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DeviceStatus | 'all')}
          className="p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          aria-label="Filter by status"
        >
          <option value="all">{t('all_statuses')}</option>
          <option value={DeviceStatus.Available}>{t('available')}</option>
          <option value={DeviceStatus.Busy}>{t('busy')}</option>
          <option value={DeviceStatus.Maintenance}>{t('maintenance')}</option>
        </select>
      </div>

      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg">{t('no_devices_match_search')}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
