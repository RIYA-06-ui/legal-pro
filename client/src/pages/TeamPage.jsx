import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  MoreVertical, 
  Shield, 
  Crown, 
  Search,
  Filter,
  Settings,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  Eye,
  Star,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Globe,
  Briefcase
} from 'lucide-react';

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Admin',
      department: 'Legal',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      joinDate: '2024-01-15',
      lastActive: '2 minutes ago',
      location: 'New York, USA',
      phone: '+1 (555) 123-4567',
      documentsReviewed: 45,
      permissions: ['read', 'write', 'admin', 'delete'],
      bio: 'Senior legal advisor with 8+ years of experience in contract management and compliance.',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Legal Reviewer',
      department: 'Legal',
      avatar: '/api/placeholder/40/40',
      status: 'away',
      joinDate: '2024-02-01',
      lastActive: '1 hour ago',
      location: 'San Francisco, USA',
      phone: '+1 (555) 234-5678',
      documentsReviewed: 32,
      permissions: ['read', 'write'],
      bio: 'Contract specialist focusing on technology and intellectual property agreements.',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      role: 'Document Manager',
      department: 'Operations',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      joinDate: '2024-02-15',
      lastActive: 'Just now',
      location: 'London, UK',
      phone: '+44 20 7123 4567',
      documentsReviewed: 28,
      permissions: ['read', 'write'],
      bio: 'Document management expert with expertise in workflow optimization and compliance.',
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.rodriguez@company.com',
      role: 'Compliance Officer',
      department: 'Compliance',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
      joinDate: '2024-01-20',
      lastActive: '3 days ago',
      location: 'Madrid, Spain',
      phone: '+34 91 123 4567',
      documentsReviewed: 67,
      permissions: ['read', 'write', 'audit'],
      bio: 'Regulatory compliance specialist with focus on international business law.',
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      role: 'Legal Analyst',
      department: 'Legal',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      joinDate: '2024-03-01',
      lastActive: '15 minutes ago',
      location: 'Seoul, South Korea',
      phone: '+82 2 123 4567',
      documentsReviewed: 19,
      permissions: ['read'],
      bio: 'Junior legal analyst specializing in contract analysis and risk assessment.',
    },
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Legal Reviewer':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'Document Manager':
        return <Briefcase className="w-4 h-4 text-green-500" />;
      case 'Compliance Officer':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'Legal Analyst':
        return <Activity className="w-4 h-4 text-orange-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'online') return matchesSearch && member.status === 'online';
    if (selectedFilter === 'offline') return matchesSearch && member.status === 'offline';
    if (selectedFilter === 'admin') return matchesSearch && member.role === 'Admin';
    
    return matchesSearch;
  });

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage team members, roles, and permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{teamMembers.length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Online Now</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {teamMembers.filter(m => m.status === 'online').length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active members</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admins</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {teamMembers.filter(m => m.role === 'Admin').length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Full access</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documents Reviewed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {teamMembers.reduce((sum, m) => sum + m.documentsReviewed, 0)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Members</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredMembers.length} of {teamMembers.length} members
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleIcon(member.role)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle email action
                    }}
                  >
                    <Mail className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more options
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{member.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last active: {member.lastActive}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.documentsReviewed}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Documents</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.permissions.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Permissions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{getStatusText(member.status)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'Get started by inviting your first team member.'}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Member</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-xl">
                          {selectedMember.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(selectedMember.status)}`}></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMember.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRoleIcon(selectedMember.role)}
                        <span className="text-gray-600 dark:text-gray-400">{selectedMember.role}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400">{selectedMember.department}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white">{selectedMember.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white">{selectedMember.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-white">{selectedMember.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                        <p className="text-gray-900 dark:text-white">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">About</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMember.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Message</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedMember.status)}`}></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getStatusText(selectedMember.status)} • {selectedMember.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;