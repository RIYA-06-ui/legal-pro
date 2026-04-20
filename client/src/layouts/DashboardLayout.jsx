import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  
  // Pages that need full height without padding
  const fullHeightPages = [
    '/dashboard/chat', 
    '/dashboard/team', 
    '/dashboard/benchmark', 
    '/dashboard/documents', 
    '/dashboard/summary',
    '/dashboard/settings',
    '/dashboard/notifications'
  ];
  const isFullHeightPage = fullHeightPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <DashboardNavbar />
      <main className="ml-64 pt-16 transition-all duration-300 ease-in-out">
        {isFullHeightPage ? (
          // For modern pages, render without padding and use full height
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            {children}
          </motion.div>
        ) : (
          // For other pages, use the original layout with padding
          <div className="h-screen" style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;