import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  Globe,
  Download,
  Copy,
  Printer,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Clock,
  Eye,
  Sparkles
} from 'lucide-react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lexi-gaurd.vercel.app/api';

const MultilingualSummary = ({ uploadedDocument }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [summary, setSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [summaryType, setSummaryType] = useState('comprehensive');

  // Supported languages with native names
  const languages = {
    'english': { name: 'English', native: 'English', flag: '🇺🇸' },
    'spanish': { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    'french': { name: 'French', native: 'Français', flag: '🇫🇷' },
    'german': { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    'hindi': { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    'marathi': { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    'gujarati': { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    'tamil': { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    'telugu': { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    'kannada': { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    'bengali': { name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    'punjabi': { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    'urdu': { name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    'chinese': { name: 'Chinese', native: '中文', flag: '🇨🇳' },
    'japanese': { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    'korean': { name: 'Korean', native: '한국어', flag: '🇰🇷' },
    'arabic': { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    'portuguese': { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
    'italian': { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    'dutch': { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
    'russian': { name: 'Russian', native: 'Русский', flag: '🇷🇺' }
  };

  // Generate summary when document or language changes
  useEffect(() => {
    if (uploadedDocument && uploadedDocument.content) {
      generateSummary();
    }
  }, [uploadedDocument, selectedLanguage, summaryType]);

  const generateSummary = async () => {
    if (!uploadedDocument || !uploadedDocument.content) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/multilingual-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentContent: uploadedDocument.content,
          fileName: uploadedDocument.fileName,
          language: selectedLanguage,
          summaryType: summaryType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSummary({
          content: data.summary,
          language: data.language,
          timestamp: data.timestamp,
          type: data.type
        });
      } else {
        setSummary({
          content: `❌ **Error generating summary**: ${data.error}`,
          language: selectedLanguage,
          timestamp: new Date().toISOString(),
          type: 'error'
        });
      }
    } catch (error) {
      setSummary({
        content: `❌ **Network error**: Failed to generate summary. Please check your connection and try again.`,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        type: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copySummaryToClipboard = () => {
    if (summary && summary.content) {
      navigator.clipboard.writeText(summary.content);
      // You can add a toast notification here
    }
  };

  const printSummary = () => {
    if (summary && summary.content) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Summary - ${uploadedDocument.fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              h1, h2, h3 { color: #333; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Document Summary</h1>
              <p><strong>Document:</strong> ${uploadedDocument.fileName}</p>
              <p><strong>Language:</strong> ${languages[selectedLanguage]?.native}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div>${summary.content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadSummary = () => {
    if (summary && summary.content) {
      const blob = new Blob([summary.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${uploadedDocument.fileName}_summary_${selectedLanguage}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!uploadedDocument) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Document Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a document in the chat section to generate multilingual summaries
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Multilingual Document Summary
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploadedDocument.fileName} • {(uploadedDocument.content.length / 1000).toFixed(1)}k chars
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={copySummaryToClipboard}
              disabled={!summary || isGenerating}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Copy to Clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={printSummary}
              disabled={!summary || isGenerating}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Print Summary"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={downloadSummary}
              disabled={!summary || isGenerating}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Download Summary"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Regenerate Summary"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Language and Type Selectors */}
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-300 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800 transition-all"
            >
              <span className="text-lg">{languages[selectedLanguage]?.flag}</span>
              <span>{languages[selectedLanguage]?.native}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLanguage(code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedLanguage === code ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="font-medium">{lang.native}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</div>
                      </div>
                      {selectedLanguage === code && <CheckCircle className="h-4 w-4 text-purple-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Type Selector */}
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 border border-blue-200 dark:border-blue-700 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="comprehensive">🔍 Comprehensive Analysis</option>
            <option value="executive">👔 Executive Summary</option>
            <option value="legal">⚖️ Legal Focus</option>
            <option value="financial">💰 Financial Focus</option>
            <option value="risks">⚠️ Risk Analysis</option>
          </select>
        </div>
      </div>

      {/* Summary Content */}
      <div className="p-6">
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <div>
                <div className="text-lg font-semibold">Generating Summary</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Creating detailed analysis in {languages[selectedLanguage]?.native}...
                </div>
              </div>
            </div>
          </div>
        ) : summary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Star className="h-6 w-6 text-yellow-500 mr-2" />
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-none space-y-2 mb-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600 dark:text-gray-300 flex items-start">
                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-1 rounded">
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg mb-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400">
                    {children}
                  </code>
                ),
              }}
            >
              {summary.content}
            </ReactMarkdown>

            {/* Summary Metadata */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Generated: {new Date(summary.timestamp).toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {languages[selectedLanguage]?.native}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Generate Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select your preferred language and summary type, then click generate
            </p>
            <button
              onClick={generateSummary}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Generate Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultilingualSummary;
