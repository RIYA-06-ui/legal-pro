const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn("GEMINI_API_KEY not found in environment variables");
      return;
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  /**
   * Analyze document content for legal risks and insights
   * @param {string} documentText - The text content of the document
   * @param {string} documentType - Type of document (contract, agreement, etc.)
   * @returns {Object} Analysis results
   */
  async analyzeDocument(documentText, documentType = "legal document") {
    if (!this.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const prompt = this.createAnalysisPrompt(documentText, documentType);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error("Error analyzing document with Gemini:", error);
      throw new Error("Failed to analyze document: " + error.message);
    }
  }

  /**
   * Create a comprehensive analysis prompt for legal documents
   * @param {string} documentText - Document content
   * @param {string} documentType - Type of document
   * @returns {string} Formatted prompt
   */
  createAnalysisPrompt(documentText, documentType) {
    return `
You are an expert legal analyst. Please analyze the following ${documentType} and provide a comprehensive, detailed analysis in JSON format.

Document Content:
"${documentText}"

IMPORTANT INSTRUCTIONS:
1. Break down the document into individual clauses, sentences, or provisions - extract as many as possible
2. Analyze each clause thoroughly for legal risks, obligations, and implications
3. Provide detailed explanations and actionable suggestions for each clause
4. Be comprehensive - don't miss any important provisions

Please provide your analysis in the following JSON structure:
{
  "summary": "Brief summary of the document (2-3 sentences)",
  "documentType": "Identified type of document",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ],
  "riskLevel": "low|medium|high",
  "riskFactors": [
    "Risk factor 1",
    "Risk factor 2",
    "Risk factor 3"
  ],
  "clauses": [
    {
      "text": "Full text of the clause, sentence, or provision",
      "type": "termination|payment|liability|confidentiality|intellectual_property|dispute_resolution|force_majeure|warranties|indemnification|data_protection|compliance|other",
      "riskLevel": "low|medium|high",
      "explanation": "Detailed explanation of what this clause means and why it's important (2-3 sentences)",
      "legalImplications": "What are the legal consequences of this clause",
      "suggestions": [
        "Specific actionable suggestion 1",
        "Specific actionable suggestion 2"
      ],
      "redFlags": ["Any concerning aspects of this clause"],
      "obligations": ["What obligations does this create for each party"]
    }
  ],
  "recommendations": [
    "Detailed recommendation 1 with reasoning",
    "Detailed recommendation 2 with reasoning",
    "Detailed recommendation 3 with reasoning"
  ],
  "missingClauses": [
    "Important clause type that should be added and why",
    "Another missing provision and its importance"
  ],
  "overallScore": 85,
  "compliance": {
    "issues": ["Specific compliance issue 1", "Specific compliance issue 2"],
    "suggestions": ["Detailed compliance suggestion 1", "Detailed compliance suggestion 2"]
  },
  "partyObligations": {
    "party1": ["Obligation 1", "Obligation 2"],
    "party2": ["Obligation 1", "Obligation 2"]
  }
}

ANALYSIS REQUIREMENTS:
- Extract ALL significant clauses, provisions, and sentences (aim for 5-15 clauses minimum)
- Each clause should have detailed analysis including risks, implications, and suggestions
- Look for: payment terms, liability caps, termination conditions, dispute resolution, confidentiality, intellectual property, warranties, indemnification, compliance requirements
- Identify any unusual, problematic, or missing provisions
- Provide specific, actionable recommendations
- Consider both parties' perspectives and obligations

Provide only the JSON response without any additional text or formatting.
    `;
  }

  /**
   * Parse and validate the AI analysis response
   * @param {string} responseText - Raw response from Gemini
   * @returns {Object} Parsed analysis object
   */
  parseAnalysisResponse(responseText) {
    try {
      // Clean the response text to extract JSON
      let cleanedResponse = responseText.trim();

      // Remove any markdown formatting
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/```\n?$/, "");

      const analysis = JSON.parse(cleanedResponse);

      // Validate required fields
      const requiredFields = ["summary", "keyPoints", "riskLevel"];
      for (const field of requiredFields) {
        if (!analysis[field]) {
          console.warn(`Missing required field: ${field}`);
        }
      }

      // Ensure arrays exist
      analysis.keyPoints = analysis.keyPoints || [];
      analysis.riskFactors = analysis.riskFactors || [];
      analysis.clauses = analysis.clauses || [];
      analysis.recommendations = analysis.recommendations || [];
      analysis.missingClauses = analysis.missingClauses || [];

      // Ensure each clause has the required structure for the frontend
      analysis.clauses = analysis.clauses.map((clause, index) => ({
        id: clause.id || `clause-${index + 1}`,
        text: clause.text || "",
        type: clause.type || "general",
        riskLevel: clause.riskLevel || "medium",
        explanation: clause.explanation || "Analysis not available",
        legalImplications: clause.legalImplications || "",
        suggestions: clause.suggestions || [],
        redFlags: clause.redFlags || [],
        obligations: clause.obligations || [],
      }));

      // Set defaults
      analysis.riskLevel = analysis.riskLevel || "medium";
      analysis.overallScore = analysis.overallScore || 70;
      analysis.compliance = analysis.compliance || {
        issues: [],
        suggestions: [],
      };

      return analysis;
    } catch (error) {
      console.error("Error parsing Gemini response:", error);

      // Return a fallback analysis
      return {
        summary: "Analysis completed but could not parse detailed results.",
        documentType: "Unknown",
        keyPoints: ["Document analyzed successfully"],
        riskLevel: "medium",
        riskFactors: [],
        clauses: [],
        recommendations: [
          "Please review the document manually for detailed analysis",
        ],
        missingClauses: [],
        overallScore: 70,
        compliance: { issues: [], suggestions: [] },
        error: "Failed to parse AI response",
      };
    }
  }

  /**
   * Generate suggestions for document improvement
   * @param {string} documentText - Document content
   * @param {Array} currentIssues - Known issues with the document
   * @returns {Array} Array of improvement suggestions
   */
  async generateImprovementSuggestions(documentText, currentIssues = []) {
    if (!this.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const prompt = `
Based on the following document and identified issues, provide specific improvement suggestions:

Document: "${documentText}"
Current Issues: ${currentIssues.join(", ")}

Please provide 3-5 specific, actionable suggestions to improve this document in JSON array format:
["Suggestion 1", "Suggestion 2", "Suggestion 3"]

Focus on legal protection, clarity, and risk mitigation.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestionsText = response.text();

      // Try to clean and parse the JSON response
      let cleanedResponse = suggestionsText.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "").trim();

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error generating improvement suggestions:", error);
      return [
        "Review all terms and conditions carefully",
        "Ensure all parties' obligations are clearly defined",
        "Add appropriate termination clauses",
      ];
    }
  }

  /**
   * Compare two documents and identify differences
   * @param {string} document1 - First document text
   * @param {string} document2 - Second document text
   * @returns {Object} Comparison results
   */
  async compareDocuments(document1, document2) {
    if (!this.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const prompt = `
Compare the following two documents and identify key differences:

Document 1: "${document1}"

Document 2: "${document2}"

Provide comparison results in JSON format:
{
  "differences": [
    {
      "type": "addition|deletion|modification",
      "section": "Section name",
      "description": "What changed",
      "impact": "low|medium|high"
    }
  ],
  "summary": "Brief summary of main differences",
  "recommendation": "Which document is better and why"
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const comparisonText = response.text();

      // Try to clean and parse the JSON response
      let cleanedResponse = comparisonText.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "").trim();

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error comparing documents:", error);
      return {
        differences: [],
        summary: "Documents compared but detailed analysis unavailable",
        recommendation: "Manual review recommended",
      };
    }
  }

  /**
   * Extract key terms and definitions from a document
   * @param {string} documentText - Document content
   * @returns {Array} Array of key terms with definitions
   */
  async extractKeyTerms(documentText) {
    if (!this.model) {
      throw new Error("Gemini AI not properly initialized");
    }

    const prompt = `
Extract key legal terms and their definitions from this document:

"${documentText}"

Return as JSON array:
[
  {
    "term": "Term name",
    "definition": "Definition or explanation",
    "importance": "low|medium|high",
    "context": "How it's used in the document"
  }
]

Focus on legal terms, technical definitions, and important concepts.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const termsText = response.text();

      // Try to clean and parse the JSON response
      let cleanedResponse = termsText.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "").trim();

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error extracting key terms:", error);
      return [];
    }
  }
}

module.exports = GeminiService;
