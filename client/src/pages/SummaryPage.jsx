import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload,
  FileText,
  Globe,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Download,
  Copy,
  Printer,
  RefreshCw,
  Info,
  Star
} from 'lucide-react';
import MultilingualSummary from '../components/dashboard/MultilingualSummary';
import { auth } from '../firebase/firebase';
import documentService from '../services/documentService';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lexi-gaurd.vercel.app/api';

const SummaryPage = () => {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previousDocuments, setPreviousDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const fileInputRef = useRef(null);

  // Load previously uploaded documents
  useEffect(() => {
    const loadPreviousDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const result = await documentService.getAll();
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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/pdf'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload PDF, Word documents (.doc, .docx), or text files (.txt) only.');
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Please select a file smaller than 10MB.');
      }

      // Upload and analyze the document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('selectedRole', 'user');
      formData.append('userId', 'summary-user');
      formData.append('userEmail', 'summary@lexiguard.com');

      const uploadResponse = await fetch(`${API_BASE_URL}/document/upload-and-analyze`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to process document');
      }

      // Check if we have extracted text
      if (!uploadResult.extractedText || uploadResult.extractedText.trim() === '') {
        throw new Error('No text could be extracted from the document. Please ensure the document contains readable text.');
      }

      // Set the uploaded document
      const documentData = {
        fileName: file.name,
        content: uploadResult.extractedText,
        analysis: uploadResult.analysis,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        fileUrl: uploadResult.fileUrl
      };

      setUploadedDocument(documentData);

      // Refresh the previous documents list to include the new upload
      try {
        const result = await documentService.getAll();
        if (result.success) {
          setPreviousDocuments(result.documents);
        }
      } catch (refreshError) {
      }

    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearDocument = () => {
    setUploadedDocument(null);
    setUploadError(null);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Multilingual Document Summarizer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Upload documents and get detailed summaries in 20+ languages
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Document Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Document
              </h2>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleFileSelect}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                }`}
              >
                {isUploading ? (
                  <div className="text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium">Processing document...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we analyze your file</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Drop your document here
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      or click to browse files
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">PDF</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">DOC</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">DOCX</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">TXT</span>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Error Display */}
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">Upload Error</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{uploadError}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Current Document */}
              {uploadedDocument && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          {uploadedDocument.fileName}
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {(uploadedDocument.fileSize / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearDocument}
                      className="p-1 text-green-600 hover:text-red-600 transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Previously Uploaded Documents */}
            {previousDocuments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Previously Uploaded Documents
                  {isLoadingDocuments && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {previousDocuments.map((doc, index) => (
                    <motion.button
                      key={doc.id || `${doc.name}-${doc.uploadDate}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        const documentData = {
                          fileName: doc.name || doc.fileName || doc.originalName,
                          content: doc.extractedText,
                          analysis: doc.analysis,
                          fileSize: doc.fileSize || doc.size,
                          uploadTime: doc.uploadDate instanceof Date ? doc.uploadDate.toISOString() : doc.uploadDate,
                          fileUrl: doc.cloudinaryUrl || doc.url
                        };
                        setUploadedDocument(documentData);
                        setUploadError(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        uploadedDocument?.fileName === (doc.name || doc.fileName || doc.originalName)
                          ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {doc.name || doc.fileName || doc.originalName || 'Untitled Document'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
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
                        </div>
                        <FileText className="h-4 w-4 text-gray-400 ml-3" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Documents Message */}
            {!isLoadingDocuments && previousDocuments.length === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <FileText className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Documents Yet</h3>
                  <p className="text-sm">Upload your first document to get started with multilingual summaries.</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MultilingualSummary uploadedDocument={uploadedDocument} />
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
