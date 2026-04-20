const express = require("express");
const router = express.Router();
const SimpleFairnessService = require("../services/simpleFairnessService");

const simpleFairnessService = new SimpleFairnessService();

// Analyze contract fairness
router.post("/analyze-fairness", async (req, res) => {
  try {
    const {
      contractText,
      contractType = "contract",
      jurisdiction = "India",
      userRole = "Consumer",
    } = req.body;

    if (!contractText) {
      return res.status(400).json({
        success: false,
        error: "Contract text is required",
      });
    }

    const fairnessAnalysis = await simpleFairnessService.quickFairnessAnalysis(
      contractText,
      contractType,
      jurisdiction,
      userRole
    );

    res.json({
      success: true,
      fairnessAnalysis,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /analyze-fairness route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Fairness analysis failed",
    });
  }
});

// Analyze document fairness by document ID
router.post("/analyze-document/:id", async (req, res) => {
  try {
    const { id: documentId } = req.params;
    const {
      userId,
      jurisdiction = "India",
      userRole = "Consumer",
      documentDetails,
    } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Document ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!documentDetails || !documentDetails.cloudinaryUrl) {
      return res.status(400).json({
        success: false,
        error: "Document details with Cloudinary URL are required",
      });
    }

    // Import document analysis service
    const {
      analyzeDocumentFromCloudinaryUrl,
    } = require("../services/documentAnalysisService");

    // Contract type detection function
    const determineContractType = (fileName, extractedText) => {
      const fileNameLower = fileName.toLowerCase();
      const textLower = extractedText.toLowerCase();

      if (
        fileNameLower.includes("rental") ||
        fileNameLower.includes("lease") ||
        textLower.includes("rental") ||
        textLower.includes("lease")
      ) {
        return "rental agreement";
      } else if (
        fileNameLower.includes("sale") ||
        fileNameLower.includes("purchase") ||
        textLower.includes("sale") ||
        textLower.includes("purchase")
      ) {
        return "sale agreement";
      } else if (
        fileNameLower.includes("employment") ||
        textLower.includes("employment")
      ) {
        return "employment contract";
      }
      return "contract";
    };

    try {
      let analysisResult = null;
      let extractedText = null;

      // Try Cloudinary analysis first
      try {
        analysisResult = await analyzeDocumentFromCloudinaryUrl(
          documentDetails.cloudinaryUrl,
          documentDetails.fileName,
          userRole,
          jurisdiction
        );

        if (analysisResult.success) {
          extractedText = analysisResult.extractedText;
        }
      } catch (cloudinaryError) {
        console.warn(
          `âš ï¸ [${documentId}] Cloudinary analysis failed:`,
          cloudinaryError.message
        );
      }

      // If Cloudinary failed and we have cached text, use that for fresh analysis
      if (!analysisResult?.success && documentDetails.extractedText) {
        extractedText = documentDetails.extractedText;

        // Create a minimal successful result for consistency
        analysisResult = {
          success: true,
          extractedText: extractedText,
          fileName: documentDetails.fileName,
          analysis: { riskLevel: "unknown" }, // placeholder
        };
      }

      // Debug what's available in documentDetails
      if (!extractedText) {
        // Return a proper error response instead of throwing
        return res.status(400).json({
          success: false,
          error:
            "Document text not available. Please re-upload the document or contact support if Cloudinary access issues persist.",
          documentId: documentId,
          hasFairnessAnalysis: false,
          needsReupload: true,
          cloudinaryError: "Unauthorized",
          suggestion:
            "Try uploading the document again to generate fresh analysis",
        });
      }

      // ALWAYS perform fresh fairness analysis regardless of source
      const fairnessAnalysis =
        await simpleFairnessService.quickFairnessAnalysis(
          extractedText,
          determineContractType(documentDetails.fileName, extractedText) ||
            "contract",
          jurisdiction,
          userRole
        );

      if (!fairnessAnalysis) {
        throw new Error("SimpleFairnessService returned no analysis");
      }

      const responseData = {
        success: true,
        fairnessAnalysis,
        documentId,
        contractType:
          analysisResult?.contractType ||
          determineContractType(documentDetails.fileName, extractedText),
        jurisdiction,
        userRole,
        analyzedAt: new Date().toISOString(),
        extractedTextLength: extractedText.length,
        realAnalysis: true,
        analysisSource: analysisResult?.success ? "cloudinary" : "cached",
        hasFairnessAnalysis: true,
      };

      res.json(responseData);
    } catch (analysisError) {
      console.error("Document analysis error:", analysisError);

      // Fall back to mock analysis if real analysis fails
      const mockAnalysis = generateMockFairnessAnalysis(
        jurisdiction,
        userRole,
        documentDetails.fileName
      );

      res.json({
        success: true,
        fairnessAnalysis: mockAnalysis,
        documentId,
        jurisdiction,
        userRole,
        analyzedAt: new Date().toISOString(),
        note: `Analysis completed with limited data. Real analysis failed: ${analysisError.message}`,
        fallbackUsed: true,
      });
    }
  } catch (error) {
    console.error("Error in /analyze-document route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Document fairness analysis failed",
    });
  }
});

