import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import { documentService, handleApiError, isAuthenticated } from '../services/api';
import { Shield, User, ArrowRight, Loader2, Upload, FileText, RefreshCw } from 'lucide-react';
import ClauseList from '../components/dashboard/ClauseList';
import { auth } from '../firebase/firebase';
import documentServiceFirebase from '../services/documentService';

const UploadPage = () => {
  const { setDocument, setRole, setClauses } = useContext(DocumentContext);
  const [selectedRole, setSelectedRole] = useState('Tenant');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedClause, setSelectedClause] = useState(null);
  const [previousDocuments, setPreviousDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { 
        state: { 
          from: '/dashboard/analysis',
          message: 'Please sign in to upload documents' 
        } 
      });
    }
  }, [navigate]);

  // Load previously uploaded documents
  useEffect(() => {
    const loadPreviousDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const result = await documentServiceFirebase.getAll();
        if (result.success) {
          setPreviousDocuments(result.documents);
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadPreviousDocuments();
      } else {
        setPreviousDocuments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid document file (PDF, Word, or Text file)');
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsAnalyzing(true);
      setError(null);


      // Call the direct file upload and analysis
      const response = await documentService.uploadAndAnalyze(
        selectedFile,
        selectedRole
      );

      if (response.success) {
        setAnalysisResults(response.analysis);
        setDocument(response.analysis);
        setRole(selectedRole);
        setClauses(response.analysis?.clauses || []);
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (err) {
      const errorMessage = handleApiError(err, navigate);
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-sky-600 dark:text-sky-400" />
          </div>
          <h1 className="text-4xl font-bold text-sky-900 dark:text-sky-100 mb-4">
            Document Analysis
          </h1>
          <p className="text-sky-600 dark:text-sky-300 text-lg max-w-2xl mx-auto">
            Upload a document for AI-powered legal analysis and risk assessment
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg"
          >
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-100 mb-6">
              Analysis Complete
            </h2>
            
            {/* Document Type and Risk Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">Document Type</h3>
                <p className="text-sky-700 dark:text-sky-300">{analysisResults.documentType || 'Unknown'}</p>
              </div>
              <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">Risk Level</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  (analysisResults.riskLevel || '').toLowerCase() === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : (analysisResults.riskLevel || '').toLowerCase() === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {analysisResults.riskLevel || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Purpose */}
            {analysisResults.purpose && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">Purpose</h3>
                <p className="text-gray-700 dark:text-gray-300">{analysisResults.purpose}</p>
              </div>
            )}

            {/* Key Clauses with ClauseList Component */}
            {analysisResults.clauses && analysisResults.clauses.length > 0 && (
              <div className="mb-6">
                <ClauseList 
                  clauses={analysisResults.clauses} 
                  selectedId={selectedClause}
                  onSelect={setSelectedClause}
                  isAnalysisView={true}
                />
              </div>
            )}

            {/* Legal Issues */}
            {analysisResults.legalIssues && analysisResults.legalIssues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-3 flex items-center gap-2">
                  Legal Issues 
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                    {analysisResults.legalIssues.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {analysisResults.legalIssues.map((issue, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          !
                        </div>
                        <div className="flex-1">
                          <p className="text-red-700 dark:text-red-300 leading-relaxed">{issue}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-3 flex items-center gap-2">
                  Recommendations 
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                    {analysisResults.recommendations.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                        <div className="flex-1">
                          <p className="text-green-700 dark:text-green-300 leading-relaxed">{recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Debug Information */}
            {(analysisResults.parseError || analysisResults.error) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Debug Information</h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-sm">
                  {analysisResults.parseError && <p className="text-yellow-700 dark:text-yellow-300 mb-2">Parse Error: {analysisResults.parseError}</p>}
                  {analysisResults.error && <p className="text-yellow-700 dark:text-yellow-300">Error: {analysisResults.error}</p>}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAnalysisResults(null);
                  setSelectedFile(null);
                  setError(null);
                }}
                className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Analyze Another Document
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Upload Form - only show when no analysis results */}
        {!analysisResults && (
          <>
            {/* File Upload Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              {!selectedFile ? (
                <div className="border-2 border-dashed border-sky-200 dark:border-sky-800 rounded-xl p-12 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                      <Upload className="w-16 h-16 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sky-700 dark:text-sky-300 text-2xl font-bold mb-2">
                        Upload Document
                      </p>
                      <p className="text-sky-600 dark:text-sky-400 text-lg mb-4">
                        Choose a file from your computer
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <motion.label
                        htmlFor="file-upload"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        Choose File
                      </motion.label>
                      <p className="text-sky-500 dark:text-sky-400 mt-4 text-sm">
                        Supports PDF, Word Documents (.doc, .docx), and Text files (.txt)
                        <br />
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Selected File Display */
                <div className="border-2 border-sky-200 dark:border-sky-600 rounded-xl p-8 text-center bg-sky-50 dark:bg-sky-900/20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                      <FileText className="w-12 h-12 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sky-900 dark:text-sky-100 font-medium text-lg">{selectedFile.name}</p>
                      <p className="text-sky-600 dark:text-sky-400 text-sm mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFile(null)}
                      className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm underline"
                    >
                      Choose different file
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-4">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {['Tenant', 'Landlord', 'Employee', 'Employer', 'Contractor', 'Client'].map(
                  (role) => (
                    <motion.button
                      key={role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                        selectedRole === role
                          ? 'bg-sky-100 dark:bg-sky-900/30 border-2 border-sky-500 dark:border-sky-400'
                          : 'bg-sky-50 dark:bg-gray-700 border-2 border-transparent hover:border-sky-200 dark:hover:border-sky-600'
                      }`}
                    >
                      <User className={`w-5 h-5 ${selectedRole === role ? 'text-sky-600 dark:text-sky-400' : 'text-sky-400 dark:text-sky-500'}`} />
                      <span className={`font-medium ${selectedRole === role ? 'text-sky-900 dark:text-sky-100' : 'text-sky-600 dark:text-sky-300'}`}>
                        {role}
                      </span>
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: selectedFile && !isAnalyzing ? 1.02 : 1 }}
                whileTap={{ scale: selectedFile && !isAnalyzing ? 0.98 : 1 }}
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className={`flex items-center space-x-2 px-8 py-4 rounded-lg text-white text-lg font-medium transition-colors ${
                  selectedFile && !isAnalyzing
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : 'bg-sky-300 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6" />
                    <span>Analyze Document</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </>
        )}

        {/* Previously Uploaded Documents */}
        {previousDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                Previously Uploaded Documents
              </h2>
              {isLoadingDocuments && <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {previousDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id || `${doc.name}-${doc.uploadDate}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-sky-200 dark:border-sky-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-sky-50 dark:bg-sky-900/20"
                  onClick={() => {
                    // Load previous document analysis if available
                    if (doc.analysis) {
                      setAnalysisResults(doc.analysis);
                      setClauses(doc.analysis.clauses || []);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-sky-900 dark:text-sky-100 truncate" 
                          title={doc.name || doc.fileName || doc.originalName}>
                        {doc.name || doc.fileName || doc.originalName || 'Untitled Document'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-sky-600 dark:text-sky-400">
                          {doc.uploadDate instanceof Date 
                            ? doc.uploadDate.toLocaleDateString() 
                            : doc.uploadDate 
                            ? new Date(doc.uploadDate).toLocaleDateString()
                            : 'Unknown date'}
                        </p>
                        {doc.status && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'analyzed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : doc.status === 'processing'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {doc.status}
                          </span>
                        )}
                      </div>
                      {doc.analysis?.riskLevel && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            doc.analysis.riskLevel.toLowerCase() === 'high' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : doc.analysis.riskLevel.toLowerCase() === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {doc.analysis.riskLevel} Risk
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center text-sm text-sky-600 dark:text-sky-400">
              Click on any document to view its analysis
            </div>
          </motion.div>
        )}

        {/* No Documents Message */}
        {!isLoadingDocuments && previousDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-8"
          >
            <div className="text-center text-sky-600 dark:text-sky-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-sky-900 dark:text-sky-100 mb-2">No Previous Documents</h3>
              <p className="text-sm">Upload your first document above to get started with AI-powered analysis.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
