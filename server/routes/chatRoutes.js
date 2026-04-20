const express = require("express");
const router = express.Router();
const GroqService = require("../services/groqService");
const WhatIfSimulatorService = require("../services/whatIfSimulatorService");
const {
  analyzeDocumentFromCloudinaryUrl,
  analyzeDocumentFromBuffer,
} = require("../services/documentAnalysisService");
const cloudinary = require("../config/cloudinary");

const groqService = new GroqService();
const whatIfSimulator = new WhatIfSimulatorService();

// @route   POST /api/chat/message
// @desc    Send message to AI chat
// @access  Public
router.post("/message", async (req, res) => {
  try {
    const { message, context, documentContent } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }


    // Create a chat-optimized prompt
    const chatPrompt = `
You are an expert AI assistant specializing in legal document analysis, compliance, and business guidance. 
You are helpful, professional, and provide detailed, actionable advice.

Context: ${context || "General legal and business assistance"}
${documentContent ? `Document Content: ${documentContent}` : ""}

User Question: ${message}

Please provide a comprehensive, well-structured response that:
1. Addresses the user's specific question
2. Provides practical, actionable advice
3. Uses clear formatting with headings, bullet points, or numbered lists when appropriate
4. Includes relevant legal or business insights
5. Is professional but conversational

Response:`;

    // Use the Groq model for chat
    if (!groqService.client) {
      throw new Error("Groq AI not properly initialized");
    }

    const aiResponse = await groqService.chat(chatPrompt);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat message:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message",
    });
  }
});

