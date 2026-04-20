import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { auth } from '../firebase/firebase';
import * as documentService from '../services/documentService';
import { 
  Send, 
  Paperclip, 
  Settings, 
  MoreVertical, 
  FileText, 
  User, 
  Bot, 
  Upload,
  Zap,
  Shield,
  BarChart3,
  Download,
  Sparkles,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  MessageSquare,
  Brain,
  Mic,
  Image,
  Plus,
  ChevronDown,
  Search,
  Filter,
  Archive,
  Star,
  Copy,
  Share,
  Trash2,
  Edit3,
  RefreshCw,
  MicOff,
  Square,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

const ChatPage = () => {
  // Custom component for formatting bot messages
  const BotMessage = ({ content, documentContext, responseType }) => {
    // Special handling for What-If scenario responses
    if (responseType === 'scenario_analysis') {
      return (
        <div className="space-y-3 max-w-full overflow-hidden break-words">
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center text-sm text-purple-700 dark:text-purple-300 mb-2">
              <Zap className="h-4 w-4 mr-2" />
              What-If Scenario Analysis
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Advanced predictive analysis based on your contract
            </div>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({children}) => <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center break-words"><Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" /><span className="break-words">{children}</span></h2>,
              h3: ({children}) => <h3 className="text-base font-medium text-purple-700 dark:text-purple-300 mb-2 break-words">{children}</h3>,
              p: ({children}) => <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed break-words">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ol>,
              li: ({children}) => <li className="break-words">{children}</li>,
              strong: ({children}) => <strong className="font-semibold text-purple-800 dark:text-purple-200 break-words">{children}</strong>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-purple-300 dark:border-purple-600 pl-4 py-2 bg-purple-50 dark:bg-purple-900/10 mb-3 break-words">
                  <div className="text-purple-700 dark:text-purple-300 break-words">{children}</div>
                </blockquote>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    // Regular bot messages
    return (
      <div className="space-y-3 max-w-full overflow-hidden break-words">
        {documentContext && (
          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Document Analysis
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
              Based on: {documentContext.fileName}
            </div>
          </div>
        )}
        
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 break-words">{children}</h1>,
            h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 break-words">{children}</h2>,
            h3: ({children}) => <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 break-words">{children}</h3>,
            p: ({children}) => <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed break-words">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ol>,
            li: ({children}) => <li className="break-words">{children}</li>,
            strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white break-words">{children}</strong>,
            code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm break-words">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg overflow-x-auto mb-3 break-words">{children}</pre>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-300 dark:border-blue-600 pl-4 py-2 bg-blue-50 dark:bg-blue-900/10 mb-3 break-words">
                <div className="text-blue-700 dark:text-blue-300 break-words">{children}</div>
              </blockquote>
            ),
            table: ({children}) => (
              <div className="overflow-x-auto mb-3">
                <table className="min-w-full border border-gray-300 dark:border-gray-600 break-words">{children}</table>
              </div>
            ),
            th: ({children}) => <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left break-words">{children}</th>,
            td: ({children}) => <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 break-words">{children}</td>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  // Quick actions (restored)
  const quickActions = [
    { name: 'Document Analysis', icon: FileText, color: 'from-blue-500 to-blue-600', description: 'Analyze uploaded documents' },
    { name: 'Risk Assessment', icon: AlertTriangle, color: 'from-red-500 to-red-600', description: 'Identify potential risks' },
    { name: 'Compliance Check', icon: Shield, color: 'from-green-500 to-green-600', description: 'Verify legal compliance' },
    { name: 'Contract Summary', icon: BarChart3, color: 'from-purple-500 to-purple-600', description: 'Generate summaries' },
    { name: 'Clause Extraction', icon: Copy, color: 'from-yellow-500 to-yellow-600', description: 'Extract key clauses' },
    { name: 'What-If Analysis', icon: Zap, color: 'from-indigo-500 to-indigo-600', description: 'Scenario planning' }
  ];

  // Core state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // kept for BotMessage context
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  // Voice recording states (kept for mic button functionality)
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load real documents from backend
  useEffect(() => {
    const loadDocuments = async () => {
      if (!auth.currentUser) {
        setIsLoadingDocuments(false);
        return;
      }

      try {
        const result = await documentService.getAll();
        if (result.success) {
          setUploadedDocuments(result.documents);
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoadingDocuments(true);
        loadDocuments();
      } else {
        setUploadedDocuments([]);
        setIsLoadingDocuments(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load real documents from backend when component mounts
  useEffect(() => {
    const loadDocuments = async () => {
      if (!auth.currentUser) {
        setIsLoadingDocuments(false);
        return;
      }

      try {
        
        const result = await documentService.getAll();
        if (result.success) {
          setUploadedDocuments(result.documents);
          // Log first document structure for debugging
          if (result.documents.length > 0) {
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoadingDocuments(true);
        loadDocuments();
      } else {
        setUploadedDocuments([]);
        setIsLoadingDocuments(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load real documents from backend when component mounts
  useEffect(() => {
    const loadDocuments = async () => {
      if (!auth.currentUser) {
        setIsLoadingDocuments(false);
        return;
      }

      try {
        
        const result = await documentService.getAll();
        if (result.success) {
          setUploadedDocuments(result.documents);
          // Log first document structure for debugging
          if (result.documents.length > 0) {
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoadingDocuments(true);
        loadDocuments();
      } else {
        setUploadedDocuments([]);
        setIsLoadingDocuments(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Intelligent response generation
  const generateIntelligentResponse = (input, document) => {
    const lowerInput = input.toLowerCase();
    
    // Document analysis responses
    if (lowerInput.includes('document analysis') || lowerInput.includes('analyze document')) {
      if (document) {
        return `I'm analyzing **${document.name}** for you. Here's what I found:

📊 **Document Overview:**
- Type: ${document.type.charAt(0).toUpperCase() + document.type.slice(1)} document
- Size: ${document.size}
- Upload Date: ${document.uploadDate instanceof Date ? document.uploadDate.toLocaleDateString() : document.uploadDate}
- Status: ${document.status}

🔍 **Key Analysis Areas:**
- **Risk Assessment**: Identifying potential legal and compliance risks
- **Contract Terms**: Extracting key clauses and obligations
- **Compliance Check**: Verifying adherence to regulations
- **Financial Impact**: Analyzing cost implications

Would you like me to focus on a specific aspect of the analysis?`;
      } else {
        return `I'd be happy to analyze a document for you! Please upload a document using the attachment button 📎, or select one from your uploaded documents in the sidebar.

**I can analyze:**
- Contracts and agreements
- Legal documents
- Compliance reports
- Risk assessments
- Financial documents

Once uploaded, I'll provide detailed insights on risks, compliance, key clauses, and recommendations.`;
      }
    }

    // Risk assessment responses
    if (lowerInput.includes('risk') || lowerInput.includes('assessment')) {
      return `🚨 **Risk Assessment Analysis**

I can help identify various types of risks in your documents:

**Legal Risks:**
- Contract violations
- Liability exposure
- Regulatory non-compliance

**Financial Risks:**
- Payment defaults
- Cost overruns
- Currency fluctuations

**Operational Risks:**
- Performance failures
- Timeline delays
- Resource constraints

${document ? `For **${document.name}**, I'll need to perform a detailed scan. ` : 'Upload a document and '}Would you like me to generate a comprehensive risk matrix?`;
    }

    // Compliance check responses
    if (lowerInput.includes('compliance') || lowerInput.includes('legal')) {
      return `⚖️ **Compliance Analysis**

I'll help ensure your documents meet regulatory standards:

**Compliance Areas I Check:**
- Industry regulations (GDPR, HIPAA, SOX, etc.)
- Contract law requirements
- Employment law compliance
- Financial reporting standards
- Data protection requirements

**Compliance Report Includes:**
- ✅ Compliant sections
- ⚠️ Areas needing attention
- ❌ Non-compliant items
- 📋 Recommended actions

${document ? `Analyzing **${document.name}** for compliance issues...` : 'Upload a document to start compliance checking.'}`;
    }

    // Contract summary responses
    if (lowerInput.includes('summary') || lowerInput.includes('contract')) {
      return `📄 **Document Summary Generator**

I can create comprehensive summaries including:

**Executive Summary:**
- Key parties and roles
- Main objectives
- Critical dates and milestones

**Terms & Conditions:**
- Payment terms
- Performance obligations
- Termination clauses

**Risk Highlights:**
- Potential issues
- Recommended actions
- Priority items

${document ? `Generating summary for **${document.name}**...` : 'Select a document to summarize from the sidebar or upload a new one.'}`;
    }

    // Clause extraction responses
    if (lowerInput.includes('clause') || lowerInput.includes('extract')) {
      return `🔍 **Clause Extraction Service**

I can identify and extract key clauses:

**Standard Clauses:**
- Termination conditions
- Payment schedules
- Liability limitations
- Confidentiality terms

**Special Provisions:**
- Force majeure
- Indemnification
- Intellectual property
- Dispute resolution

**Output Format:**
- Clause text with location
- Plain English explanation
- Risk level assessment
- Recommendations

${document ? `Extracting clauses from **${document.name}**...` : 'Upload a document to extract important clauses.'}`;
    }

    // What-if analysis responses
    if (lowerInput.includes('what-if') || lowerInput.includes('scenario')) {
      return `🎯 **What-If Scenario Analysis**

I can simulate various scenarios and their impacts:

**Scenario Types:**
- Contract breach consequences
- Payment delay impacts
- Regulatory changes
- Market fluctuations

**Analysis Includes:**
- Probability assessments
- Financial impact calculations
- Timeline effects
- Mitigation strategies

**Sample Scenarios:**
- "What if payment is delayed by 30 days?"
- "What if the vendor fails to deliver?"
- "What if new regulations are introduced?"

${document ? `Ready to analyze scenarios for **${document.name}**` : 'Upload a document and'} tell me what scenario you'd like to explore!`;
    }

    // General help and capabilities
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return `🤖 **LegalPro AI Assistant - Your Document Intelligence Partner**

**Core Capabilities:**
- 📊 Document Analysis & Insights
- 🚨 Risk Assessment & Identification
- ⚖️ Legal Compliance Checking
- 📄 Contract Summarization
- 🔍 Clause Extraction & Analysis
- 🎯 What-If Scenario Modeling

**Quick Actions Available:**
${quickActions.map(action => `- ${action.name}: ${action.description}`).join('\n')}

**How to Get Started:**
1. Upload a document using the 📎 button
2. Select from your uploaded documents
3. Choose a quick action or ask specific questions

I'm here to help with legal document analysis, compliance checking, and risk assessment. What would you like to explore?`;
    }

    // Default intelligent response
    return `Thank you for your question: "${input}"

I'm LegalPro's AI assistant, specialized in legal document analysis and compliance. I can help you with:

• **Document Analysis** - Deep insights into your contracts and legal documents
• **Risk Assessment** - Identify potential legal and financial risks
• **Compliance Checking** - Ensure regulatory adherence
• **Contract Summaries** - Executive summaries of complex documents
• **Clause Extraction** - Find and analyze specific contract terms
• **Scenario Analysis** - "What-if" impact assessments

${uploadedDocuments.length > 0 ? `You have ${uploadedDocuments.length} uploaded document${uploadedDocuments.length > 1 ? 's' : ''} ready for analysis. ` : 'Upload a document to begin analysis, or '}try asking me about document analysis, risk assessment, or compliance checking!

What would you like me to help you with today?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;


    const userMessage = {
      id: Date.now() + Math.random(), // Use timestamp + random for unique ID
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const currentInputMessage = inputMessage; // Store input before clearing
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call real backend API for document-aware responses
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      let response;
      
      // Check for different possible URL properties
      const documentUrl = selectedDocument?.cloudinaryUrl || selectedDocument?.url || selectedDocument?.fileUrl;
      const extractedText = selectedDocument?.extractedText;
      const documentAnalysis = selectedDocument?.analysis;
      
      if (selectedDocument && (documentUrl || extractedText)) {
        
        // Use document-aware chat endpoint with local data if available
        const requestBody = {
          message: currentInputMessage,
          fileName: selectedDocument.name || selectedDocument.fileName || selectedDocument.originalName,
          jurisdiction: 'India',
          userRole: selectedDocument.selectedRole || 'user'
        };

        // If we have extracted text locally, use it instead of trying to fetch from Cloudinary
        if (extractedText) {
          requestBody.documentContent = extractedText;
          requestBody.documentAnalysis = documentAnalysis;
        } else if (documentUrl) {
          requestBody.documentUrl = documentUrl;
        }

        response = await fetch(`${apiUrl}/chat/message-with-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      } else {
        // Use regular chat endpoint
        response = await fetch(`${apiUrl}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: currentInputMessage,
            context: 'General legal assistance'
          })
        });
      }
      
      const result = await response.json();
      
      const botResponse = {
        id: Date.now() + Math.random() + 1, // Use timestamp + random + 1 for unique ID
        type: 'bot',
        content: result.success ? result.response : `Error: ${result.error || 'Failed to get response'}`,
        timestamp: new Date(),
        documentContext: selectedDocument
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + Math.random() + 2, // Use timestamp + random + 2 for unique ID
        type: 'bot',
        content: `I apologize, but I encountered an error: ${error.message}. Please check if the server is running and try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        processAudioToText(audioBlob);
      };

  setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
      
      recorder.start();
      
      // Start duration timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Store timer to clear later
      recorder.timer = timer;

    } catch (error) {
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      if (mediaRecorder.timer) {
        clearInterval(mediaRecorder.timer);
      }
      setIsRecording(false);
      
      // Stop all tracks to release the microphone
      mediaRecorder.stream?.getTracks().forEach(track => track.stop());
    }
  };

  const processAudioToText = async () => {
    setIsProcessingAudio(true);
    
    try {
      // Use Web Speech API for speech-to-text
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsProcessingAudio(false);
          
          // Auto-focus the input after transcription
          setTimeout(() => {
            const textarea = document.querySelector('textarea[placeholder*="message"]');
            if (textarea) textarea.focus();
          }, 100);
        };

        recognition.onerror = (event) => {
          let errorMessage = 'Error processing voice input. ';
          
          switch(event.error) {
            case 'no-speech':
              errorMessage += 'No speech detected. Please try again.';
              break;
            case 'network':
              errorMessage += 'Network error. Please check your connection.';
              break;
            case 'not-allowed':
              errorMessage += 'Microphone permission denied.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
          
          alert(errorMessage);
          setIsProcessingAudio(false);
        };

        recognition.onend = () => {
          setIsProcessingAudio(false);
        };

        recognition.start();
      } else {
        // Fallback for browsers without Speech Recognition
        alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
        setIsProcessingAudio(false);
      }
      
    } catch (error) {
      alert('Error accessing speech recognition. Please try again.');
      setIsProcessingAudio(false);
    }
  };

  // formatRecordingTime removed (not currently displayed)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now() + Math.random(), // Use timestamp + random for unique ID
        type: 'user',
        content: `📎 Uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        timestamp: new Date(),
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // Add to uploaded documents list
      const newDocument = {
        id: Date.now(), // Simple ID generation
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('word') ? 'document' : file.type.includes('sheet') ? 'spreadsheet' : 'document',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'processing'
      };
      setUploadedDocuments(prev => [newDocument, ...prev]);
      
      setIsTyping(true);
      // Simulate file processing
      setTimeout(() => {
        const response = {
          id: Date.now() + Math.random(), // Use timestamp + random for unique ID
          type: 'bot',
          content: `📎 **Document Received: ${file.name}**

✅ **Upload Successful**
- File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- File Type: ${file.type || 'Unknown'}
- Upload Time: ${new Date().toLocaleTimeString()}

🔄 **Processing Status**: Analyzing document structure and content...

**What I'm Analyzing:**
- Document type and structure
- Key clauses and terms  
- Potential risks and issues
- Compliance requirements
- Financial implications

⏱️ **Estimated Analysis Time**: 30-60 seconds

Once analysis is complete, I'll provide:
- Executive summary
- Risk assessment
- Compliance check results
- Key findings and recommendations

You can ask me specific questions about the document or request detailed analysis of particular sections.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
        
        // Update document status to analyzed after processing
        setTimeout(() => {
          setUploadedDocuments(prev => 
            prev.map(doc => 
              doc.id === newDocument.id 
                ? { ...doc, status: 'analyzed' }
                : doc
            )
          );
          
          // Add analysis complete message
          const analysisComplete = {
            id: Date.now() + Math.random(),
            type: 'bot',
            content: `✅ **Analysis Complete for ${file.name}**

📊 **Document Analysis Results:**

**Document Type:** ${newDocument.type.charAt(0).toUpperCase() + newDocument.type.slice(1)} document
**Analysis Status:** Complete
**Processing Time:** ~30 seconds

**Key Findings:**
🔍 Document structure analyzed
⚖️ Legal terms identified
🚨 Risk factors assessed  
✅ Compliance status checked

**Available Actions:**
- Ask me specific questions about the document
- Request a detailed summary
- Get risk assessment report
- Check compliance status
- Extract specific clauses

**Example Questions:**
- "What are the main risks in this document?"
- "Summarize the key terms"
- "Are there any compliance issues?"
- "What happens if payment is delayed?"

The document is now ready for detailed analysis. What would you like to know?`,
            timestamp: new Date(),
            documentContext: newDocument
          };
          
          setMessages(prev => [...prev, analysisComplete]);
        }, 3000);
      }, 2000);
    }
  };
  // ----------- RENDER -------------
  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Assistant Sidebar */}
      <Motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="w-80 hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">LegalPro Assistant</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Always ready</p>
            </div>
          </div>
          <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Motion.button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Uploaded Documents Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Uploaded Documents</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">{uploadedDocuments.length}</span>
            </div>
            <div className="space-y-2">
              {isLoadingDocuments ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-50 animate-spin" />
                  <p className="text-xs">Loading your documents...</p>
                </div>
              ) : uploadedDocuments.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No documents uploaded yet</p>
                </div>
              ) : (
                uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border backdrop-blur-sm ${
                      selectedDocument?.id === doc.id 
                        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/10 border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
                        : 'bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-blue-900/10 hover:-translate-y-0.5'
                    }`}
                  >
                    <Motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedDocument(doc);
                      }}
                      className="w-full flex items-center space-x-4 p-4 text-left relative z-10"
                    >
                      <div className="flex-shrink-0 relative">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg relative overflow-hidden ${
                          doc.status === 'analyzed' 
                            ? 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 shadow-emerald-100 dark:shadow-emerald-900/20'
                            : doc.status === 'processing'
                            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-800 shadow-amber-100 dark:shadow-amber-900/20'
                            : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100 dark:from-slate-700 dark:via-gray-700 dark:to-slate-600 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 shadow-slate-100 dark:shadow-slate-900/20'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent dark:via-white/5 opacity-60"></div>
                          {doc.status === 'processing' ? (
                            <Motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="relative z-10">
                              <RefreshCw className="h-6 w-6" />
                            </Motion.div>
                          ) : (
                            <FileText className="h-6 w-6 relative z-10" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        {/* Title at the top */}
                        <div className="w-full">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug" 
                              title={doc.name || doc.fileName || doc.originalName || 'Document'}>
                            {doc.name || doc.fileName || doc.originalName || 'Document'}
                          </h3>
                        </div>
                        {/* Status and Date in one line with smaller size */}
                        <div className="flex items-center justify-between gap-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                            doc.status === 'analyzed' 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : doc.status === 'processing'
                              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}>
                            {doc.status === 'processing' ? 'Processing...' : doc.status === 'analyzed' ? 'Ready' : doc.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.uploadDate instanceof Date ? doc.uploadDate.toLocaleDateString() : doc.uploadDate || new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Motion.button>
                    <Motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedDocuments(prev => prev.filter(d => d.id !== doc.id));
                      }}
                      className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      title="Remove document"
                    >
                      <X className="h-4 w-4" />
                    </Motion.button>
                  </div>
                ))
              )}
            </div>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Motion.button
                key={action.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setInputMessage(`${action.name}: ${action.description}`);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg group bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{action.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{action.description}</p>
                </div>
              </Motion.button>
            ))}
          </div>
        </div>
      </Motion.div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <Motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">LegalPro Chat Assistant</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Online • Document intelligence
                {selectedDocument && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">• Analyzing: {selectedDocument.name}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Motion.button>
            <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Motion.button>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto px-4 py-6 messages-container ${messages.length === 0 ? 'flex items-center justify-center' : ''}`}>
          {messages.length === 0 && (
            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto">
              <Sparkles className="h-12 w-12 mx-auto mb-6 text-blue-500" />
              <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Welcome to LegalPro</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Ask about risks, compliance, summaries, or upload a file to begin advanced analysis.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {quickActions.slice(0, 6).map(a => (
                  <Motion.button
                    key={a.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage(`${a.name}: ${a.description}`)}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <div className={`w-8 h-8 mb-3 rounded-md bg-gradient-to-br ${a.color} flex items-center justify-center mx-auto`}>
                      <a.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{a.name}</p>
                  </Motion.button>
                ))}
              </div>
            </Motion.div>
          )}

          {messages.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-5">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <Motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[85%] ${m.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${m.type === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                        {m.type === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                      </div>
                      <div className={`px-5 py-4 rounded-2xl shadow-sm border text-sm leading-relaxed break-words ${m.type === 'user' ? 'bg-blue-500 text-white border-blue-500 rounded-br-md' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-bl-md'}`}>
                        {m.type === 'user' ? (
                          m.content
                        ) : (
                          <BotMessage content={m.content} documentContext={m.documentContext} responseType={m.responseType} />
                        )}
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="flex items-center space-x-3 max-w-[70%]">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-700 flex space-x-2">
                      {[0,1,2].map(i => (
                        <Motion.span key={i} className="w-2 h-2 rounded-full bg-emerald-500"
                          animate={{ opacity: [0.3,1,0.3], y:[0, -3,0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.25 }} />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </Motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-end space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
              className="hidden"
            />
            <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current?.click()} className="h-9 w-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center" title="Attach file">
              <Paperclip className="h-4 w-4" />
            </Motion.button>
            <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-9 w-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center" title="Add image">
              <Image className="h-4 w-4" />
            </Motion.button>
            <div className="flex-1 relative h-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full h-full px-3 pr-9 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center text-white text-[11px] font-medium transition-colors ${inputMessage.trim() && !isTyping ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
                title={inputMessage.trim() ? 'Send message' : 'Type a message to send'}
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
            <Motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={isRecording ? stopRecording : startRecording} disabled={isProcessingAudio} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : isProcessingAudio ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`} title={isRecording ? 'Stop recording' : isProcessingAudio ? 'Processing audio...' : 'Voice input'}>
              {isProcessingAudio ? (
                <Motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <RefreshCw className="h-4 w-4" />
                </Motion.div>
              ) : isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Motion.button>
          </div>
          {inputMessage.length === 0 && (
            <div className="max-w-5xl mx-auto mt-2 flex flex-wrap gap-1">
              {[
                'What are the main risks in my document?', 
                'Provide a detailed summary', 
                'Check for compliance issues', 
                'Extract key contract clauses', 
                'Generate a risk assessment matrix', 
                'What-if analysis: payment delay scenario'
              ].map(q => (
                <button key={q} onClick={() => setInputMessage(q)} className="px-2 py-0.5 text-[11px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          {isRecording && (
            <div className="mt-3 flex items-center justify-center space-x-3 text-xs text-red-600 dark:text-red-400">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span>Recording {recordingDuration}s</span>
              <button onClick={stopRecording} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-[11px]">Stop</button>
            </div>
          )}
          {isProcessingAudio && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
              <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <span>Converting speech to text...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
