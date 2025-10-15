import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './styles/index.css';
import { LanguageProvider } from './lib/hooks/useLanguage';
import { NotificationProvider } from './lib/hooks/useNotificationProvider';
import { Home } from './app/Home';
import { Order } from './app/Order';
import { Gallery } from './app/Gallery';
import { Contact } from './app/Contact';
import { ProtectedCabinet } from './app/ProtectedCabinet';
import { AdminDashboard } from './app/admin';
import { EmailConfirmationHandler } from './components/auth/EmailConfirmationHandler';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/order', element: <Order /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/contact', element: <Contact /> },
  { path: '/cabinet', element: <ProtectedCabinet /> },
  { path: '/admin', element: <AdminDashboard /> },
  // Catch-all route to handle old HTML file requests
  { path: '/index.html', element: <Navigate to="/" replace /> },
  { path: '/gallery.html', element: <Navigate to="/gallery" replace /> },
  { path: '/contact_us.html', element: <Navigate to="/contact" replace /> },
  { path: '/make_your_own_crepe.html', element: <Navigate to="/order" replace /> },
  // Fallback for any other unmatched routes
  { path: '*', element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <EmailConfirmationHandler />
        <RouterProvider router={router} />
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
