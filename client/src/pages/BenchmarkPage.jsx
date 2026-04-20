import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  MapPin,
  FileText,
  Users,
  Target,
  Shield,
  Upload,
  Search,
  Clock,
  User,
  Download,
  Eye,
  RefreshCw,
  Loader,
  Zap,
  Award,
  Filter,
  Settings,
  Plus,
  ArrowRight,
  Star,
  Briefcase,
  Globe,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  TrendingDown,
  X,
  ChevronRight,
  Lightbulb,
  Scale
} from 'lucide-react';
import documentService from '../services/documentService';
import benchmarkService from '../services/benchmarkService';

// Mock benchmark data for demonstration
const mockBenchmarkData = {
  totalContracts: 15420,
  jurisdictions: 23,
  lastUpdated: '2025-09-21',
  popularComparisons: [
    {
      type: 'Rental Agreement',
      count: 8930,
      jurisdiction: 'Maharashtra',
      keyMetrics: {
        securityDeposit: { median: 2, percentile90: 3, unit: 'months' },
        rentIncrease: { median: 5, percentile90: 8, unit: 'percent' },
        noticePeriod: { median: 30, percentile90: 60, unit: 'days' }
      }
    },
    {
      type: 'Employment Contract',
      count: 4200,
      jurisdiction: 'Karnataka',
      keyMetrics: {
        noticePeriod: { median: 30, percentile90: 90, unit: 'days' },
        probationPeriod: { median: 6, percentile90: 12, unit: 'months' },
        nonCompete: { median: 12, percentile90: 24, unit: 'months' }
      }
    },
    {
      type: 'Service Agreement',
      count: 2290,
      jurisdiction: 'Delhi',
      keyMetrics: {
        paymentTerms: { median: 30, percentile90: 45, unit: 'days' },
        terminationNotice: { median: 15, percentile90: 30, unit: 'days' },
        penaltyClause: { median: 5, percentile90: 10, unit: 'percent' }
      }
    }
  ],
  recentInsights: [
    {
      type: 'CAUTION',
      message: 'Security deposits above 3 months are becoming increasingly rare in Mumbai rental agreements.',
      percentage: 95,
      trend: 'decreasing'
    },
    {
      type: 'HIGH-RISK',
      message: 'Tenant-paid maintenance clauses appear in less than 2% of Maharashtra agreements.',
      percentage: 2,
      trend: 'stable'
    },
    {
      type: 'STANDARD',
      message: '5% annual rent increases are the market standard across major Indian cities.',
      percentage: 78,
      trend: 'stable'
    }
  ]
};

const BenchmarkCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
    <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-2">{title}</h4>
  </motion.div>
);