// Helper function to generate mock fairness analysis
function generateMockFairnessAnalysis(jurisdiction, userRole, fileName) {
  // Create document-specific variations based on filename
  const fileNameLower = fileName ? fileName.toLowerCase() : "";
  let contractType = "contract";
  let specificFindings = [];
  let specificMetrics = {};

  // Determine contract type and customize analysis
  if (fileNameLower.includes("rent") || fileNameLower.includes("lease")) {
    contractType = "rental agreement";
    specificFindings = [
      {
        riskLevel: "CAUTION",
        explanation:
          "Security deposit amount appears high compared to local standards",
        percentile: "75th percentile",
        recommendation: "Consider negotiating for a lower security deposit",
      },
      {
        riskLevel: "STANDARD",
        explanation: "Rent payment terms are within normal range",
        percentile: "50th percentile",
        recommendation: "Terms are reasonable",
      },
    ];
    specificMetrics = {
      securityDeposit: {
        contractValue: "3 months rent",
        marketMedian: "2 months rent",
        marketRange: "1-3 months",
        percentile: "75th percentile",
        assessment: "CAUTION - Above average",
      },
    };
  } else if (
    fileNameLower.includes("employ") ||
    fileNameLower.includes("job")
  ) {
    contractType = "employment contract";
    specificFindings = [
      {
        riskLevel: "STANDARD",
        explanation: "Notice period is standard for the industry",
        percentile: "50th percentile",
        recommendation: "Terms are balanced",
      },
      {
        riskLevel: "HIGH_RISK",
        explanation: "Non-compete clause is unusually restrictive",
        percentile: "90th percentile",
        recommendation: "Request modification of non-compete terms",
      },
    ];
    specificMetrics = {
      noticePeriod: {
        contractValue: "30 days",
        marketMedian: "30 days",
        marketRange: "15-60 days",
        percentile: "50th percentile",
        assessment: "STANDARD - Market average",
      },
    };
  }

  return {
    overallFairnessScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
    marketPosition: "average",
    overallAssessment: `This ${contractType} shows mixed terms for the ${jurisdiction} market. While some clauses favor the ${userRole.toLowerCase()}, others may need negotiation for better balance.`,

    keyFindings:
      specificFindings.length > 0
        ? specificFindings
        : [
            {
              riskLevel: "CAUTION",
              explanation: `Some terms in this ${contractType} may not favor the ${userRole.toLowerCase()}`,
              percentile: `${Math.floor(Math.random() * 20) + 70}th percentile`,
              recommendation:
                "Review highlighted clauses for potential negotiation",
            },
          ],

    benchmarkMetrics:
      Object.keys(specificMetrics).length > 0
        ? specificMetrics
        : {
            generalTerms: {
              contractValue: "Mixed",
              marketMedian: "Balanced",
              marketRange: "Varies",
              percentile: "60th percentile",
              assessment: "STANDARD - Needs review",
            },
          },

    negotiationOpportunities: [
      {
        priority: "medium",
        likelihood: "medium",
        currentTerm: "Current terms may be improved",
        suggestedTerm: "Seek more balanced language",
        justification: `Based on ${jurisdiction} market standards for ${contractType}s`,
      },
    ],
  };
}

// Quick clause fairness check
router.post("/analyze-clause", async (req, res) => {
  try {
    const {
      clauseText,
      contractType = "contract",
      jurisdiction = "India",
    } = req.body;

    if (!clauseText) {
      return res.status(400).json({
        success: false,
        error: "Clause text is required",
      });
    }

    const clauseAnalysis = await fairnessBenchmarkService.analyzeClause(
      clauseText,
      contractType,
      jurisdiction
    );

    res.json({
      success: true,
      clauseAnalysis,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /analyze-clause route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Clause analysis failed",
    });
  }
});

// Get market insights
router.get("/market-insights", async (req, res) => {
  try {
    const { contractType = "rental agreement", jurisdiction = "India" } =
      req.query;

    const marketInsights = await fairnessBenchmarkService.getMarketInsights(
      contractType,
      jurisdiction
    );

    res.json({
      success: true,
      marketInsights,
      contractType,
      jurisdiction,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /market-insights route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get market insights",
    });
  }
});

// Get benchmark statistics (mock data for now)
router.get("/benchmark-stats", async (req, res) => {
  try {
    const { jurisdiction = "India", contractType = "all" } = req.query;

    // Mock benchmark statistics - in a real implementation,
    // this would come from your database of analyzed contracts
    const mockStats = {
      totalContracts: 15420,
      jurisdictions: 23,
      contractTypes: {
        "rental agreement": 8930,
        "employment contract": 4200,
        "service agreement": 2290,
        "purchase agreement": 1850,
        "license agreement": 1150,
      },
      lastUpdated: new Date().toISOString(),
      popularMetrics: {
        securityDeposit: {
          median: "2 months",
          range: "1-3 months",
          outliers: "Above 3 months (5% of contracts)",
        },
        rentIncrease: {
          median: "5% annually",
          range: "3-7% annually",
          outliers: "Above 8% annually (10% of contracts)",
        },
        noticePeriod: {
          median: "30 days",
          range: "15-60 days",
          outliers: "Below 15 days or above 90 days (8% of contracts)",
        },
      },
    };

    // Filter by contract type if specified
    if (contractType !== "all") {
      mockStats.filteredCount = mockStats.contractTypes[contractType] || 0;
    }

    res.json({
      success: true,
      stats: mockStats,
      jurisdiction,
      contractType,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /benchmark-stats route:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get benchmark statistics",
    });
  }
});

module.exports = router;
