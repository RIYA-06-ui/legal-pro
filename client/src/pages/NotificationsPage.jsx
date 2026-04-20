import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  Clock, 
  FileText, 
  User, 
  AlertCircle, 
  CheckCircle,
  X,
  Filter,
  Search,
  Settings,
  Shield,
  Upload,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'document',
      category: 'analysis',
      title: 'Document Analysis Complete',
      message: 'Contract_Review_v2.pdf has been successfully analyzed. 3 potential risks identified.',
      time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      priority: 'medium',
      actionUrl: '/documents'
    },
    {
      id: 2,
      type: 'alert',
      category: 'security',
      title: 'High Risk Clauses Detected',
      message: 'Legal_Agreement_Draft.pdf contains potentially harmful clauses that require immediate attention.',
      time: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      read: false,
      icon: Shield,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-500 to-pink-600',
      priority: 'high',
      actionUrl: '/dashboard'
    },
    {
      id: 3,
      type: 'upload',
      category: 'document',
      title: 'Document Upload Successful',
      message: 'Privacy_Policy_v3.pdf has been uploaded and is now being processed.',
      time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      read: false,
      icon: Upload,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      priority: 'low',
      actionUrl: '/upload'
    },
    {
      id: 4,
      type: 'user',
      category: 'team',
      title: 'Team Member Added',
      message: 'Emma Wilson has been added to your LegalPro team with Editor permissions.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      icon: User,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      priority: 'medium',
      actionUrl: '/team'
    },
    {
      id: 5,
      type: 'system',
      category: 'benchmark',
      title: 'Fairness Benchmark Completed',
      message: 'Your document analysis has achieved a 94% fairness score based on latest evaluation.',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      icon: TrendingUp,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      priority: 'medium',
      actionUrl: '/benchmark'
    },
    {
      id: 6,
      type: 'alert',
      category: 'quota',
      title: 'API Usage Warning',
      message: 'You have used 85% of your monthly API quota. Consider upgrading your plan.',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      icon: AlertTriangle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      priority: 'medium',
      actionUrl: '/settings'
    },
    {
      id: 7,
      type: 'system',
      category: 'maintenance',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance window: Tomorrow 2:00-4:00 AM EST. Services may be temporarily unavailable.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: Settings,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-gray-500 to-gray-700',
      priority: 'low',
      actionUrl: null
    }
  ]);

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Dismiss notification
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Format time relative to now
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'high' && notification.priority === 'high') ||
      (filter === notification.type) ||
      (filter === notification.category);
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              {highPriorityCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  {highPriorityCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with your recent activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </span>
              )}
              {highPriorityCount > 0 && (
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{highPriorityCount} urgent</span>
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'high', label: 'Urgent', count: highPriorityCount },
              { key: 'document', label: 'Documents', count: notifications.filter(n => n.type === 'document').length },
              { key: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
              { key: 'user', label: 'Team', count: notifications.filter(n => n.type === 'user').length },
              { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
            ].map((filterType) => (
              <button
                key={filterType.key}
                onClick={() => setFilter(filterType.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  filter === filterType.key
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{filterType.label}</span>
                {filterType.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === filterType.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {filterType.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Notifications</h2>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search query' : 'You\'re all caught up! Check back later for updates'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`relative p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
                    !notification.read 
                      ? `border-l-4 ${getPriorityColor(notification.priority)} backdrop-blur-sm` 
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`relative p-3 rounded-xl ${notification.bgColor} shadow-lg`}>
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                      {notification.priority === 'high' && !notification.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-lg leading-tight ${
                              !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            {notification.priority === 'high' && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>URGENT</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(notification.time)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                              <div className={`w-2 h-2 rounded-full ${
                                notification.priority === 'high' ? 'bg-red-500' :
                                notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="capitalize">{notification.priority} priority</span>
                            </div>
                            {notification.category && (
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg font-medium capitalize">
                                  {notification.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notification.actionUrl && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium transition-colors"
                            >
                              View
                            </motion.button>
                          )}
                          {!notification.read && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dismissNotification(notification.id)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;