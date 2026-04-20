import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, AlertTriangle, Info, CheckCircle, FileText } from 'lucide-react';

const riskColor = (risk) => {
  if (risk === 'high') return 'bg-red-500';
  if (risk === 'medium') return 'bg-yellow-500';
  return 'bg-green-500';
};

const riskIcon = (risk) => {
  if (risk === 'high') return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
  if (risk === 'medium') return <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
  return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
};

const riskBadgeColor = (risk) => {
  if (risk === 'high') return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
  if (risk === 'medium') return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
  return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
};

// Helper function to determine risk level from clause content
const determineRisk = (clause) => {
  const lowRiskKeywords = ['standard', 'normal', 'typical', 'reasonable', 'fair'];
  const highRiskKeywords = ['penalty', 'forfeit', 'terminate', 'breach', 'void', 'liable', 'damages', 'sue', 'legal action'];
  
  const clauseText = clause.toLowerCase();
  
  if (highRiskKeywords.some(keyword => clauseText.includes(keyword))) {
    return 'high';
  }
  if (lowRiskKeywords.some(keyword => clauseText.includes(keyword))) {
    return 'low';
  }
  return 'medium';
};

export default function ClauseList({ clauses = [], selectedId, onSelect, isAnalysisView = false }) {
  const [expandedClauses, setExpandedClauses] = useState(new Set());

  // Debug: log the incoming clauses to see their structure

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedClauses);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedClauses(newExpanded);
  };

  // Transform clauses array into structured format if needed
  const structuredClauses = clauses.map((clause, index) => {
    // If clause is already structured (has id, text, etc.) - use the AI-provided riskLevel
    if (typeof clause === 'object' && clause.id !== undefined) {
      return {
        ...clause,
        risk: clause.riskLevel || clause.risk || 'medium', // Use AI-provided riskLevel
      };
    }
    
    // If clause is a simple string, transform it using fallback risk determination
    const clauseText = typeof clause === 'string' ? clause : clause.text || '';
    const risk = determineRisk(clauseText);
    
    return {
      id: `clause-${index}`,
      text: clauseText,
      risk: risk,
      type: 'general',
      explanation: `This clause requires ${risk} attention based on its content and potential legal implications.`,
      suggestions: risk === 'high' 
        ? ['Consider legal review', 'Negotiate terms if possible', 'Understand implications before signing']
        : risk === 'medium'
        ? ['Review carefully', 'Consider implications']
        : ['Standard clause', 'Generally acceptable terms']
    };
  });

  if (!structuredClauses.length) {
    return (
      <div className="space-y-2">
        <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Clauses</h3>
        <div className="text-gray-500 dark:text-gray-400 text-center p-4">
          No clauses found in the document analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        {isAnalysisView ? 'Key Clauses Analysis' : 'Clauses Analyzed'}
        <span className="bg-sky-100 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 text-xs px-2 py-1 rounded-full">
          {structuredClauses.length}
        </span>
      </h3>
      <div className="max-h-[60vh] overflow-auto space-y-3">
        {structuredClauses.map((clause, index) => {
          const isExpanded = expandedClauses.has(clause.id);
          return (
            <motion.div
              key={clause.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg transition-all duration-200 ${
                selectedId === clause.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Header */}
              <div 
                onClick={() => onSelect && onSelect(clause.id)} 
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${riskColor(clause.risk)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {isAnalysisView ? `Clause ${index + 1}` : `Clause #${clause.id}`}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${riskBadgeColor(clause.risk)}`}>
                          {clause.risk?.toUpperCase()} RISK
                        </span>
                        {clause.type && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                            {clause.type.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {clause.text.length > 120 ? `${clause.text.slice(0, 120)}...` : clause.text}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleExpand(clause.id, e)}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                  >
                    {isExpanded ? 
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="space-y-4 pt-4">
                    {/* Full Text */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Full Clause Text
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 italic">
                        "{clause.text}"
                      </p>
                    </div>

                    {/* Explanation */}
                    {clause.explanation && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          {riskIcon(clause.risk)}
                          Legal Analysis
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                          {clause.explanation}
                        </p>
                      </div>
                    )}

                    {/* Suggestions */}
                    {clause.suggestions && clause.suggestions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Recommendations
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                          {clause.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