const DocumentCard = ({ document, onSelect, isSelected, onAnalyze, isAnalyzing }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
      isSelected 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}
    onClick={() => onSelect(document)}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {document.fileName || document.originalName}
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{document.selectedRole || 'User'}</span>
          </div>
          {document.riskLevel && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              document.riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
              document.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            }`}>
              {document.riskLevel?.toUpperCase()} RISK
            </span>
          )}
        </div>
      </div>
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(document);
          }}
          disabled={isAnalyzing}
          className="ml-4 px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isAnalyzing ? (
            <>
              <Loader className="w-3 h-3 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="w-3 h-3" />
              Analyze Fairness
            </>
          )}
        </button>
      )}
    </div>
  </motion.div>
);

const FairnessResultCard = ({ analysis }) => {
  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Handle both riskLevel (SimpleFairnessService) and marketPosition (full service)
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'above_average': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'average': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'below_average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'concerning': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Support both data formats
  const displayText = analysis.marketPosition ? 
    analysis.marketPosition.replace('_', ' ').toUpperCase() : 
    (analysis.riskLevel || 'UNKNOWN').toUpperCase();
  
  const positionColorClass = analysis.marketPosition ? 
    getPositionColor(analysis.marketPosition) : 
    getRiskLevelColor(analysis.riskLevel);

  const assessmentText = analysis.overallAssessment || analysis.summary || 'Analysis completed successfully.';
  const findings = analysis.keyFindings || analysis.keyIssues || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-2xl border-0 overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent dark:from-blue-900/20 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent dark:from-purple-900/20 rounded-full -ml-12 -mb-12"></div>
      
      {/* Header with medium score display */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
          ⚖️ Fairness Analysis Results
        </h3>
        
        {/* Medium Score Card */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="relative">
            <div className={`text-3xl font-bold ${getScoreColor(analysis.overallFairnessScore)} drop-shadow-lg`}>
              {analysis.overallFairnessScore}
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
              out of 100
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md ${positionColorClass} border border-white/50`}>
              {displayText} RISK
            </span>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Overall Assessment
            </div>
          </div>
        </div>
      </div>

      {/* Summary with medium styling */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          📋 Executive Summary
        </h4>
        <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
          {assessmentText}
        </p>
      </div>

      {/* Market Comparisons - Main Feature */}
      {analysis.marketComparisons && analysis.marketComparisons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            📊 Contract vs Market Standards
          </h4>
          <div className="space-y-4">
            {analysis.marketComparisons.map((comparison, index) => {
              const getAssessmentColor = (assessment) => {
                switch (assessment?.toLowerCase()) {
                  case 'favorable': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-300';
                  case 'standard': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-300';
                  case 'unfavorable': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-300';
                  default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-300';
                }
              };
              
              return (
                <div key={index} className="group hover:scale-[1.01] transition-all duration-200">
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {comparison.clause}
                      </h5>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getAssessmentColor(comparison.assessment)}`}>
                        {comparison.assessment}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Your Contract</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{comparison.contractValue}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Market Standard</div>
                        <div className="text-sm font-bold text-blue-800 dark:text-blue-200">{comparison.marketStandard}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <span className="font-medium">Analysis:</span> {comparison.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Findings - support both keyFindings and keyIssues */}
      {findings && findings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            🔍 Key Findings
          </h4>
          <div className="grid gap-3">
            {findings.slice(0, 3).map((finding, index) => {
              // Handle both full findings objects and simple strings from SimpleFairnessService
              const findingText = typeof finding === 'string' ? finding : finding.explanation;
              const riskLevel = typeof finding === 'string' ? 'CAUTION' : finding.riskLevel;
              
              return (
                <div key={index} className="group hover:scale-[1.01] transition-all duration-200">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-400 shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                        {riskLevel === 'HIGH_RISK' && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                        {riskLevel === 'CAUTION' && <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                        {riskLevel === 'STANDARD' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                            riskLevel === 'HIGH_RISK' ? 'bg-red-500 text-white' :
                            riskLevel === 'CAUTION' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            ⚠️ {riskLevel}
                          </span>
                          {finding.percentile && (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              {finding.percentile}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 mb-2">
                          {findingText}
                        </p>
                        {finding.recommendation && (
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 flex items-start gap-1">
                              💡 <span>{finding.recommendation}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Benchmark Metrics */}
      {analysis.benchmarkMetrics && Object.keys(analysis.benchmarkMetrics).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            📊 Market Benchmarks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.benchmarkMetrics).map(([key, metric]) => (
              <div key={key} className="group hover:scale-[1.01] transition-all duration-200">
                <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700 shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-md font-semibold text-indigo-900 dark:text-indigo-100 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
                      metric.assessment?.includes('HIGH_RISK') ? 'bg-red-500 text-white' :
                      metric.assessment?.includes('CAUTION') ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {metric.percentile || 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-indigo-800 dark:text-indigo-200">
                    <div className="flex justify-between">
                      <span>Your contract:</span> 
                      <span className="font-semibold">{metric.contractValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market standard:</span> 
                      <span className="font-semibold">{metric.marketMedian}</span>
                    </div>
                    {metric.marketRange && (
                      <div className="flex justify-between">
                        <span>Typical range:</span> 
                        <span className="font-semibold">{metric.marketRange}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positive Aspects - only for SimpleFairnessService */}
      {analysis.positives && analysis.positives.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            ✨ Positive Aspects
          </h4>
          <div className="grid gap-3">
            {analysis.positives.map((positive, index) => (
              <div key={index} className="group hover:scale-[1.01] transition-all duration-200">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-400 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                      {positive}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negotiation Opportunities */}
      {analysis.negotiationOpportunities && analysis.negotiationOpportunities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            🎯 Negotiation Opportunities
          </h4>
          <div className="space-y-4">
            {analysis.negotiationOpportunities.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="group hover:scale-[1.01] transition-all duration-200">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-400 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0 p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        opportunity.priority === 'high' ? 'bg-red-500 text-white' :
                        opportunity.priority === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        🚀 {opportunity.priority?.toUpperCase()} PRIORITY
                      </span>
                      {opportunity.likelihood && (
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                          {opportunity.likelihood} likelihood
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Term:</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{opportunity.currentTerm}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-600">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Suggested Improvement:</p>
                      <p className="text-sm text-green-800 dark:text-green-200">{opportunity.suggestedTerm}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-600">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 flex items-start gap-1">
                      💡 <span>{opportunity.justification}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const InsightCard = ({ insight }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'HIGH-RISK':
        return { icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-800 dark:text-red-300' };
      case 'CAUTION':
        return { icon: Info, color: 'yellow', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-800 dark:text-yellow-300' };
      case 'STANDARD':
        return { icon: CheckCircle, color: 'green', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-800 dark:text-green-300' };
      default:
        return { icon: Info, color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-800 dark:text-blue-300' };
    }
  };

  const { icon: Icon, bgColor, textColor } = getIconAndColor(insight.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${bgColor}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${textColor}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${textColor} bg-white dark:bg-gray-800 border`}>
              {insight.type}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {insight.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonCard = ({ comparison }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{comparison.type}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{comparison.jurisdiction}</span>
          <span>•</span>
          <span>{comparison.count.toLocaleString()} contracts</span>
        </div>
      </div>
      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
    </div>

    <div className="space-y-3">
      {Object.entries(comparison.keyMetrics).map(([key, metric]) => (
        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Median: {metric.median} {metric.unit}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              90th percentile: {metric.percentile90} {metric.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function BenchmarkPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('India');
  const [selectedContractType, setSelectedContractType] = useState('All');
  const [selectedUserRole, setSelectedUserRole] = useState('Consumer');
  const [activeTab, setActiveTab] = useState('analyze');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Document management state
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fairnessAnalysis, setFairnessAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Load user documents on component mount
  useEffect(() => {
    loadUserDocuments();
  }, []);

  const loadUserDocuments = async () => {
    if (!documentService.isAuthenticated()) {
      return;
    }

    setLoadingDocuments(true);
    try {
      const result = await documentService.getAll();
      if (result.success) {
        setDocuments(result.documents);
      }
    } catch (error) {
      setAnalysisError(`Failed to load documents: ${error.message}`);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setAnalysisError(null);

    try {
      const result = await benchmarkService.uploadAndAnalyzeFairness(
        file,
        selectedUserRole,
        selectedJurisdiction
      );

      if (result.success) {
        // Refresh documents list
        await loadUserDocuments();
        
        // Set the fairness analysis result
        if (result.fairnessBenchmark) {
          setFairnessAnalysis(result.fairnessBenchmark);
        }
        
        // Select the newly uploaded document
        const newDoc = {
          id: result.documentId,
          fileName: result.fileName,
          uploadDate: new Date(),
          selectedRole: selectedUserRole,
          riskLevel: result.analysis?.riskLevel || 'unknown'
        };
        setSelectedDocument(newDoc);
      }
    } catch (error) {
      setAnalysisError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleAnalyzeDocument = async (document) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFairnessAnalysis(null);

    try {
      const result = await benchmarkService.analyzeFairnessById(
        document.id,
        selectedJurisdiction
      );

      if (result.success && result.fairnessAnalysis) {
        setFairnessAnalysis(result.fairnessAnalysis);
      } else if (result.needsReupload) {
        setAnalysisError(`${result.error} ${result.suggestion || ''}`);
      } else {
        setAnalysisError(result.error || 'Analysis failed');
      }
    } catch (error) {
      setAnalysisError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Market Benchmark</h1>
                <p className="text-gray-600 dark:text-gray-400">Compare contracts and get negotiation insights</p>
              </div>
            </div>
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
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'analyze', label: 'Analyze Document', icon: FileText },
              { id: 'insights', label: 'Market Insights', icon: Lightbulb },
              { id: 'comparisons', label: 'Popular Comparisons', icon: Scale },
              { id: 'statistics', label: 'Statistics', icon: PieChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documents Analyzed</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{documents.length}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Your portfolio</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Database</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{mockBenchmarkData.totalContracts.toLocaleString()}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Contracts analyzed</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jurisdictions</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{mockBenchmarkData.jurisdictions}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">States covered</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">Today</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Real-time data</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Document Analysis Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Document Fairness Analysis</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Upload or select a document to analyze against market standards</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI-Powered</span>
                  </div>
                </div>
                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Role
                    </label>
                    <select
                      value={selectedUserRole}
                      onChange={(e) => setSelectedUserRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Consumer">Consumer</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Employee">Employee</option>
                      <option value="Client">Client</option>
                      <option value="Buyer">Buyer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jurisdiction
                    </label>
                    <select
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="India">India</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contract Type
                    </label>
                    <select
                      value={selectedContractType}
                      onChange={(e) => setSelectedContractType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Contract Types</option>
                      <option value="Rental Agreement">Rental Agreement</option>
                      <option value="Employment Contract">Employment Contract</option>
                      <option value="Service Agreement">Service Agreement</option>
                      <option value="Vendor Agreement">Vendor Agreement</option>
                    </select>
                  </div>
                </div>

                {/* Document Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Select Document to Analyze</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={loadUserDocuments}
                        disabled={loadingDocuments}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingDocuments ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload New</span>
                      </button>
                    </div>
                  </div>

                  {loadingDocuments ? (
                    <div className="text-center py-12">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600 dark:text-gray-400">Loading your documents...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Upload your first document to get started with market analysis!</p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Document</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                      {documents.map((document) => (
                        <DocumentCard
                          key={document.id}
                          document={document}
                          isSelected={selectedDocument?.id === document.id}
                          onSelect={setSelectedDocument}
                          onAnalyze={handleAnalyzeDocument}
                          isAnalyzing={isAnalyzing && selectedDocument?.id === document.id}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {analysisError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Analysis Error</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">{analysisError}</p>
                  </motion.div>
                )}

                {/* Analysis Results */}
                {fairnessAnalysis && (
                  <FairnessResultCard analysis={fairnessAnalysis} />
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Latest Market Insights</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time trends and patterns from contract analysis</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Updated daily</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockBenchmarkData.recentInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <InsightCard insight={insight} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'comparisons' && (
            <motion.div
              key="comparisons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Contract Comparisons</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Most analyzed contract types and their market benchmarks</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Community driven</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockBenchmarkData.popularComparisons.map((comparison, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ComparisonCard comparison={comparison} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'statistics' && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BenchmarkCard
                  title="Total Contracts Analyzed"
                  value={mockBenchmarkData.totalContracts.toLocaleString()}
                  subtitle="Across all jurisdictions"
                  icon={FileText}
                  color="blue"
                />
                <BenchmarkCard
                  title="Jurisdictions Covered"
                  value={mockBenchmarkData.jurisdictions}
                  subtitle="States and territories"
                  icon={MapPin}
                  color="green"
                />
                <BenchmarkCard
                  title="Last Updated"
                  value="Today"
                  subtitle={`${mockBenchmarkData.lastUpdated}`}
                  icon={TrendingUp}
                  color="purple"
                />
              </div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>How Market Fairness Benchmark Works</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Select or Upload Contract</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose from your existing documents or upload a new contract for analysis.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI-Powered Fairness Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our AI compares your terms against thousands of similar contracts in your jurisdiction.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Get Negotiation Leverage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive specific insights and talking points to negotiate better terms.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Contract</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors mx-auto w-fit">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 25MB)
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}