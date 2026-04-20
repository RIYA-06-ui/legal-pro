import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, ArrowRight, FileText, Zap, Users, Award, Github, Twitter, Linkedin, Star, CheckCircle, Brain, Lock, Clock, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          
          {/* Gradient Orbs - Enhanced for light theme */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/25 to-orange-400/25 dark:from-yellow-600/10 dark:to-orange-600/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-800 rounded-full px-4 py-2 shadow-sm"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI-Powered Legal Analysis</span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                  Smart
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Contract
                  </span>
                  <br />
                  Analysis.
                  <br />
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Smarter Decisions.
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
              >
                Transform complex legal documents into clear, actionable insights with our AI-powered analysis platform. Get instant risk assessments, role-specific guidance, and intelligent contract reviews.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/dashboard/analysis')}
                  className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-emerald-200 dark:border-teal-700 hover:border-emerald-400 dark:hover:border-teal-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Watch Demo</span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>5 Minute Setup</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Modern Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Modern Dashboard Container */}
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden backdrop-blur-xl hover:shadow-3xl transition-shadow duration-300">
                {/* Modern Browser Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          LexiGuard Analytics
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Real-time</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8">
                  {/* Header Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Contract Risk Assessment
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Master Service Agreement • Updated 2 min ago
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                        99.7% Confidence
                      </div>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Modern Risk Cards */}
                  <div className="grid grid-cols-3 gap-6">
                    <motion.div
                      className="relative group"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-red-200 dark:border-red-900/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">4</div>
                            <div className="text-xs text-red-500 dark:text-red-400 font-medium">Critical</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">High Risk Issues</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Liability & Indemnification</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="relative group"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-900/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">8</div>
                            <div className="text-xs text-yellow-500 dark:text-yellow-400 font-medium">Review</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Medium Risk</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Payment & Termination</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="relative group"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-green-200 dark:border-green-900/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">15</div>
                            <div className="text-xs text-green-500 dark:text-green-400 font-medium">Approved</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Low Risk</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Standard Clauses</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* AI Insights Panel */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                              AI Legal Recommendation
                            </h4>
                            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                              Priority
                            </div>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3 leading-relaxed">
                            Consider adding liability caps of $1M to limit financial exposure. Current indemnification clause may create unlimited liability risk.
                          </p>
                          <div className="flex items-center space-x-4">
                            <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                              Apply Suggestion
                            </button>
                            <button className="px-3 py-1.5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Analytics */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Analysis Progress</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">96%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: "96%" }}
                            transition={{ duration: 2.5, delay: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-sm"></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Estimated completion: 30 seconds
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Risk Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Medium</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full w-full relative">
                            <motion.div
                              className="absolute top-0 w-3 h-3 bg-white border-2 border-yellow-500 rounded-full shadow-lg transform -translate-y-0.5"
                              initial={{ left: "0%" }}
                              animate={{ left: "58%" }}
                              transition={{ duration: 2, delay: 2 }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">6.2/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Built for Modern
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Legal Teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools designed to streamline your legal workflow, from document analysis to team collaboration
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* AI Analysis */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.7%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Advanced natural language processing identifies risks, extracts key terms, and provides intelligent recommendations for every contract clause.
                </p>
                <div className="space-y-3">
                  {[
                    "Clause-by-clause risk assessment",
                    "Automated compliance checking",
                    "Intelligent term extraction",
                    "Multi-language support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">SOC 2</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Certified</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Military-grade encryption and comprehensive security controls protect your most sensitive legal documents and client information.
                </p>
                <div className="space-y-3">
                  {[
                    "AES-256 end-to-end encryption",
                    "Zero-trust security architecture",
                    "GDPR & HIPAA compliance",
                    "Advanced threat protection"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">&lt;2s</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Processing</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lightning Performance</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Cloud-native architecture delivers instant results, enabling real-time collaboration and immediate insights for time-critical decisions.
                </p>
                <div className="space-y-3">
                  {[
                    "Sub-second document processing",
                    "Real-time collaborative editing",
                    "Instant search & filtering",
                    "99.9% uptime guarantee"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Features */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Legal Workflow</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Integrated tools that work together seamlessly to support every aspect of your legal operations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive insights and reporting", color: "from-blue-500 to-cyan-500" },
                { icon: MessageSquare, title: "AI Chat Assistant", desc: "Natural language document queries", color: "from-green-500 to-emerald-500" },
                { icon: Users, title: "Team Collaboration", desc: "Real-time sharing and comments", color: "from-purple-500 to-pink-500" },
                { icon: Award, title: "Compliance Suite", desc: "Automated regulatory checking", color: "from-orange-500 to-red-500" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="group text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/70 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/70 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-full px-4 py-2 mb-6 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Proven Results</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Trusted by Legal Teams
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Around the World
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of legal professionals who rely on LexiGuard for mission-critical document analysis and contract review
            </p>
          </motion.div>

          {/* Main Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                number: "500K+",
                label: "Documents Processed",
                sublabel: "This quarter",
                color: "from-blue-600 to-indigo-600",
                bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
                icon: FileText
              },
              {
                number: "99.8%",
                label: "Accuracy Rate",
                sublabel: "Third-party verified",
                color: "from-emerald-600 to-teal-600",
                bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
                icon: CheckCircle
              },
              {
                number: "25K+",
                label: "Legal Professionals",
                sublabel: "Active monthly users",
                color: "from-purple-600 to-pink-600",
                bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
                icon: Users
              },
              {
                number: "1.2s",
                label: "Average Processing",
                sublabel: "Per document",
                color: "from-orange-600 to-red-600",
                bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
                icon: Clock
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 group-hover:-translate-y-2 hover:border-gray-300 dark:hover:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Customer Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Loved by Legal Teams
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how leading legal professionals are transforming their workflows with LexiGuard's AI-powered platform
            </p>
          </motion.div>

          {/* Featured Testimonial */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700 mb-16 hover:shadow-3xl transition-shadow duration-300"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-8 leading-relaxed">
                "LexiGuard has revolutionized our contract review process. We've reduced review time by 75% while improving accuracy. The AI insights are remarkably sophisticated and catch nuances that even experienced lawyers might miss."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl mr-6 shadow-lg">
                  SC
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Sarah Chen</h4>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">General Counsel</p>
                  <p className="text-gray-500 dark:text-gray-500">TechCorp Inc. • Fortune 500</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {[
              {
                name: "Michael Rodriguez",
                role: "Senior Partner",
                company: "Rodriguez & Associates",
                content: "The platform's ability to identify potential risks and suggest improvements has been game-changing. Our clients are impressed with the speed and thoroughness of our contract reviews.",
                rating: 5,
                avatar: "MR",
                metric: "85% faster reviews",
                color: "from-emerald-600 to-teal-600"
              },
              {
                name: "Lisa Thompson",
                role: "Compliance Director",
                company: "Global Finance Ltd.",
                content: "Security was our primary concern when evaluating AI tools. LexiGuard's enterprise-grade security and compliance certifications gave us complete confidence in the platform.",
                rating: 5,
                avatar: "LT",
                metric: "100% compliance rate",
                color: "from-purple-600 to-pink-600"
              },
              {
                name: "James Wilson",
                role: "Legal Operations Manager",
                company: "Innovation Labs",
                content: "The collaborative features have transformed how our distributed legal team works together. Real-time document sharing and AI-powered insights keep everyone aligned.",
                rating: 5,
                avatar: "JW",
                metric: "50% better collaboration",
                color: "from-orange-600 to-red-600"
              },
              {
                name: "Amanda Foster",
                role: "Chief Legal Officer",
                company: "HealthTech Solutions",
                content: "LexiGuard's multi-language support and regulatory compliance features are essential for our global operations. The platform scales beautifully with our growing business.",
                rating: 5,
                avatar: "AF",
                metric: "12 countries supported",
                color: "from-cyan-600 to-blue-600"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-5 rounded-3xl blur-xl group-hover:opacity-10 transition-all duration-500`}></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className={`px-3 py-1 bg-gradient-to-r ${testimonial.color} text-white text-sm font-medium rounded-full`}>
                      {testimonial.metric}
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">{testimonial.role}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Banner */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-600 dark:to-indigo-600 rounded-3xl p-8 text-center text-gray-900 dark:text-white shadow-2xl border border-blue-200 dark:border-blue-500/20 relative overflow-hidden"
          >
            {/* Background Pattern for Enhanced Visual Appeal */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(59,130,246,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 dark:opacity-30"></div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Join the Legal Innovation Movement</h3>
              <p className="text-gray-700 dark:text-blue-100 mb-8 text-lg leading-relaxed">
                Over 25,000 legal professionals trust LexiGuard to streamline their contract analysis and improve decision-making
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "4.9/5", label: "Average Rating" },
                  { number: "98%", label: "Customer Satisfaction" },
                  { number: "500+", label: "Law Firms" },
                  { number: "50+", label: "Countries" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center group"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-100 transition-colors duration-200">
                      {stat.number}
                    </div>
                    <div className="text-gray-500 dark:text-blue-200 text-sm font-medium group-hover:text-blue-800 dark:group-hover:text-blue-100 transition-colors duration-200">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 dark:opacity-20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-500/20 border border-blue-300/60 dark:border-blue-400/30 rounded-full px-6 py-3 mb-8 shadow-sm backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-700 dark:text-blue-200 font-medium">Ready to Get Started?</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Legal Operations
              </span>
              <br />
              Today
            </h2>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join 25,000+ legal professionals who trust LexiGuard to analyze contracts, identify risks, 
              and accelerate decision-making with enterprise-grade AI technology.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <motion.button
                onClick={() => navigate('/signup')}
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden min-w-[280px]"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/dashboard/analysis')}
                className="group px-12 py-5 bg-white/90 dark:bg-white/10 backdrop-blur-sm border-2 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-2xl font-bold text-xl hover:bg-white dark:hover:bg-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 min-w-[280px] shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Watch Live Demo</span>
                </div>
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  icon: CheckCircle,
                  title: "No Credit Card Required",
                  desc: "Start your 14-day free trial instantly"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  desc: "SOC 2 Type II certified platform"
                },
                {
                  icon: Users,
                  title: "Expert Support",
                  desc: "Dedicated customer success team"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-gray-200/60 dark:border-white/30 shadow-lg">
                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-12 text-gray-600 dark:text-gray-400"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">25K+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500K+</div>
                <div className="text-sm">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99.8%</div>
                <div className="text-sm">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm">Countries</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};



export default LandingPage;