// @route   POST /api/chat/analyze-document
// @desc    Analyze uploaded document in chat context
// @access  Public
router.post("/analyze-document", async (req, res) => {
  try {
    const { documentText, fileName, userPrompt } = req.body;

    if (!documentText) {
      return res.status(400).json({
        success: false,
        error: "Document text is required",
      });
    }


    // Use the existing analyzeDocument method but format for chat
    const analysis = await groqService.analyzeDocument(
      documentText,
      userPrompt || "legal document"
    );

    // Format the analysis for chat display
    let chatResponse = `## Document Analysis: ${
      fileName || "Your Document"
    }\n\n`;

    chatResponse += `**Document Type**: ${
      analysis.documentType || "Unknown"
    }\n\n`;

    if (analysis.summary) {
      chatResponse += `### Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.riskLevel) {
      const riskEmoji =
        analysis.riskLevel.toLowerCase() === "high"
          ? "ðŸ”´"
          : analysis.riskLevel.toLowerCase() === "medium"
          ? "ðŸŸ¡"
          : "ðŸŸ¢";
      chatResponse += `### Risk Level: ${riskEmoji} ${analysis.riskLevel.toUpperCase()}\n\n`;
    }

    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      chatResponse += `### Key Points\n`;
      analysis.keyPoints.forEach((point, index) => {
        chatResponse += `${index + 1}. ${point}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.clauses && analysis.clauses.length > 0) {
      chatResponse += `### Key Clauses Analysis\n`;
      analysis.clauses.slice(0, 3).forEach((clause, index) => {
        chatResponse += `**Clause ${index + 1}**: ${clause.text.substring(
          0,
          100
        )}...\n`;
        chatResponse += `- **Risk**: ${clause.riskLevel || "Medium"}\n`;
        chatResponse += `- **Type**: ${clause.type || "General"}\n\n`;
      });
    }

    if (analysis.recommendations && analysis.recommendations.length > 0) {
      chatResponse += `### Recommendations\n`;
      analysis.recommendations.forEach((rec, index) => {
        chatResponse += `${index + 1}. ${rec}\n`;
      });
      chatResponse += `\n`;
    }

    chatResponse += `\n**Would you like me to dive deeper into any specific aspect of this analysis?**`;

    res.json({
      success: true,
      response: chatResponse,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing document in chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document",
    });
  }
});

// @route   GET /api/chat/documents/:userId
// @desc    Get user's uploaded documents from Cloudinary
// @access  Public
router.get("/documents/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { max_results = 50 } = req.query;


    try {
      // Search for documents in Cloudinary by user ID
      // Documents are stored as: lexiguard-documents/{userId}_{timestamp}_{filename}

      let allDocuments = [];

      // Try search API first - use broader search
      try {
        const searchResult = await cloudinary.search
          .expression(`folder:lexiguard-documents`)
          .max_results(parseInt(max_results))
          .execute();


        // Filter by userId from the results
        const userDocuments = searchResult.resources.filter((resource) => {
          const publicIdParts = resource.public_id.split("/").pop();
          return publicIdParts.startsWith(`${userId}_`);
        });

        allDocuments = [...allDocuments, ...userDocuments];
      } catch (searchError) {
      }

      // Also try resources API with raw type (for PDFs)
      try {
        const rawResources = await cloudinary.api.resources({
          type: "upload",
          prefix: `lexiguard-documents/${userId}_`,
          max_results: parseInt(max_results),
          resource_type: "raw",
        });

        allDocuments = [...allDocuments, ...(rawResources.resources || [])];
      } catch (rawError) {
      }

      // Try with image resources too
      try {
        const imageResources = await cloudinary.api.resources({
          type: "upload",
          prefix: `lexiguard-documents/${userId}_`,
          max_results: parseInt(max_results),
          resource_type: "image",
        });

        allDocuments = [...allDocuments, ...(imageResources.resources || [])];
      } catch (imageError) {
      }

      // Remove duplicates based on public_id
      const uniqueDocuments = allDocuments.filter(
        (doc, index, array) =>
          array.findIndex((d) => d.public_id === doc.public_id) === index
      );

      const documents = uniqueDocuments.map((resource) => {
        // Extract filename from public_id format: userId_timestamp_filename
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const filename = filenameParts.slice(2).join("_"); // Skip userId and timestamp

        return {
          public_id: resource.public_id,
          fileName: filename || resource.display_name || resource.public_id,
          originalName: resource.display_name || filename,
          url: resource.secure_url,
          uploadedAt: resource.created_at,
          fileSize: resource.bytes,
          format: resource.format,
          resourceType: resource.resource_type,
          userId: userId,
        };
      });

      res.json({
        success: true,
        documents,
        total: documents.length,
      });
    } catch (searchError) {

      // Fallback to resources API if search fails
      const searchResult = await cloudinary.api.resources({
        type: "upload",
        prefix: `lexiguard-documents/${userId}_`,
        max_results: parseInt(max_results),
        resource_type: "auto",
      });


      const documents = searchResult.resources.map((resource) => {
        // Extract filename from public_id format: lexiguard-documents/userId_timestamp_filename
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const filename = filenameParts.slice(2).join("_"); // Skip userId and timestamp

        return {
          public_id: resource.public_id,
          fileName: filename || resource.display_name || resource.public_id,
          originalName: resource.display_name || filename,
          url: resource.secure_url,
          uploadedAt: resource.created_at,
          fileSize: resource.bytes,
          format: resource.format,
          resourceType: resource.resource_type,
          userId: userId,
        };
      });

      res.json({
        success: true,
        documents,
        total: documents.length,
      });
    }
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch documents",
    });
  }
});

