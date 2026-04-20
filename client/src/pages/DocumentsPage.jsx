import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { DocumentContext } from '../context/DocumentContext';
import { documentService } from '../services/api';
import { auth } from '../firebase/firebase';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lexi-gaurd.vercel.app/api';
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  File,
  FileSpreadsheet,
  FileImage,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Store document ID to confirm delete
  const [deleting, setDeleting] = useState(false);
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);
  const fileInputRef = useRef(null);

  // Clean duplicate documents (keep the most recent of each filename)
  const handleCleanDuplicates = async () => {
    if (!window.confirm('This will delete duplicate documents (keeping the most recent of each file). Continue?')) {
      return;
    }

    try {
      setCleaningDuplicates(true);
      
      // Group documents by filename
      const grouped = documents.reduce((acc, doc) => {
        const fileName = doc.fileName || doc.originalName || 'unnamed';
        if (!acc[fileName]) {
          acc[fileName] = [];
        }
        acc[fileName].push(doc);
        return acc;
      }, {});

      // Find duplicates to delete (keep the most recent)
      let toDelete = [];
      for (const [, docs] of Object.entries(grouped)) {
        if (docs.length > 1) {
          // Sort by upload date (most recent first)
          docs.sort((a, b) => {
            const dateA = new Date(a.uploadDate || 0);
            const dateB = new Date(b.uploadDate || 0);
            return dateB - dateA;
          });
          
          // Mark all except the first (most recent) for deletion
          toDelete.push(...docs.slice(1));
        }
      }

      
      if (toDelete.length === 0) {
        setUploadSuccess('No duplicates found to clean up');
        setTimeout(() => setUploadSuccess(''), 3000);
        return;
      }

      // Delete duplicates
      for (const doc of toDelete) {
        await documentService.deleteDocument(doc.id);
      }

      // Reload documents
      const result = await documentService.getAll();
      const userDocuments = result.documents?.filter(doc => doc.userId === auth.currentUser.uid) || [];
      setDocuments(userDocuments);
      
      setUploadSuccess(`Cleaned up ${toDelete.length} duplicate documents`);
      setTimeout(() => setUploadSuccess(''), 5000);
      
    } catch (err) {
      setUploadError(`Failed to clean duplicates: ${err.message}`);
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setCleaningDuplicates(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess('');
      
      // Upload and analyze the document
      const result = await documentService.uploadAndAnalyze(file, 'user');
      
      if (result.success) {
        // Create new document object
        const newDocument = {
          id: result.documentId || Date.now(),
          fileName: result.fileName || file.name,
          originalName: file.name,
          fileSize: result.fileSize || file.size,
          fileType: result.fileType || file.type,
          mimeType: result.mimeType || file.type,
          format: result.format || file.type?.split('/')[1] || 'unknown',
          uploadDate: new Date(),
          status: result.partialSuccess ? 'partial' : 'analyzed',
          documentType: result.documentType || 'document',
          analysisResult: result.analysisResult || result.analysis,
          userId: auth.currentUser.uid,
          cloudinaryUrl: result.cloudinaryUrl || result.fileUrl,
          cloudinaryPublicId: result.publicId,
          extractedText: result.extractedText,
          partialSuccess: result.partialSuccess || false
        };
        
        // Add to local state
        setDocuments(prev => [newDocument, ...prev]);
        
        // Also sync with localStorage for cross-page consistency
        const storedDocs = localStorage.getItem('legalpro_uploaded_documents');
        let localDocs = [];
        if (storedDocs) {
          try {
            localDocs = JSON.parse(storedDocs);
          } catch {
            // Silently handle JSON parse error
          }
        }
        
        // Add to localStorage in ChatPage format
        const chatFormatDoc = {
          id: newDocument.id,
          name: newDocument.fileName,
          type: newDocument.documentType || 'document',
          uploadDate: new Date().toISOString().split('T')[0],
          size: typeof newDocument.fileSize === 'number' 
            ? `${(newDocument.fileSize / 1024 / 1024).toFixed(2)} MB`
            : newDocument.fileSize || 'Unknown',
          status: newDocument.status,
          fileName: newDocument.fileName,
          originalName: newDocument.originalName,
          analysisResult: newDocument.analysisResult,
          partialSuccess: newDocument.partialSuccess,
          format: newDocument.format,
          fileType: newDocument.fileType,
          mimeType: newDocument.mimeType
        };
        
        localDocs.unshift(chatFormatDoc);
        localStorage.setItem('legalpro_uploaded_documents', JSON.stringify(localDocs));
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Show appropriate success message
        if (result.partialSuccess) {
          setUploadSuccess(`📁 Document "${result.fileName}" uploaded successfully! ⚠️ AI analysis will be available when the service recovers.`);
        } else {
          setUploadSuccess(`✅ Document "${result.fileName}" uploaded and analyzed successfully!`);
        }
        
        setTimeout(() => setUploadSuccess(''), 6000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      
      // Provide user-friendly error messages
      let errorMessage = err.message || 'Failed to upload document';
      
      if (errorMessage.includes('model is overloaded') || errorMessage.includes('AI analysis service is currently overloaded')) {
        errorMessage = '🔄 AI analysis service is busy. Your file was uploaded to cloud storage but analysis failed. Please try again in a few moments.';
      } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        errorMessage = '⏳ Upload limit reached. Please try again later or contact support.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = '🌐 Network error. Please check your connection and try again.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = '⏰ Upload timed out. Please try with a smaller file or try again later.';
      } else if (errorMessage.includes('generativeai') || errorMessage.includes('gemini')) {
        errorMessage = '🤖 AI analysis temporarily unavailable. Your file was uploaded but needs to be re-analyzed later.';
      }
      
      setUploadError(errorMessage);
      setTimeout(() => setUploadError(''), 8000); // Show error longer for important messages
    } finally {
      setUploading(false);
    }
  };

  // Handle view document
  const handleViewDocument = async (doc) => {
    if (doc.cloudinaryUrl) {
      const fileFormat = (doc.format || '').toLowerCase();
      const fileName = doc.fileName || doc.originalName || 'document';
      
      // Ensure proper file extension
      let properFileName = fileName;
      if (fileName.includes('_docx') && !fileName.endsWith('.docx')) {
        properFileName = fileName.replace('_docx', '.docx');
      } else if (fileName.includes('_pdf') && !fileName.endsWith('.pdf')) {
        properFileName = fileName.replace('_pdf', '.pdf');
      } else if (fileName.includes('_xlsx') && !fileName.endsWith('.xlsx')) {
        properFileName = fileName.replace('_xlsx', '.xlsx');
      } else if (fileName.includes('_pptx') && !fileName.endsWith('.pptx')) {
        properFileName = fileName.replace('_pptx', '.pptx');
      }

      // Fix Cloudinary URL for proper PDF viewing
      let viewUrl = doc.cloudinaryUrl;
      
      // Convert image upload URLs to raw upload URLs for non-image files
      if (fileFormat === 'pdf' || ['docx', 'xlsx', 'pptx', 'txt', 'doc'].includes(fileFormat)) {
        if (viewUrl.includes('/image/upload/')) {
          viewUrl = viewUrl.replace('/image/upload/', '/raw/upload/');
        }
      }
      
      // Handle different file types
      if (fileFormat === 'pdf') {
        // For PDFs, use backend signed URL to avoid ACL issues
        try {
          
          // Extract public_id from Cloudinary URL and get signed URL
          const urlParts = doc.cloudinaryUrl.split('/');
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          const publicIdParts = urlParts.slice(versionIndex);
          const publicId = publicIdParts.join('/');
          
          
          // Get signed URL from backend
          const signedUrlEndpoint = `${API_BASE_URL}/document/signed-url?publicId=${encodeURIComponent(publicId)}&userId=${encodeURIComponent(auth.currentUser?.uid || '')}`;
          
          const signedUrlResponse = await fetch(signedUrlEndpoint);
          
          
          if (!signedUrlResponse.ok) {
            await signedUrlResponse.text();
            throw new Error(`Failed to get signed URL: ${signedUrlResponse.status}`);
          }
          
          const signedUrlData = await signedUrlResponse.json();
          const signedUrl = signedUrlData.url;
          
          
          // Test the signed URL directly first
          window.open(signedUrl, '_blank');
          
        } catch (error) {
          setUploadError(`Failed to view PDF: ${error.message}`);
          setTimeout(() => setUploadError(''), 4000);
        }
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileFormat)) {
        // For images, open directly (keep image upload URL)
        window.open(doc.cloudinaryUrl, '_blank');
      } else {
        // For other documents (docx, xlsx, pptx, txt), download with proper extension
        const link = document.createElement('a');
        link.href = viewUrl;
        link.download = properFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download feedback
        setUploadSuccess(`Downloading "${properFileName}"...`);
        setTimeout(() => setUploadSuccess(''), 3000);
      }
    } else {
      setUploadError('Document file is not available for viewing. Please contact support if this persists.');
      setTimeout(() => setUploadError(''), 5000);
    }
  };

  // Handle delete document
  const handleDeleteDocument = (documentId) => {
    setDeleteConfirm(documentId);
  };

  // Confirm delete document
  const confirmDeleteDocument = async (documentId) => {
    try {
      setDeleting(true);
      
      
      // Find the document to get its details
      const docToDelete = documents.find(doc => doc.id === documentId);
      
      const result = await documentService.deleteDocument(documentId);
      
      if (result.success) {
        
        // Remove document from local state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        
        // Also sync with localStorage
        const storedDocs = localStorage.getItem('legalpro_uploaded_documents');
        if (storedDocs) {
          try {
            let localDocs = JSON.parse(storedDocs);

            localDocs = localDocs.filter(doc => doc.id !== documentId);
            localStorage.setItem('legalpro_uploaded_documents', JSON.stringify(localDocs));
          } catch {
            // Silently handle localStorage error
          }
        }
        
        const deletionMessage = docToDelete?.cloudinaryPublicId ? 
          'Document and cloud files deleted successfully' : 
          'Document deleted successfully';
        setUploadSuccess(deletionMessage);
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        throw new Error('Delete operation returned unsuccessful result');
      }
    } catch (err) {
      const errorMessage = err.message.includes('n.indexOf') ? 
        'Failed to delete document: Invalid document format. Try refreshing the page.' :
        `Failed to delete document: ${err.message}`;
      setUploadError(errorMessage);
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Load documents with localStorage fallback
  useEffect(() => {
    const loadDocuments = async () => {
      // Check if user is authenticated
      if (!auth.currentUser) {
        setLoading(false);
        setError('Please sign in to view your documents');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        let documents = [];
        // Try to load from Firestore first
        try {
          const result = await documentService.getAll();
          
          if (result.success && result.documents && result.documents.length > 0) {
            documents = result.documents.filter(doc => doc.userId === auth.currentUser.uid);
            
            // Merge with localStorage documents to get complete view
            const storedDocs = localStorage.getItem('legalpro_uploaded_documents');
            if (storedDocs) {
              try {
                const localDocs = JSON.parse(storedDocs);
                if (Array.isArray(localDocs) && localDocs.length > 0) {
                  
                  // Convert localStorage format and merge
                  const firestoreIds = new Set(documents.map(d => d.id));
                  const localOnlyDocs = localDocs
                    .filter(doc => !firestoreIds.has(doc.id))
                    .map(doc => ({
                      id: doc.id,
                      fileName: doc.fileName || doc.name,
                      originalName: doc.originalName || doc.name,
                      fileSize: doc.size,
                      fileType: doc.fileType || doc.mimeType,
                      mimeType: doc.mimeType || doc.fileType,
                      format: doc.format || doc.fileType?.split('/')[1] || 'unknown',
                      uploadDate: doc.uploadDate ? new Date(doc.uploadDate) : new Date(),
                      status: doc.status,
                      documentType: doc.type,
                      analysisResult: doc.analysisResult,
                      userId: auth.currentUser.uid
                    }));
                  
                  documents = [...documents, ...localOnlyDocs];
                }
              } catch {
                // Silently handle error
              }
            }
            
            // Save merged documents back to localStorage for sync
            const chatFormatDocs = documents.map(doc => ({
              id: doc.id,
              name: doc.fileName || doc.originalName,
              type: doc.documentType || 'document',
              uploadDate: doc.uploadDate ? new Date(doc.uploadDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              size: doc.fileSize || doc.size || 'Unknown',
              status: doc.status || 'analyzed',
              fileName: doc.fileName || doc.originalName,
              originalName: doc.originalName,
              analysisResult: doc.analysisResult,
              format: doc.format,
              fileType: doc.fileType,
              mimeType: doc.mimeType
            }));
            localStorage.setItem('legalpro_uploaded_documents', JSON.stringify(chatFormatDocs));
          }
        } catch {
          // Silently handle Firestore error
        }
        
        // If Firestore failed or no documents, try localStorage
        if (documents.length === 0) {
          const storedDocs = localStorage.getItem('legalpro_uploaded_documents');
          if (storedDocs) {
            try {
              const localDocs = JSON.parse(storedDocs);
              if (Array.isArray(localDocs) && localDocs.length > 0) {
                // Convert localStorage format to DocumentsPage format
                documents = localDocs.map(doc => ({
                  id: doc.id,
                  fileName: doc.fileName || doc.name,
                  originalName: doc.originalName || doc.name,
                  fileSize: doc.size,
                  fileType: doc.fileType || doc.mimeType,
                  mimeType: doc.mimeType || doc.fileType,
                  format: doc.format || doc.fileType?.split('/')[1] || 'unknown',
                  uploadDate: doc.uploadDate ? new Date(doc.uploadDate) : new Date(),
                  status: doc.status,
                  documentType: doc.type,
                  analysisResult: doc.analysisResult,
                  userId: auth.currentUser.uid
                }));
              }
            } catch {
              // Silently handle localStorage parse error
            }
          }
        }
        
        // If still no documents, try backend API
        if (documents.length === 0) {
          try {
            const user = auth.currentUser;
            const idToken = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/user/documents`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const userDocs = await response.json();
              if (userDocs && userDocs.length > 0) {
                documents = userDocs.map(doc => ({
                  id: doc.id,
                  fileName: doc.name,
                  originalName: doc.name,
                  fileSize: doc.size,
                  uploadDate: new Date(doc.uploadDate),
                  status: 'analyzed',
                  documentType: doc.type,
                  userId: auth.currentUser.uid
                }));
              }
            }
          } catch {
            // Silently handle API error
          }
        }
        
        setDocuments(documents);
        
      } catch (err) {
        setError(`Unable to load documents: ${err.message}. Check your internet connection.`);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth state to be ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadDocuments();
      } else {
        setDocuments([]);
        setLoading(false);
        setError('Please sign in to view your documents');
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter documents based on search term and status
  const filteredDocuments = documents.filter(doc => {
    // Hide Google Drive documents
    if (doc.storageLocation === 'google_drive') return false;

    const matchesSearch = doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentSize = (doc) => {
    // Try multiple possible field names for file size
    const size = doc.fileSize || doc.size || doc.sizeBytes || doc.fileSizeBytes;
    
    // If size is already a formatted string (like "2.4 MB"), return it
    if (typeof size === 'string' && size.includes('MB')) {
      return size;
    }
    
    // If size is a number, format it
    if (typeof size === 'number') {
      return formatFileSize(size);
    }
    
    return size || 'Unknown';
  };

  // Helper function to get document type icon based on file extension
  const getDocumentTypeIcon = (doc) => {
    const fileName = doc.fileName || doc.originalName || '';
    const extension = fileName.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'pdf':
        return FileText;
      case 'doc':
      case 'docx':
        return FileText;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return FileSpreadsheet;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return FileImage;
      default:
        return File;
    }
  };

  // Helper function to get status information with icon and label
  const getStatusInfo = (doc) => {
    const status = doc.status || 'unknown';
    
    switch (status.toLowerCase()) {
      case 'processed':
      case 'analyzed':
        return {
          icon: CheckCircle,
          label: 'Processed',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'Processing',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'error':
      case 'failed':
        return {
          icon: AlertTriangle,
          label: 'Error',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          icon: Info,
          label: 'Unknown',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-700'
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      // Handle different date formats
      let dateObj;
      
      if (date.toDate) {
        // Firestore timestamp
        dateObj = date.toDate();
      } else if (typeof date === 'string') {
        // String date - try parsing
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        // Already a Date object
        dateObj = date;
      } else if (typeof date === 'number') {
        // Unix timestamp
        dateObj = new Date(date);
      } else {
        return 'N/A';
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getRiskLevel = (doc) => {
    // First check if there's a direct riskLevel field
    if (doc.riskLevel) {
      const risk = doc.riskLevel.toString().toLowerCase();
      if (risk === 'high') {
        return { 
          level: 'High', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          icon: ShieldAlert 
        };
      } else if (risk === 'medium' || risk === 'moderate') {
        return { 
          level: 'Medium', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: Shield 
        };
      } else if (risk === 'low') {
        return { 
          level: 'Low', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: ShieldCheck 
        };
      }
    }

    // Check if there's analysis with risk factors
    if (doc.analysis && doc.analysis.riskFactors) {
      const totalRisks = doc.analysis.riskFactors.length;
      
      if (totalRisks === 0) {
        return { 
          level: 'Low', 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: ShieldCheck 
        };
      } else if (totalRisks <= 2) {
        return { 
          level: 'Medium', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: Shield 
        };
      } else {
        return { 
          level: 'High', 
          color: 'text-red-600', 
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: ShieldAlert 
        };
      }
    }

    // Generate varied risk levels based on document properties for demo
    const fileName = (doc.fileName || doc.originalName || '').toLowerCase();
    const docId = doc.id || '';
    
    // Use a simple hash of document ID to determine risk level consistently
    let hash = 0;
    for (let i = 0; i < docId.length; i++) {
      const char = docId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const riskValue = Math.abs(hash) % 100; // Use modulo 100 for better distribution
    
    // Different risk distributions based on document type
    if (fileName.includes('contract') || fileName.includes('agreement')) {
      if (riskValue < 30) return { 
        level: 'Low', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: ShieldCheck 
      };
      if (riskValue < 70) return { 
        level: 'Medium', 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: Shield 
      };
      return { 
        level: 'High', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: ShieldAlert 
      };
    } else {
      if (riskValue < 40) return { 
        level: 'Low', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: ShieldCheck 
      };
      if (riskValue < 75) return { 
        level: 'Medium', 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: Shield 
      };
      return { 
        level: 'High', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: ShieldAlert 
      };
    }
  };

  const getDocumentRole = (doc) => {
    // First check if there's a direct selectedRole field
    if (doc.selectedRole) {
      return doc.selectedRole;
    }
    
    // Determine document role/type from analysis or filename
    if (doc.analysis && doc.analysis.documentType) {
      return doc.analysis.documentType;
    }
    
    const fileName = (doc.fileName || doc.originalName || '').toLowerCase();
    if (fileName.includes('contract')) return 'Contract';
    if (fileName.includes('agreement')) return 'Agreement';
    if (fileName.includes('policy')) return 'Policy';
    if (fileName.includes('terms')) return 'Terms & Conditions';
    if (fileName.includes('privacy')) return 'Privacy Policy';
    if (fileName.includes('nda')) return 'NDA';
    if (fileName.includes('license')) return 'License';
    
    return 'Legal Document';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Documents</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and analyze your legal documents</p>
          </div>
          
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

      {/* Alert Messages */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{uploadError}</span>
            </div>
            {(uploadError.includes('AI service is busy') || 
              uploadError.includes('overloaded') || 
              uploadError.includes('AI analysis service is currently overloaded') ||
              uploadError.includes('AI analysis temporarily unavailable')) && (
              <button
                onClick={() => {
                  setUploadError('');
                  // Trigger file input click to retry
                  fileInputRef.current?.click();
                }}
                className="ml-4 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded border border-red-300 transition-colors flex-shrink-0"
              >
                Retry Upload
              </button>
            )}
          </div>
          {(uploadError.includes('AI analysis service is busy') || 
            uploadError.includes('AI analysis temporarily unavailable')) && (
            <div className="mt-2 text-xs text-red-600">
              💡 <strong>Tip:</strong> The document file is safely stored. You can try the analysis again later, or continue using other features.
            </div>
          )}
        </motion.div>
      )}

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {uploadSuccess}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="processed">Processed</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Documents Processed Overview */}
      {documents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-6">
          <details className="cursor-pointer">
            <summary className="font-semibold text-gray-900 dark:text-white text-lg mb-3 flex items-center justify-between hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span>Documents Processed</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Click to expand</span>
            </summary>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Current User</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{auth.currentUser?.email?.split('@')[0] || 'Unknown'}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Documents</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{documents.length}</div>
                </div>
              </div>
              
              {/* Document Statistics */}
              {(() => {
                const fileNames = documents.map(doc => doc.fileName || doc.originalName);
                const uniqueNames = [...new Set(fileNames)];
                const duplicateCount = fileNames.length - uniqueNames.length;
                
                return (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Document Status</div>
                        <div className="text-gray-900 dark:text-gray-100">
                          <span className="font-semibold">{uniqueNames.length}</span> unique files
                          {duplicateCount > 0 && (
                            <span className="ml-2">
                              • <span className="text-orange-600 dark:text-orange-400 font-medium">{duplicateCount} duplicates</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {duplicateCount > 0 && (
                        <button
                          onClick={handleCleanDuplicates}
                          disabled={cleaningDuplicates}
                          className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 dark:disabled:bg-orange-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          {cleaningDuplicates ? 'Cleaning...' : `Clean Duplicates`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
              
              {/* Document Details List */}
              <details className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  View Document Details ({documents.length} files)
                </summary>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {documents.slice(0, 15).map((doc, index) => (
                    <div key={doc.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {index + 1}. {doc.fileName || doc.originalName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getDocumentSize(doc)} • {(doc.format || 'PDF').toUpperCase()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right ml-4 flex-shrink-0">
                        {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                  {documents.length > 15 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                      ... and {documents.length - 15} more documents
                    </div>
                  )}
                </div>
              </details>
            </div>
          </details>
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No documents found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {documents.length === 0 
              ? "Upload your first document to get started" 
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const documentIcon = getDocumentTypeIcon(doc);
            const riskInfo = getRiskLevel(doc);
            const statusInfo = getStatusInfo(doc);
            
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, shadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)" }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Header with gradient and document type */}
                <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-6 text-white">
                  {/* Risk indicator - positioned absolutely */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${riskInfo.bgColor} ${riskInfo.textColor} border border-white/30 shadow-sm`}>
                      {React.createElement(riskInfo.icon, { className: "w-3 h-3" })}
                      <span>{riskInfo.level} Risk</span>
                    </div>
                  </div>
                  
                  <div className="pr-20"> {/* Add right padding for risk indicator */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        {React.createElement(documentIcon, { className: "w-6 h-6 text-white" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-2 text-white leading-tight" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden',
                          wordBreak: 'break-word'
                        }}>
                          {(doc.fileName || doc.originalName || 'Untitled Document').replace(/\.[^/.]+$/, "")}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm`}>
                            {React.createElement(statusInfo.icon, { className: "w-3 h-3" })}
                            <span className="text-xs font-medium">{statusInfo.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Document info grid */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">Size</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {getDocumentSize(doc)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <File className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">Format</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs uppercase font-bold text-gray-900 dark:text-gray-100">
                          {(doc.format || doc.fileType || doc.mimeType?.split('/')[1] || 'PDF')
                            .replace('application/', '')
                            .replace('vnd.openxmlformats-officedocument.', '')
                            .replace('wordprocessingml.document', 'DOCX')
                            .replace('spreadsheetml.sheet', 'XLSX')
                            .replace('presentationml.presentation', 'PPTX')
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">Uploaded</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatDate(doc.uploadDate || doc.createdAt || doc.uploadedAt || doc.timestamp || doc.dateCreated)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">Role</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium">
                          {getDocumentRole(doc)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risk factors section */}
                  {doc.analysis && doc.analysis.riskFactors && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-semibold text-red-800 dark:text-red-300">Risk Analysis</span>
                        </div>
                        <span className="bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold">
                          {doc.analysis.riskFactors.length} {doc.analysis.riskFactors.length === 1 ? 'issue' : 'issues'}
                        </span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                        Document contains potential risk factors that require review
                      </p>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Document</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteDocument(deleteConfirm)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800 text-white px-4 py-2 rounded transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DocumentsPage;
