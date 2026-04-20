import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Upload,
  MessageSquare,
  Eye,
  Zap,
  CheckCircle,
  Clock,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { auth } from '../firebase/firebase';
import documentService from '../services/documentService';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-left hover:shadow-sm transition-all duration-200 w-full"
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </motion.button>
);

const ActivityItem = ({ title, description, time, status, icon: Icon }) => {
  const statusColors = {
    success: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    error: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${statusColors[status]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{time}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    processedToday: 0,
    pendingReview: 0,
    riskAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and activity
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const result = await documentService.getAll();
        if (result.success) {
          const documents = result.documents;
          
          // Calculate metrics
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const processedToday = documents.filter(doc => {
            const uploadDate = doc.uploadDate instanceof Date ? doc.uploadDate : new Date(doc.uploadDate);
            return uploadDate >= today;
          }).length;

          const pendingReview = documents.filter(doc => doc.status === 'processing').length;
          const riskAlerts = documents.filter(doc => 
            doc.analysis?.riskLevel?.toLowerCase() === 'high' ||
            doc.riskLevel?.toLowerCase() === 'high'
          ).length;

          setMetrics({
            totalDocuments: documents.length,
            processedToday,
            pendingReview,
            riskAlerts
          });

          // Generate comprehensive recent activity from documents
          const activity = [];
          
          documents
            .sort((a, b) => {
              const dateA = a.uploadDate instanceof Date ? a.uploadDate : new Date(a.uploadDate);
              const dateB = b.uploadDate instanceof Date ? b.uploadDate : new Date(b.uploadDate);
              return dateB - dateA;
            })
            .slice(0, 10)
            .forEach(doc => {
              const uploadDate = doc.uploadDate instanceof Date ? doc.uploadDate : new Date(doc.uploadDate);
              const timeDiff = Date.now() - uploadDate.getTime();
              
              const getTimeString = (timeDiff) => {
                const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutesAgo = Math.floor(timeDiff / (1000 * 60));
                
                if (hoursAgo > 24) {
                  return `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) > 1 ? 's' : ''} ago`;
                } else if (hoursAgo > 0) {
                  return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
                } else if (minutesAgo > 0) {
                  return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
                } else {
                  return 'Just now';
                }
              };

              const docName = doc.name || doc.fileName || doc.originalName || 'Untitled Document';
              const docType = doc.analysis?.documentType || 'Document';
              
              // 1. Document Upload Activity
              activity.push({
                title: "Document Uploaded",
                description: `${docName} uploaded for analysis`,
                time: getTimeString(timeDiff),
                status: "info",
                icon: Upload,
              });

              // 2. Analysis Summary Activity (if available)
              if (doc.analysis && doc.analysis.summary) {
                activity.push({
                  title: "Analysis Summary Generated",
                  description: `${docType}: ${doc.analysis.summary.substring(0, 80)}${doc.analysis.summary.length > 80 ? '...' : ''}`,
                  time: getTimeString(timeDiff - 30000), // Slightly after upload
                  status: "success",
                  icon: Brain,
                });
              }

              // 3. Market Benchmark Activity (if available)
              if (doc.fairnessBenchmark && doc.fairnessBenchmark.marketComparisons) {
                const benchmarkCount = doc.fairnessBenchmark.marketComparisons.length || 0;
                activity.push({
                  title: "Market Benchmark Complete",
                  description: `${docName}: ${benchmarkCount} market comparisons analyzed - ${doc.fairnessBenchmark.riskLevel || 'Unknown'} risk level`,
                  time: getTimeString(timeDiff - 60000), // After analysis
                  status: doc.fairnessBenchmark.riskLevel?.toLowerCase() === 'high' ? 'warning' : 
                         doc.fairnessBenchmark.riskLevel?.toLowerCase() === 'medium' ? 'info' : 'success',
                  icon: BarChart3,
                });
              }

              // 4. Risk Assessment Activity (if high risk detected)
              const riskLevel = doc.analysis?.riskLevel || doc.riskLevel || doc.fairnessBenchmark?.riskLevel;
              if (riskLevel && riskLevel.toLowerCase() === 'high') {
                activity.push({
                  title: "High Risk Alert",
                  description: `${docName}: High-risk clauses detected requiring attention`,
                  time: getTimeString(timeDiff - 45000),
                  status: "warning",
                  icon: AlertTriangle,
                });
              }

              // 5. Clause Analysis Activity (if clauses available)
              if (doc.analysis && doc.analysis.clauses && doc.analysis.clauses.length > 0) {
                const clauseCount = doc.analysis.clauses.length;
                activity.push({
                  title: "Clause Analysis Complete",
                  description: `${docName}: ${clauseCount} clause${clauseCount > 1 ? 's' : ''} analyzed and categorized`,
                  time: getTimeString(timeDiff - 75000),
                  status: "success",
                  icon: CheckCircle,
                });
              }

              // 6. Document Processing Complete Activity
              if (doc.status === 'analyzed' || doc.analysisCompleted) {
                activity.push({
                  title: "Document Processing Complete",
                  description: `${docName}: Full legal analysis completed successfully`,
                  time: getTimeString(timeDiff - 90000),
                  status: "success",
                  icon: Zap,
                });
              }
            });

          // Sort all activities by time and take the most recent 8
          const sortedActivity = activity
            .sort((a, b) => {
              // Extract time values for sorting (more recent first)
              const getTimeValue = (timeStr) => {
                if (timeStr === 'Just now') return 0;
                const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
                if (!match) return 0;
                const value = parseInt(match[1]);
                const unit = match[2];
                return unit === 'minute' ? value : unit === 'hour' ? value * 60 : value * 60 * 24;
              };
              return getTimeValue(a.time) - getTimeValue(b.time);
            })
            .slice(0, 8);

          setRecentActivity(sortedActivity);
        }
      } catch (error) {
        // Set default activity if loading fails
        setRecentActivity([
          {
            title: "Welcome to LegalPro",
            description: "Upload your first document to get started",
            time: "Now",
            status: "info",
            icon: FileText,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadDashboardData();
      } else {
        setRecentActivity([]);
        setMetrics({ totalDocuments: 0, processedToday: 0, pendingReview: 0, riskAlerts: 0 });
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const metricsData = [
    {
      title: "Total Documents",
      value: metrics.totalDocuments.toString(),
      change: metrics.totalDocuments > 0 ? "+12%" : null,
      changeType: "positive",
      icon: FileText,
      color: "bg-emerald-500",
    },
    {
      title: "Processed Today",
      value: metrics.processedToday.toString(),
      change: metrics.processedToday > 0 ? "+5%" : null,
      changeType: "positive",
      icon: Zap,
      color: "bg-teal-500",
    },
    {
      title: "Risk Alerts",
      value: metrics.riskAlerts.toString(),
      change: metrics.riskAlerts > 0 ? "-8%" : null,
      changeType: "positive",
      icon: AlertTriangle,
      color: "bg-amber-500",
    },
    {
      title: "Pending Review",
      value: metrics.pendingReview.toString(),
      change: metrics.pendingReview > 0 ? "+3%" : null,
      changeType: "positive",
      icon: Clock,
      color: "bg-cyan-500",
    },
  ];

  const quickActions = [
    {
      title: "Analyze Document",
      description: "Upload and analyze a new legal document",
      icon: Upload,
      color: "bg-emerald-500",
      onClick: () => navigate('/dashboard/analysis'),
    },
    {
      title: "AI Chat",
      description: "Ask questions about your documents",
      icon: MessageSquare,
      color: "bg-teal-500",
      onClick: () => navigate('/dashboard/chat'),
    },
    {
      title: "View Documents",
      description: "Manage your uploaded documents",
      icon: FileText,
      color: "bg-cyan-500",
      onClick: () => navigate('/dashboard/documents'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your legal document overview.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/analysis')}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <button 
                  onClick={() => navigate('/dashboard/documents')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>
            </div>
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading activity...</span>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity. Upload your first document to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Overview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Document Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.totalDocuments}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{metrics.processedToday}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processed Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{metrics.pendingReview}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
