
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import DeviceCard from './DeviceCard';

const DashboardView: React.FC = () => {
  const { devices } = useAppContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {devices.map(device => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
};

export default DashboardView;
