const GroqService = require("./groqService");

class SimpleFairnessService {
  constructor() {
    this.groqService = new GroqService();
  }

  /**
   * Quick fairness analysis - much faster than full benchmark
   * @param {string} contractText - The contract text (limited for speed)
   * @param {string} contractType - Type of contract
   * @param {string} jurisdiction - Location/jurisdiction
   * @param {string} userRole - User's role
   * @returns {Object} Simplified fairness analysis
   */
  async quickFairnessAnalysis(
    contractText,
    contractType = "contract",
    jurisdiction = "India",
    userRole = "Consumer"
  ) {
    const fairnessStart = Date.now();
    const fairnessId = Math.random().toString(36).substr(2, 9);

    if (!this.groqService || !this.groqService.client) {
      console.error(`âŒ [${fairnessId}] Groq AI not properly initialized`);
      return this.getFallbackAnalysis();
    }

    // Limit text length for faster processing (key optimization!)
    const limitedText =
      contractText.substring(0, 1000) +
      (contractText.length > 1000 ? "..." : "");

    const promptStart = Date.now();

    // Enhanced prompt with strict JSON-only requirement
    const prompt = `Analyze this ${contractType} in ${jurisdiction} for ${userRole}. Return ONLY valid JSON, no explanation text.

Contract text: "${limitedText}"

Required JSON format:
{
  "score": 75,
  "risk": "LOW|MEDIUM|HIGH", 
  "summary": "Brief assessment with market context",
  "issues": ["specific clause vs market standard"],
  "positives": ["clauses that are better than market"],
  "marketComparisons": [
    {
      "clause": "payment terms",
      "contractValue": "30 days", 
      "marketStandard": "15-45 days",
      "assessment": "FAVORABLE|STANDARD|UNFAVORABLE",
      "explanation": "Brief comparison explanation"
    }
  ],
  "recommendation": "ACCEPT|NEGOTIATE|AVOID"
}`;

    const promptTime = Date.now() - promptStart;

    try {
      const apiStart = Date.now();

      const analysisText = await this.groqService.chat(prompt);

      const apiTime = Date.now() - apiStart;

      const totalTime = Date.now() - fairnessStart;

      return this.parseQuickResponse(analysisText);
    } catch (error) {
      const totalTime = Date.now() - fairnessStart;
      console.error(
        `âŒ [${fairnessId}] Quick analysis failed after ${totalTime}ms:`,
        error.message
      );
      console.error(`ðŸ“‹ [${fairnessId}] Full error details:`, error);
      console.error(`ðŸ” [${fairnessId}] Error type:`, error.constructor.name);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Parse quick analysis response
   */
  parseQuickResponse(responseText) {
    try {
      // Try to extract JSON from the response
      let jsonMatch = null;

      // Method 1: Look for JSON code blocks
      const jsonBlockMatch = responseText.match(
        /```json\s*\n?([\s\S]*?)\n?```/
      );
      if (jsonBlockMatch) {
        jsonMatch = jsonBlockMatch[1].trim();
      }

      // Method 2: Look for standalone JSON object
      if (!jsonMatch) {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          jsonMatch = jsonObjectMatch[0].trim();
        }
      }

      // Method 3: Fallback - try to find JSON between braces
      if (!jsonMatch) {
        const startIndex = responseText.indexOf("{");
        const endIndex = responseText.lastIndexOf("}");
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonMatch = responseText.substring(startIndex, endIndex + 1).trim();
        }
      }

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      const analysis = JSON.parse(jsonMatch);

      return {
        overallFairnessScore:
          analysis.score || analysis.overallFairnessScore || 70,
        riskLevel: analysis.risk || analysis.riskLevel || "MEDIUM",
        summary: analysis.summary || "Quick analysis completed",
        keyIssues: analysis.issues || analysis.keyIssues || [],
        positives: analysis.positives || ["Document processed successfully"],
        marketComparisons: analysis.marketComparisons || [],
        recommendation: analysis.recommendation || "REVIEW_CAREFULLY",
        analysisType: "quick",
      };
    } catch (error) {
      console.error("âŒ Error parsing quick fairness response:", error.message);
      console.error(
        "ðŸ“„ First 1000 chars of failed response:",
        responseText.substring(0, 1000)
      );
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Fallback analysis if AI fails
   */
  getFallbackAnalysis() {
    return {
      overallFairnessScore: 70,
      riskLevel: "MEDIUM",
      summary:
        "Contract uploaded successfully. Market comparison analysis pending.",
      keyIssues: ["Manual review recommended for detailed market comparison"],
      positives: ["Document processed successfully"],
      marketComparisons: [
        {
          clause: "Payment Terms",
          contractValue: "30 days",
          marketStandard: "15-30 days",
          assessment: "STANDARD",
          explanation: "Payment terms align with market norms",
        },
      ],
      recommendation: "REVIEW_CAREFULLY",
      analysisType: "fallback",
    };
  }
}

module.exports = SimpleFairnessService;