// @route   GET /api/chat/debug/all-documents
// @desc    Debug endpoint to see all documents in Cloudinary
// @access  Public
router.get("/debug/all-documents", async (req, res) => {
  try {

    // Try to get basic cloud info first
    try {
      const cloudInfo = await cloudinary.api.usage();
    } catch (usageError) {
    }

    // Get all resources without prefix first to see if API works
    try {
      const allResources = await cloudinary.api.resources({
        type: "upload",
        max_results: 10,
        resource_type: "image", // Try with specific resource type first
      });


      // Now try with all resource types
      const allResourcesAuto = await cloudinary.api.resources({
        type: "upload",
        max_results: 10,
        resource_type: "auto",
      });


      // Now try with prefix
      const filteredResources = await cloudinary.api.resources({
        type: "upload",
        prefix: "lexiguard-documents/",
        max_results: 100,
        resource_type: "image", // Start with image type
      });

      // Also try with raw resource type for documents
      const rawResources = await cloudinary.api.resources({
        type: "upload",
        prefix: "lexiguard-documents/",
        max_results: 100,
        resource_type: "raw",
      });


      // Combine both resource types
      const allDocuments = [
        ...filteredResources.resources,
        ...rawResources.resources,
      ];

      const formattedResources = allDocuments.map((resource) => {
        // Parse the public_id to extract user info
        const publicIdParts = resource.public_id.split("/").pop(); // Remove folder prefix
        const filenameParts = publicIdParts.split("_");
        const userId = filenameParts[0];
        const timestamp = filenameParts[1];
        const filename = filenameParts.slice(2).join("_");

        return {
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          format: resource.format,
          resource_type: resource.resource_type,
          created_at: resource.created_at,
          bytes: resource.bytes,
          parsed: {
            userId: userId,
            timestamp: timestamp,
            filename: filename,
          },
        };
      });

      res.json({
        success: true,
        total: allDocuments.length,
        totalAllResources: allResources.resources.length,
        totalAutoResources: allResourcesAuto.resources.length,
        resources: formattedResources,
        debug: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiWorking: true,
          imageResources: filteredResources.resources.length,
          rawResources: rawResources.resources.length,
        },
      });
    } catch (apiError) {
      console.error("API Resources error:", apiError);
      res.status(500).json({
        success: false,
        error: apiError.message,
        details: apiError.toString(),
        debug: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          errorType: "API_RESOURCES_ERROR",
        },
      });
    }
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
      debug: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        errorType: "GENERAL_ERROR",
      },
    });
  }
});

// @route   GET /api/chat/test/all-docs
// @desc    Simple test to see all documents (for debugging)
// @access  Public
router.get("/test/all-docs", async (req, res) => {
  try {

    const searchResult = await cloudinary.search
      .expression("folder:lexiguard-documents")
      .max_results(20)
      .execute();


    const documents = searchResult.resources.map((resource) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      created_at: resource.created_at,
      resource_type: resource.resource_type,
      // Parse user ID from public_id
      parsedUserId: resource.public_id.split("/").pop().split("_")[0],
    }));

    res.json({
      success: true,
      total: searchResult.total_count,
      documents: documents,
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/chat/test-cloudinary
// @desc    Simple test to verify Cloudinary connection
// @access  Public
router.get("/test-cloudinary", async (req, res) => {
  try {

    // Simple ping test
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: "Cloudinary connection successful",
      result: result,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        message: error.message,
        http_code: error.http_code,
      },
    });
  }
});

