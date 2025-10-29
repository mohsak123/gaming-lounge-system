import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
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

  // Using 'ar-EG' for formatting as it's common and well-supported for Arabic numerals and date formats.
  const formattedTime = new Intl.DateTimeFormat('ar-EG', timeOptions).format(currentTime);
  const formattedDate = new Intl.DateTimeFormat('ar-EG', dateOptions).format(currentTime);

  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wider font-mono">
        {formattedTime}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formattedDate}
      </div>
    </div>
  );
};

export default Clock;
