import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from './Dashboard';
import DocumentsPage from './DocumentsPage';
import SummaryPage from './SummaryPage';
import ChatPage from './ChatPage';
import SettingsPage from './SettingsPage';
import TeamPage from './TeamPage';
import NotificationsPage from './NotificationsPage';
import BenchmarkPage from './BenchmarkPage';
import UploadPage from './UploadPage';

export default function DashboardPage() {
  const location = useLocation();
  
  // Determine which component to render based on the current path
  const renderDashboardContent = () => {
    const path = location.pathname;
    
    if (path === '/dashboard/analysis') {
      return <UploadPage />;
    } else if (path === '/dashboard/documents') {
      return <DocumentsPage />;
    } else if (path === '/dashboard/summary') {
      return <SummaryPage />;
    } else if (path === '/dashboard/benchmark') {
      return <BenchmarkPage />;
    } else if (path === '/dashboard/chat') {
      return <ChatPage />;
    } else if (path === '/dashboard/settings') {
      return <SettingsPage />;
    } else if (path === '/dashboard/team') {
      return <TeamPage />;
    } else if (path === '/dashboard/notifications') {
      return <NotificationsPage />;
    } else {
      // Default dashboard view
      return <Dashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}
