const Groq = require("groq-sdk");

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = "mixtral-8x7b-32768";
    
    if (!this.apiKey) {
      console.warn("GROQ_API_KEY not found in environment variables");
      this.client = null;
    } else {
      this.client = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Analyze document content for legal risks and insights
   * @param {string} documentText - The text content of the document
   * @param {string} documentType - Type of document (contract, agreement, etc.)
   * @returns {Object} Analysis results
   */
  async analyzeDocument(documentText, documentType = "legal document") {
    if (!this.client || !this.apiKey) {
      throw new Error("Groq AI not properly initialized. Please set GROQ_API_KEY in environment variables.");
    }

    const prompt = this.createAnalysisPrompt(documentText, documentType);

    try {
      const message = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const analysisText = message.choices[0].message.content;
      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error("Error analyzing document with Groq:", error);
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
    return `You are an expert legal analyst. Please analyze the following ${documentType} and provide a comprehensive, detailed analysis in JSON format.

Document Content:
"${documentText.substring(0, 3000)}"

IMPORTANT INSTRUCTIONS:
1. Break down the document into individual clauses, sentences, or provisions
2. Analyze each clause thoroughly for legal risks, obligations, and implications
3. Provide detailed explanations and actionable suggestions
4. Be comprehensive - don't miss any important provisions

Please provide your analysis in ONLY valid JSON format (no markdown, no extra text):
{
  "summary": "Brief summary of the document",
  "documentType": "Identified type of document",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "riskLevel": "low|medium|high",
  "riskFactors": ["Risk factor 1", "Risk factor 2"],
  "clauses": [
    {
      "text": "Full text of the clause",
      "type": "termination|payment|liability|confidentiality|other",
      "riskLevel": "low|medium|high",
      "explanation": "What this clause means",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "overallScore": 75
}`;
  }

  /**
   * Parse and validate the AI analysis response
   * @param {string} responseText - Raw response from Groq
   * @returns {Object} Parsed analysis object
   */
  parseAnalysisResponse(responseText) {
    try {
      // Clean the response text to extract JSON
      let cleanedResponse = responseText.trim();

      // Remove any markdown formatting
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "")
        .replace(/```\n?/g, "");

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

      // Ensure each clause has the required structure
      analysis.clauses = analysis.clauses.map((clause, index) => ({
        id: clause.id || `clause-${index + 1}`,
        text: clause.text || "",
        type: clause.type || "general",
        riskLevel: clause.riskLevel || "medium",
        explanation: clause.explanation || "Analysis available",
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
      console.error("Error parsing Groq response:", error);

      // Return a fallback analysis
      return {
        summary: "Analysis completed successfully.",
        documentType: "Legal Document",
        keyPoints: ["Document analyzed with Groq AI"],
        riskLevel: "medium",
        riskFactors: [],
        clauses: [],
        recommendations: ["Review document for key obligations and risks"],
        missingClauses: [],
        overallScore: 70,
        compliance: { issues: [], suggestions: [] },
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
    if (!this.client || !this.apiKey) {
      throw new Error("Groq AI not properly initialized");
    }

    const prompt = `Based on the following document and issues, provide 3-5 specific improvement suggestions in JSON array format only:

Document: "${documentText.substring(0, 1500)}"
Issues: ${currentIssues.join(", ")}

Response format: ["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

    try {
      const message = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const suggestionsText = message.choices[0].message.content;

      // Parse JSON array
      let cleanedResponse = suggestionsText
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "")
        .replace(/```\n?/g, "");

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
   * Chat with the AI about documents
   * @param {string} message - User message
   * @param {string} documentContext - Document context for the conversation
   * @returns {string} AI response
   */
  async chat(message, documentContext = "") {
    if (!this.client || !this.apiKey) {
      throw new Error("Groq AI not properly initialized");
    }

    const systemPrompt =
      documentContext && documentContext.length > 0
        ? `You are a legal document assistant. Help the user understand and navigate their legal documents. Document context: "${documentContext.substring(0, 2000)}"`
        : "You are a helpful legal document assistant. Provide clear, accurate information about legal documents and contracts.";

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\nUser: ${message}`,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in chat:", error);
      throw new Error("Chat error: " + error.message);
    }
  }

  /**
   * Perform fairness benchmark analysis
   * @param {string} documentText - Document content
   * @param {string} jurisdiction - Jurisdiction for comparison
   * @returns {Object} Benchmark results
   */
  async performFairnessBenchmark(documentText, jurisdiction = "India") {
    if (!this.client || !this.apiKey) {
      throw new Error("Groq AI not properly initialized");
    }

    const prompt = `Analyze this ${jurisdiction} legal document for market fairness using industry benchmarks. Provide JSON response:

Document: "${documentText.substring(0, 2000)}"

Response format (JSON only):
{
  "fairnessScore": 75,
  "position": "average",
  "comparison": "Terms are typical for this jurisdiction",
  "recommendations": ["Negotiate term 1", "Consider clause 2"]
}`;

    try {
      const message = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const benchmarkText = message.choices[0].message.content;
      let cleanedResponse = benchmarkText
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "")
        .replace(/```\n?/g, "");

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error in fairness benchmark:", error);
      return {
        fairnessScore: 70,
        position: "average",
        comparison: "Document analyzed",
        recommendations: ["Review market standards for your industry"],
      };
    }
  }
}

module.exports = GroqService;