// @route   POST /api/chat/analyze-cloudinary-document
// @desc    Analyze specific document from Cloudinary in chat
// @access  Public
router.post("/analyze-cloudinary-document", async (req, res) => {
  try {
    const { documentUrl, fileName, userId, userMessage } = req.body;

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required",
      });
    }


    // Use the existing service to analyze document from Cloudinary URL
    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      "General" // Default role
    );

    if (!analysisResult.success) {
      throw new Error(analysisResult.error);
    }

    const analysis = analysisResult.analysis;

    // Format the analysis for chat display
    let chatResponse = `## ðŸ“„ Analysis Complete: ${fileName}\n\n`;

    if (analysis.summary) {
      chatResponse += `### ðŸ“‹ Summary\n${analysis.summary}\n\n`;
    }

    if (analysis.documentType) {
      chatResponse += `**ðŸ“‘ Document Type**: ${analysis.documentType}\n\n`;
    }

    if (analysis.riskLevel) {
      const riskEmoji =
        analysis.riskLevel.toLowerCase() === "high"
          ? "ðŸ”´"
          : analysis.riskLevel.toLowerCase() === "medium"
          ? "ðŸŸ¡"
          : "ðŸŸ¢";
      chatResponse += `### âš ï¸ Risk Assessment: ${riskEmoji} ${analysis.riskLevel.toUpperCase()}\n\n`;
    }

    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      chatResponse += `### ðŸ” Key Points\n`;
      analysis.keyPoints.forEach((point, index) => {
        chatResponse += `${index + 1}. ${point}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.clauses && analysis.clauses.length > 0) {
      chatResponse += `### ðŸ“œ Key Clauses Analysis (${analysis.clauses.length} total)\n`;
      analysis.clauses.slice(0, 5).forEach((clause, index) => {
        const riskColor =
          clause.riskLevel?.toLowerCase() === "high"
            ? "ðŸ”´"
            : clause.riskLevel?.toLowerCase() === "medium"
            ? "ðŸŸ¡"
            : "ðŸŸ¢";
        chatResponse += `**${index + 1}. ${
          clause.type?.replace("_", " ").toUpperCase() || "GENERAL"
        } CLAUSE** ${riskColor}\n`;
        chatResponse += `"${
          clause.text.length > 120
            ? clause.text.substring(0, 120) + "..."
            : clause.text
        }"\n`;
        if (clause.explanation) {
          chatResponse += `ðŸ’¡ *${clause.explanation}*\n`;
        }
        chatResponse += `\n`;
      });

      if (analysis.clauses.length > 5) {
        chatResponse += `*...and ${
          analysis.clauses.length - 5
        } more clauses analyzed*\n\n`;
      }
    }

    if (analysis.recommendations && analysis.recommendations.length > 0) {
      chatResponse += `### ðŸ’¡ Recommendations\n`;
      analysis.recommendations.forEach((rec, index) => {
        chatResponse += `${index + 1}. ${rec}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.riskFactors && analysis.riskFactors.length > 0) {
      chatResponse += `### âš ï¸ Risk Factors\n`;
      analysis.riskFactors.forEach((risk, index) => {
        chatResponse += `â€¢ ${risk}\n`;
      });
      chatResponse += `\n`;
    }

    if (analysis.overallScore) {
      const scoreEmoji =
        analysis.overallScore >= 80
          ? "ðŸŸ¢"
          : analysis.overallScore >= 60
          ? "ðŸŸ¡"
          : "ðŸ”´";
      chatResponse += `### ðŸ“Š Overall Score: ${scoreEmoji} ${analysis.overallScore}/100\n\n`;
    }

    // Add contextual response based on user message
    if (userMessage) {
      chatResponse += `---\n\n**Regarding your question**: "${userMessage}"\n\n`;

      // Use Gemini to provide contextual response
      const contextualPrompt = `
Based on this document analysis, please answer the user's specific question: "${userMessage}"

Document: ${fileName}
Summary: ${analysis.summary || "Not available"}
Risk Level: ${analysis.riskLevel || "Not available"}
Key Points: ${analysis.keyPoints?.join(", ") || "Not available"}

Provide a specific, actionable response to their question based on this document's content.
`;

      try {
        const contextualResponse = await groqService.chat(
          userMessage
        );
        chatResponse += contextualResponse + "\n\n";
      } catch (error) {
        console.error("Error generating contextual response:", error);
      }
    }

    chatResponse += `\n**ðŸ’¬ Feel free to ask me specific questions about any aspect of this document!**`;

    res.json({
      success: true,
      response: chatResponse,
      analysis: analysis,
      document: {
        fileName,
        url: documentUrl,
        analyzedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing Cloudinary document:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze document",
    });
  }
});

// @route   POST /api/chat/message-with-document
// @desc    Send message with specific document context
// @access  Public
router.post("/message-with-document", async (req, res) => {
  try {
    const {
      message,
      documentUrl,
      fileName,
      userId,
      jurisdiction = "India",
      userRole = "Consumer",
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }


    let documentContent = "";
    let documentAnalysis = null;

    // If document URL is provided, fetch and analyze it
    if (documentUrl && fileName) {
      try {

        const analysisResult = await analyzeDocumentFromCloudinaryUrl(
          documentUrl,
          fileName,
          userRole || "General"
        );

        if (analysisResult.success) {
          documentAnalysis = analysisResult.analysis;
          documentContent = analysisResult.extractedText || "";

        } else {
          console.error("Failed to analyze document:", analysisResult.error);
          documentContent = `[Error extracting document content: ${analysisResult.error}]`;
        }
      } catch (error) {
        console.error("Error fetching document for context:", error);
        documentContent = `[Error accessing document: ${error.message}]`;
      }
    } else {
    }

    // Check if this is a "What If" scenario question
    const isScenarioQuestion = whatIfSimulator.isScenarioQuestion(message);

    if (isScenarioQuestion && documentContent && documentAnalysis) {

      try {
        // Use the What-If Scenario Simulator
        const scenarioAnalysis = await whatIfSimulator.analyzeScenario(
          message,
          documentContent,
          documentAnalysis,
          jurisdiction,
          userRole
        );

        // Format the response for chat
        const formattedResponse =
          whatIfSimulator.formatScenarioForChat(scenarioAnalysis);

        res.json({
          success: true,
          response: formattedResponse,
          responseType: "scenario_analysis",
          scenarioAnalysis: scenarioAnalysis,
          documentContext: {
            fileName,
            documentType: documentAnalysis.documentType,
            riskLevel: documentAnalysis.riskLevel,
            hasDocumentContext: true,
            isScenarioQuestion: true,
          },
          timestamp: new Date().toISOString(),
        });

        return; // Exit early since we handled the scenario
      } catch (scenarioError) {
        console.error(
          "Scenario analysis failed, falling back to regular chat:",
          scenarioError
        );
        // Fall through to regular chat handling
      }
    }

    // Regular chat handling (non-scenario or fallback)
    const chatPrompt = `
You are an expert AI assistant specializing in legal document analysis, compliance, and business guidance.
You are helpful, professional, and provide detailed, actionable advice.

${
  documentAnalysis
    ? `
DOCUMENT CONTEXT:
- Document: ${fileName}
- Type: ${documentAnalysis.documentType || "Unknown"}
- Risk Level: ${documentAnalysis.riskLevel || "Unknown"}
- Summary: ${documentAnalysis.summary || "Not available"}
- Key Points: ${documentAnalysis.keyPoints?.join("; ") || "Not available"}

EXTRACTED DOCUMENT TEXT:
${documentContent.substring(0, 4000)}${
        documentContent.length > 4000
          ? "\n\n[Document continues beyond this excerpt...]"
          : ""
      }

TOTAL DOCUMENT LENGTH: ${documentContent.length} characters
`
    : "Context: General legal and business assistance"
}

User Question: ${message}

${
  isScenarioQuestion
    ? `
IMPORTANT: The user is asking a "What If" scenario question. Please provide a CONCISE response (max 300 words):
1. Direct answer to their scenario (1-2 sentences)
2. Key clauses that apply (if document available)
3. 2-3 main consequences or steps
4. 2-3 practical actions they should take
5. Overall risk level (low/medium/high)

Keep it short and focused - no lengthy explanations.
`
    : ""
}

Please provide a ${
      isScenarioQuestion ? "concise, focused" : "comprehensive, well-structured"
    } response that:
1. Addresses the user's specific question
2. ${
      isScenarioQuestion
        ? "Stays under 300 words"
        : "References the document content when relevant"
    }
3. Provides practical, actionable advice
4. ${
      isScenarioQuestion
        ? "Uses brief bullet points"
        : "Uses clear formatting with headings, bullet points, or numbered lists when appropriate"
    }
5. ${
      isScenarioQuestion
        ? "Focuses on key risks and actions"
        : "Includes relevant legal or business insights based on the document"
    }
6. Is professional but conversational

Response:`;

    // Use the Groq model for enhanced response
    const aiResponse = await groqService.chat(chatPrompt);

    res.json({
      success: true,
      response: aiResponse,
      responseType: isScenarioQuestion ? "scenario_fallback" : "regular_chat",
      documentContext: documentAnalysis
        ? {
            fileName,
            documentType: documentAnalysis.documentType,
            riskLevel: documentAnalysis.riskLevel,
            hasDocumentContext: true,
            isScenarioQuestion: isScenarioQuestion,
          }
        : { hasDocumentContext: false, isScenarioQuestion: isScenarioQuestion },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat message with document:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message",
    });
  }
});

// @route   POST /api/chat/extract-text
// @desc    Extract text from a document for testing
// @access  Public
router.post("/extract-text", async (req, res) => {
  try {
    const { documentUrl, fileName } = req.body;

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required",
      });
    }


    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      "General"
    );

    if (analysisResult.success) {
      res.json({
        success: true,
        fileName: fileName,
        textLength: analysisResult.extractedText.length,
        extractedText: analysisResult.extractedText,
        preview: analysisResult.extractedText.substring(0, 500),
        analysis: analysisResult.analysis,
      });
    } else {
      res.status(500).json({
        success: false,
        error: analysisResult.error,
        fileName: fileName,
      });
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/chat/what-if-scenario
// @desc    Analyze a specific What-If scenario against a document
// @access  Public
router.post("/what-if-scenario", async (req, res) => {
  try {
    const {
      scenarioQuestion,
      documentUrl,
      fileName,
      userId,
      jurisdiction = "India",
      userRole = "Consumer",
    } = req.body;

    if (!scenarioQuestion) {
      return res.status(400).json({
        success: false,
        error: "Scenario question is required",
      });
    }

    if (!documentUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: "Document URL and file name are required for scenario analysis",
      });
    }


    // First, extract document content and get analysis
    const analysisResult = await analyzeDocumentFromCloudinaryUrl(
      documentUrl,
      fileName,
      userRole
    );

    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: `Failed to analyze document: ${analysisResult.error}`,
      });
    }

    const documentContent = analysisResult.extractedText;
    const documentAnalysis = analysisResult.analysis;

    // Perform scenario analysis
    const scenarioAnalysis = await whatIfSimulator.analyzeScenario(
      scenarioQuestion,
      documentContent,
      documentAnalysis,
      jurisdiction,
      userRole
    );

    // Format response for chat
    const formattedResponse =
      whatIfSimulator.formatScenarioForChat(scenarioAnalysis);

    res.json({
      success: true,
      response: formattedResponse,
      scenarioAnalysis: scenarioAnalysis,
      documentContext: {
        fileName,
        documentType: documentAnalysis.documentType,
        riskLevel: documentAnalysis.riskLevel,
        jurisdiction,
        userRole,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in What-If scenario analysis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze What-If scenario",
    });
  }
});

