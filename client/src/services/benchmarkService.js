// Fairness benchmark service for analyzing document fairness
import { auth } from "../firebase/firebase.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://lexi-gaurd.vercel.app/api";

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Analyze fairness of an existing document
export const analyzeFairnessById = async (
  documentId,
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://lexi-gaurd.vercel.app/api";

    // First, get the document details from Firebase
    const documentService = await import("./documentService.js");
    const docResult = await documentService.default.getById(documentId);

    if (!docResult.success) {
      throw new Error("Document not found or access denied");
    }

    const document = docResult.document;

    // Check if document has a Cloudinary URL for text extraction
    if (!document.cloudinaryUrl) {
      throw new Error("Document file not found for analysis");
    }

    const url = `${API_BASE_URL}/benchmark/analyze-document/${documentId}`;

    const requestBody = {
      userId: auth.currentUser.uid,
      jurisdiction,
      userRole: document.selectedRole || "Consumer",
      documentDetails: {
        fileName: document.fileName,
        cloudinaryUrl: document.cloudinaryUrl,
        fileSize: document.fileSize,
        mimeType: document.fileType,
        extractedText: document.extractedText, // CRITICAL: Include extracted text for fallback
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // For 400 errors, try to parse JSON response first to get detailed error info
      if (response.status === 400) {
        try {
          const errorResult = await response.json();

          if (errorResult.needsReupload) {
            return {
              success: false,
              error: errorResult.error,
              needsReupload: true,
              documentId: errorResult.documentId,
              hasFairnessAnalysis: false,
              suggestion: errorResult.suggestion,
              cloudinaryError: errorResult.cloudinaryError,
            };
          }

          throw new Error(errorResult.error || "Analysis failed");
        } catch {
          // If JSON parsing fails, fall back to text response
          const errorText = await response.text();
          throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }
    }

    const result = await response.json();

    if (result.success) {
      const returnData = {
        success: true,
        fairnessAnalysis: result.fairnessAnalysis,
        analyzedAt: result.analyzedAt,
        documentId: result.documentId,
        contractType: result.contractType,
        analysisSource: result.analysisSource,
        hasFairnessAnalysis: !!result.fairnessAnalysis,
        analysisType: result.fairnessAnalysis?.analysisType,
      };

      return returnData;
    } else {
      // Handle server-side errors (like missing extracted text)

      if (result.needsReupload) {
        return {
          success: false,
          error: result.error,
          needsReupload: true,
          documentId: result.documentId,
          hasFairnessAnalysis: false,
          suggestion: result.suggestion,
        };
      }

      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    throw new Error(`Fairness analysis failed: ${error.message}`);
  }
};

// Analyze fairness of contract text directly
export const analyzeFairnessText = async (
  contractText,
  contractType = "contract",
  jurisdiction = "India",
  userRole = "Consumer"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/benchmark/analyze-fairness`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractText,
        contractType,
        jurisdiction,
        userRole,
        userId: auth.currentUser.uid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        fairnessAnalysis: result.fairnessAnalysis,
        analyzedAt: result.analyzedAt,
      };
    } else {
      throw new Error(result.error || "Fairness analysis failed");
    }
  } catch (error) {
    throw new Error(`Fairness analysis failed: ${error.message}`);
  }
};

// Upload new document and analyze fairness
export const uploadAndAnalyzeFairness = async (
  file,
  selectedRole = "Consumer",
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectedRole", selectedRole);
    formData.append("userId", auth.currentUser.uid);
    formData.append("userEmail", auth.currentUser.email);
    formData.append("jurisdiction", jurisdiction);

    // Upload file to backend for processing
    const response = await fetch(
      `${API_BASE_URL}/document/upload-and-analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        documentId: result.documentId,
        fileName: file.name,
        analysis: result.analysis,
        fairnessBenchmark: result.fairnessBenchmark,
        fileUrl: result.fileUrl,
      };
    } else {
      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Get benchmark statistics
export const getBenchmarkStats = async (
  jurisdiction = "India",
  contractType = "all"
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/benchmark/benchmark-stats?jurisdiction=${encodeURIComponent(
        jurisdiction
      )}&contractType=${encodeURIComponent(contractType)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        stats: result.stats,
      };
    } else {
      throw new Error(result.error || "Failed to get benchmark statistics");
    }
  } catch (error) {
    throw new Error(`Failed to get benchmark statistics: ${error.message}`);
  }
};

// Get market insights
export const getMarketInsights = async (
  contractType = "rental agreement",
  jurisdiction = "India"
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/benchmark/market-insights?contractType=${encodeURIComponent(
        contractType
      )}&jurisdiction=${encodeURIComponent(jurisdiction)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        insights: result.marketInsights,
      };
    } else {
      throw new Error(result.error || "Failed to get market insights");
    }
  } catch (error) {
    throw new Error(`Failed to get market insights: ${error.message}`);
  }
};

// Analyze specific clause fairness
export const analyzeClauseFairness = async (
  clauseText,
  contractType = "contract",
  jurisdiction = "India"
) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/benchmark/analyze-clause`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clauseText,
        contractType,
        jurisdiction,
        userId: auth.currentUser.uid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        clauseAnalysis: result.clauseAnalysis,
        analyzedAt: result.analyzedAt,
      };
    } else {
      throw new Error(result.error || "Clause analysis failed");
    }
  } catch (error) {
    throw new Error(`Clause analysis failed: ${error.message}`);
  }
};

export default {
  analyzeFairnessById,
  analyzeFairnessText,
  uploadAndAnalyzeFairness,
  getBenchmarkStats,
  getMarketInsights,
  analyzeClauseFairness,
  isAuthenticated,
};
