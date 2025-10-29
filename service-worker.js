const CACHE_NAME = 'gaming-lounge-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/context/AppContext.tsx',
  '/hooks/useAppContext.ts',
  '/hooks/useTranslation.ts',
  '/components/ui/Icons.tsx',
  '/components/layout/Header.tsx',
  '/components/auth/Login.tsx',
  '/components/dashboard/DashboardView.tsx',
  '/components/dashboard/DeviceCard.tsx',
  '/components/dashboard/StartSessionModal.tsx',
  '/components/dashboard/ExtendSessionModal.tsx',
  '/components/dashboard/TimeUpModal.tsx',
  '/components/reports/ReportsView.tsx',
  '/components/admin/AdminView.tsx',
  '/components/admin/LabelEditor.tsx',
  '/components/admin/PasswordManager.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0',
  'https://aistudiocdn.com/react-hot-toast@^2.6.0',
  'https://aistudiocdn.com/jspdf@^3.0.3',
  'https://aistudiocdn.com/jspdf-autotable@^5.0.2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