// @route   GET /api/chat/what-if-examples
// @desc    Get example What-If scenario questions based on document type
// @access  Public
router.get("/what-if-examples", async (req, res) => {
  try {
    const { documentType = "contract", jurisdiction = "India" } = req.query;


    const examples = whatIfSimulator.generateExampleScenarios(
      documentType,
      jurisdiction
    );

    res.json({
      success: true,
      documentType,
      jurisdiction,
      examples,
      helpText: {
        title: "What-If Scenario Simulator",
        description:
          "Ask hypothetical questions to understand the real-world consequences of your contract",
        instructions: [
          "Start your question with 'What if...' or 'What happens if...'",
          "Be specific about the situation you're concerned about",
          "Include relevant details like timeframes or amounts",
          "Ask about both best-case and worst-case scenarios",
        ],
        benefits: [
          "Predict consequences before they happen",
          "Identify hidden risks in your contract",
          "Understand your rights and obligations",
          "Get strategic advice for negotiation",
          "Find ambiguous language that needs clarification",
        ],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting What-If examples:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get What-If examples",
    });
  }
});

// @route   POST /api/chat/multilingual-summary
// @desc    Generate multilingual document summary
// @access  Public
router.post("/multilingual-summary", async (req, res) => {
  try {
    const { documentContent, fileName, language, summaryType } = req.body;

    if (!documentContent) {
      return res.status(400).json({
        success: false,
        error: "Document content is required",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        error: "Language selection is required",
      });
    }


    // Language-specific instructions
    const languageInstructions = {
      english: "Provide the summary in clear, professional English",
      spanish: "Proporciona el resumen en espaÃ±ol claro y profesional",
      french: "Fournissez le rÃ©sumÃ© en franÃ§ais clair et professionnel", 
      german: "Erstellen Sie die Zusammenfassung auf klarem, professionellem Deutsch",
      hindi: "à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤”à¤° à¤µà¥à¤¯à¤¾à¤µà¤¸à¤¾à¤¯à¤¿à¤• à¤¹à¤¿à¤‚à¤¦à¥€ à¤®à¥‡à¤‚ à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤ªà¥à¤°à¤¦à¤¾à¤¨ à¤•à¤°à¥‡à¤‚",
      marathi: "à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤†à¤£à¤¿ à¤µà¥à¤¯à¤¾à¤µà¤¸à¤¾à¤¯à¤¿à¤• à¤®à¤°à¤¾à¤ à¥€à¤¤ à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤¦à¥à¤¯à¤¾",
      gujarati: "àª¸à«àªªàª·à«àªŸ àª…àª¨à«‡ àªµà«àª¯àª¾àªµàª¸àª¾àª¯àª¿àª• àª—à«àªœàª°àª¾àª¤à«€àª®àª¾àª‚ àª¸àª¾àª°àª¾àª‚àª¶ àª†àªªà«‹",
      tamil: "à®¤à¯†à®³à®¿à®µà®¾à®© à®®à®±à¯à®±à¯à®®à¯ à®¤à¯Šà®´à®¿à®²à¯à®®à¯à®±à¯ˆ à®¤à®®à®¿à®´à®¿à®²à¯ à®šà¯à®°à¯à®•à¯à®•à®®à¯ à®µà®´à®™à¯à®•à®µà¯à®®à¯",
      telugu: "à°¸à±à°ªà°·à±à°Ÿà°®à±ˆà°¨ à°®à°°à°¿à°¯à± à°µà±ƒà°¤à±à°¤à°¿à°ªà°°à°®à±ˆà°¨ à°¤à±†à°²à±à°—à±à°²à±‹ à°¸à°¾à°°à°¾à°‚à°¶à°‚ à°…à°‚à°¦à°¿à°‚à°šà°‚à°¡à°¿",
      kannada: "à²¸à³à²ªà²·à³à²Ÿ à²®à²¤à³à²¤à³ à²µà³ƒà²¤à³à²¤à²¿à²ªà²° à²•à²¨à³à²¨à²¡à²¦à²²à³à²²à²¿ à²¸à²¾à²°à²¾à²‚à²¶à²µà²¨à³à²¨à³ à²’à²¦à²—à²¿à²¸à²¿",
      bengali: "à¦¸à§à¦ªà¦·à§à¦Ÿ à¦à¦¬à¦‚ à¦ªà§‡à¦¶à¦¾à¦¦à¦¾à¦° à¦¬à¦¾à¦‚à¦²à¦¾à¦¯à¦¼ à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§à¦·à§‡à¦ª à¦ªà§à¦°à¦¦à¦¾à¦¨ à¦•à¦°à§à¦¨",
      punjabi: "à¨¸à¨ªà¨¸à¨¼à¨Ÿ à¨…à¨¤à©‡ à¨ªà©‡à¨¸à¨¼à©‡à¨µà¨° à¨ªà©°à¨œà¨¾à¨¬à©€ à¨µà¨¿à©±à¨š à¨¸à¨¾à¨° à¨ªà©à¨°à¨¦à¨¾à¨¨ à¨•à¨°à©‹",
      urdu: "ÙˆØ§Ø¶Ø­ Ø§ÙˆØ± Ù¾ÛŒØ´Û ÙˆØ±Ø§Ù†Û Ø§Ø±Ø¯Ùˆ Ù…ÛŒÚº Ø®Ù„Ø§ØµÛ ÙØ±Ø§ÛÙ… Ú©Ø±ÛŒÚº",
      chinese: "è¯·ç”¨æ¸…æ™°ä¸“ä¸šçš„ä¸­æ–‡æä¾›æ‘˜è¦",
      japanese: "æ˜Žç¢ºã§å°‚é–€çš„ãªæ—¥æœ¬èªžã§è¦ç´„ã‚’æä¾›ã—ã¦ãã ã•ã„",
      korean: "ëª…í™•í•˜ê³  ì „ë¬¸ì ì¸ í•œêµ­ì–´ë¡œ ìš”ì•½ì„ ì œê³µí•´ì£¼ì„¸ìš”",
      arabic: "Ù‚Ø¯Ù… Ø§Ù„Ù…Ù„Ø®Øµ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„ÙˆØ§Ø¶Ø­Ø© ÙˆØ§Ù„Ù…Ù‡Ù†ÙŠØ©",
      portuguese: "ForneÃ§a o resumo em portuguÃªs claro e profissional",
      italian: "Fornisci il riassunto in italiano chiaro e professionale",
      dutch: "Geef de samenvatting in duidelijk, professioneel Nederlands",
      russian: "ÐŸÑ€ÐµÐ´Ð¾ÑÑ‚Ð°Ð²ÑŒÑ‚Ðµ ÐºÑ€Ð°Ñ‚ÐºÐ¾Ðµ Ð¸Ð·Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð½Ð° ÑÑÐ½Ð¾Ð¼ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¼ Ñ€ÑƒÑÑÐºÐ¾Ð¼ ÑÐ·Ñ‹ÐºÐµ"
    };

    // Summary type templates
    const summaryTemplates = {
      comprehensive: "Provide a comprehensive analysis covering all key aspects",
      executive: "Create an executive summary focusing on high-level insights and strategic implications",
      legal: "Focus on legal implications, risks, and compliance requirements",
      financial: "Emphasize financial aspects, costs, and monetary implications",
      risks: "Concentrate on identifying and analyzing potential risks and mitigation strategies"
    };

    const selectedLanguageInstruction = languageInstructions[language] || languageInstructions.english;
    const selectedTemplate = summaryTemplates[summaryType] || summaryTemplates.comprehensive;

    const multilingualPrompt = `
You are an expert document analyst specializing in multilingual summaries. ${selectedTemplate}.

Document Content:
${documentContent}

Instructions:
1. ${selectedLanguageInstruction}
2. Structure your response with clear headings and subheadings
3. Use bullet points and numbered lists for clarity
4. Include actionable insights and recommendations
5. Highlight key risks, opportunities, and important clauses
6. Maintain professional tone throughout
7. Provide cultural context if relevant for the selected language

Please provide a detailed ${summaryType} summary in ${language}. Use markdown formatting for better readability.

Required Structure:
# Document Summary - ${fileName || 'Document'}

## Overview
[Brief overview in selected language]

## Key Points
[Main findings and insights]

## Important Details
[Detailed analysis]

## Recommendations
[Actionable recommendations]

## Risk Assessment
[Potential risks and concerns]

Summary:`;

    const summary = await groqService.chat(multilingualPrompt);

    res.json({
      success: true,
      summary: summary,
      language: language,
      summaryType: summaryType,
      fileName: fileName,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error generating multilingual summary:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate multilingual summary",
    });
  }
});

module.exports = router;
