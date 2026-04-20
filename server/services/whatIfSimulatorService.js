const GroqService = require("./groqService");

class WhatIfSimulatorService {
  constructor() {
    this.groqService = new GroqService();
  }

  /**
   * Detect if a user message is asking a "What If" scenario question
   * @param {string} message - User's message
   * @returns {boolean} True if this appears to be a scenario question
   */
  isScenarioQuestion(message) {
    const scenarioIndicators = [
      "what if",
      "what happens if",
      "what would happen",
      "suppose",
      "if i",
      "in case",
      "scenario",
      "hypothetical",
      "assuming",
      "what are the consequences",
      "what are my options",
      "can i",
      "am i allowed",
      "what penalties",
      "what risks",
      "worst case",
      "best case",
      "if the",
      "what's the worst",
      "what's my liability",
    ];

    const messageLower = message.toLowerCase();
    return scenarioIndicators.some((indicator) =>
      messageLower.includes(indicator)
    );
  }

  /**
   * Analyze a hypothetical scenario against a document
   * @param {string} scenarioQuestion - User's scenario question
   * @param {string} documentText - Full document text
   * @param {Object} documentAnalysis - Existing document analysis
   * @param {string} jurisdiction - Legal jurisdiction (default: "India")
   * @param {string} userRole - User's role in the contract (default: "Consumer")
   * @returns {Object} Structured scenario analysis
   */
  async analyzeScenario(
    scenarioQuestion,
    documentText,
    documentAnalysis = null,
    jurisdiction = "India",
    userRole = "Consumer"
  ) {
    // Create comprehensive scenario analysis prompt
    const scenarioPrompt = this.createScenarioPrompt(
      scenarioQuestion,
      documentText,
      documentAnalysis,
      jurisdiction,
      userRole
    );

    try {
      const analysisText = await this.groqService.chat(scenarioPrompt);
      return this.parseScenarioResponse(analysisText, scenarioQuestion);
    } catch (error) {
      console.error("Error analyzing scenario with Groq:", error);
      throw new Error("Failed to analyze scenario: " + error.message);
    }
  }

  /**
   * Create a comprehensive scenario analysis prompt
   * @param {string} scenarioQuestion - User's scenario question
   * @param {string} documentText - Full document text
   * @param {Object} documentAnalysis - Existing document analysis
   * @param {string} jurisdiction - Legal jurisdiction
   * @param {string} userRole - User's role in the contract
   * @returns {string} Formatted prompt for Gemini
   */
  createScenarioPrompt(
    scenarioQuestion,
    documentText,
    documentAnalysis,
    jurisdiction,
    userRole
  ) {
    return `
You are an expert legal analyst. Provide a CONCISE scenario analysis for a ${userRole} in ${jurisdiction}.

DOCUMENT CONTENT (first 2000 chars):
"${documentText.substring(0, 2000)}..."

USER'S SCENARIO: "${scenarioQuestion}"

INSTRUCTIONS - Keep responses SHORT and focused:
1. Find 1-2 most relevant clauses from the document
2. Give a clear, practical answer
3. Limit each section to 2-3 key points maximum
4. Be specific about timeframes and consequences

Provide analysis in this JSON structure:
{
  "directAnswer": "One clear sentence explaining what would happen",
  "governingClauses": [
    {
      "clauseText": "Key relevant clause text (max 150 chars)",
      "clauseType": "payment|termination|liability|dispute|breach|notice|other",
      "relevance": "Brief explanation of how this applies (max 100 chars)"
    }
  ],
  "stepByStepBreakdown": [
    {
      "step": 1,
      "event": "What happens first (brief)",
      "timeframe": "When (e.g., immediately, 30 days)",
      "consequences": "Main consequence (brief)"
    }
  ],
  "financialImplications": {
    "potentialCosts": "Specific amounts/penalties if mentioned",
    "monetaryRisks": "Brief risk summary"
  },
  "strategicAdvice": {
    "immediateActions": ["Top 2 actions to take now"],
    "riskMitigation": ["Top 2 ways to minimize risk"]
  },
  "riskAssessment": {
    "overallRisk": "low|medium|high",
    "primaryConcerns": ["Main risk 1", "Main risk 2"],
    "confidenceLevel": "high|medium|low"
  }
}

KEEP IT CONCISE - Maximum 2-3 items per array. Focus on the most important points only.
`;
  }
  /**
   * Parse and format the scenario analysis response (CONCISE VERSION)
   * @param {string} responseText - Raw response from Gemini
   * @param {string} originalQuestion - Original user question
   * @returns {Object} Parsed and formatted scenario analysis
   */
  parseScenarioResponse(responseText, originalQuestion) {
    try {
      // Clean the response text to extract JSON
      let cleanedResponse = responseText.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "");

      const analysis = JSON.parse(cleanedResponse);

      // Simplified structure with defaults
      const formattedAnalysis = {
        originalQuestion: originalQuestion,
        directAnswer: analysis.directAnswer || "Analysis incomplete",
        governingClauses: this.validateGoverningClauses(
          analysis.governingClauses,
          true
        ), // simplified
        stepByStepBreakdown: this.validateStepByStep(
          analysis.stepByStepBreakdown,
          true
        ), // simplified
        financialImplications: {
          potentialCosts:
            analysis.financialImplications?.potentialCosts || "Not specified",
          monetaryRisks:
            analysis.financialImplications?.monetaryRisks ||
            "Unable to determine",
        },
        strategicAdvice: {
          immediateActions: (
            analysis.strategicAdvice?.immediateActions || []
          ).slice(0, 2),
          riskMitigation: (
            analysis.strategicAdvice?.riskMitigation || []
          ).slice(0, 2),
        },
        riskAssessment: {
          overallRisk: analysis.riskAssessment?.overallRisk || "medium",
          primaryConcerns: (
            analysis.riskAssessment?.primaryConcerns || []
          ).slice(0, 2),
          confidenceLevel: analysis.riskAssessment?.confidenceLevel || "medium",
        },
        analyzedAt: new Date().toISOString(),
        responseType: "scenario_analysis",
      };

      return formattedAnalysis;
    } catch (error) {
      console.error("Error parsing scenario response:", error);

      // Return a concise fallback analysis
      return {
        originalQuestion: originalQuestion,
        directAnswer:
          "I analyzed your scenario, but couldn't parse the detailed breakdown.",
        governingClauses: [
          {
            clauseText: "Unable to identify specific clauses",
            clauseType: "other",
            relevance: "Please review contract manually",
          },
        ],
        stepByStepBreakdown: [
          {
            step: 1,
            event: "Review relevant contract terms",
            timeframe: "Immediately",
            consequences: "Better understanding of your situation",
          },
        ],
        financialImplications: {
          potentialCosts: "Check contract for penalty clauses",
          monetaryRisks: "Review financial terms",
        },
        strategicAdvice: {
          immediateActions: [
            "Review contract clauses",
            "Consider legal advice",
          ],
          riskMitigation: ["Document communications", "Follow contract terms"],
        },
        riskAssessment: {
          overallRisk: "medium",
          primaryConcerns: ["Analysis parsing failed"],
          confidenceLevel: "low",
        },
        analyzedAt: new Date().toISOString(),
        responseType: "scenario_analysis",
        error: "Parsing failed, manual review recommended",
      };
    }
  }

  /**
   * Validate and format governing clauses (SIMPLIFIED)
   * @param {Array} clauses - Raw clauses array
   * @param {boolean} simplified - Whether to use simplified format
   * @returns {Array} Validated clauses
   */
  validateGoverningClauses(clauses, simplified = false) {
    if (!Array.isArray(clauses)) return [];

    const maxClauses = simplified ? 2 : 5; // Limit to 2 for concise mode
    return clauses.slice(0, maxClauses).map((clause, index) => ({
      id: `governing-clause-${index + 1}`,
      clauseText: (clause.clauseText || "Clause text not available").substring(
        0,
        simplified ? 150 : 500
      ),
      clauseType: clause.clauseType || "other",
      relevance: (clause.relevance || "Relevance not specified").substring(
        0,
        simplified ? 100 : 200
      ),
      riskLevel: clause.riskLevel || "medium",
    }));
  }

  /**
   * Validate and format step-by-step breakdown (SIMPLIFIED)
   * @param {Array} steps - Raw steps array
   * @param {boolean} simplified - Whether to use simplified format
   * @returns {Array} Validated steps
   */
  validateStepByStep(steps, simplified = false) {
    if (!Array.isArray(steps)) return [];

    const maxSteps = simplified ? 3 : 7; // Limit to 3 for concise mode
    return steps.slice(0, maxSteps).map((step, index) => ({
      step: step.step || index + 1,
      event: (step.event || "Step not specified").substring(
        0,
        simplified ? 80 : 200
      ),
      timeframe: step.timeframe || "Timeframe not specified",
      legalBasis: simplified
        ? undefined
        : step.legalBasis || "Legal basis not specified",
      consequences: (
        step.consequences || "Consequences not specified"
      ).substring(0, simplified ? 100 : 300),
    }));
  }

  /**
   * Format scenario analysis for chat display (CONCISE VERSION)
   * @param {Object} analysis - Parsed scenario analysis
   * @returns {string} Formatted markdown response
   */
  formatScenarioForChat(analysis) {
    let response = `## ðŸ”® What-If Analysis\n\n`;
    response += `**Q:** ${analysis.originalQuestion}\n\n`;

    // Direct Answer
    response += `### ðŸŽ¯ Answer\n${analysis.directAnswer}\n\n`;

    // Governing Clauses (limit to 2)
    if (analysis.governingClauses && analysis.governingClauses.length > 0) {
      response += `### ðŸ“œ Key Clauses\n`;
      analysis.governingClauses.slice(0, 2).forEach((clause, index) => {
        response += `**${index + 1}.** "${clause.clauseText}"\n`;
        response += `*${clause.relevance}*\n\n`;
      });
    }

    // Step-by-Step (limit to 3 steps)
    if (
      analysis.stepByStepBreakdown &&
      analysis.stepByStepBreakdown.length > 0
    ) {
      response += `### ðŸ“‹ What Happens\n`;
      analysis.stepByStepBreakdown.slice(0, 3).forEach((step) => {
        response += `**${step.step}.** ${step.event} (${step.timeframe})\n`;
        response += `${step.consequences}\n\n`;
      });
    }

    // Financial Implications (condensed)
    if (analysis.financialImplications) {
      response += `### ðŸ’° Financial Impact\n`;
      if (analysis.financialImplications.potentialCosts) {
        response += `**Costs:** ${analysis.financialImplications.potentialCosts}\n`;
      }
      if (analysis.financialImplications.monetaryRisks) {
        response += `**Risk:** ${analysis.financialImplications.monetaryRisks}\n`;
      }
      response += `\n`;
    }

    // Strategic Advice (condensed)
    if (analysis.strategicAdvice) {
      response += `### ðŸ’¡ Action Items\n`;

      if (analysis.strategicAdvice.immediateActions?.length > 0) {
        response += `**Do Now:**\n`;
        analysis.strategicAdvice.immediateActions
          .slice(0, 2)
          .forEach((action) => {
            response += `â€¢ ${action}\n`;
          });
        response += `\n`;
      }

      if (analysis.strategicAdvice.riskMitigation?.length > 0) {
        response += `**To Minimize Risk:**\n`;
        analysis.strategicAdvice.riskMitigation.slice(0, 2).forEach((step) => {
          response += `â€¢ ${step}\n`;
        });
        response += `\n`;
      }
    }

    // Risk Assessment (condensed)
    if (analysis.riskAssessment) {
      const riskEmoji =
        analysis.riskAssessment.overallRisk === "high"
          ? "ðŸ”´"
          : analysis.riskAssessment.overallRisk === "medium"
          ? "ðŸŸ¡"
          : "ðŸŸ¢";
      response += `### ðŸ“Š Risk Level: ${riskEmoji} ${analysis.riskAssessment.overallRisk.toUpperCase()}\n`;

      if (analysis.riskAssessment.primaryConcerns?.length > 0) {
        response += `**Main Concerns:** ${analysis.riskAssessment.primaryConcerns
          .slice(0, 2)
          .join(", ")}\n`;
      }
      response += `\n`;
    }

    response += `ðŸ’¬ Need details on any specific aspect? Just ask!`;
    return response;
  }

  /**
   * Generate example scenarios based on document type
   * @param {string} documentType - Type of document
   * @param {string} jurisdiction - Legal jurisdiction
   * @returns {Array} Array of example scenario questions
   */
  generateExampleScenarios(documentType = "contract", jurisdiction = "India") {
    const baseScenarios = {
      "rental agreement": [
        "What if I lose my job and can't pay rent for two months?",
        "What happens if the landlord doesn't return my security deposit?",
        "What if I need to break the lease early due to a family emergency?",
        "What are my options if the landlord refuses to make necessary repairs?",
        "What if the property is damaged by natural disaster?",
      ],
      "employment contract": [
        "What if I want to quit without completing my notice period?",
        "What happens if my employer terminates me without cause?",
        "What if I accidentally share confidential information?",
        "What are the consequences if I join a competitor company?",
        "What if my salary is delayed by more than 30 days?",
      ],
      "service agreement": [
        "What if the project timeline needs to be extended significantly?",
        "What happens if the client refuses to pay after work completion?",
        "What if I can't deliver the service due to unforeseen circumstances?",
        "What are my options if the client keeps changing requirements?",
        "What if there's a dispute about the quality of delivered services?",
      ],
      contract: [
        "What if one party wants to terminate the agreement early?",
        "What happens if payment terms are not met?",
        "What if there's a disagreement about contract interpretation?",
        "What are the consequences of breach of contract?",
        "What if circumstances make it impossible to fulfill obligations?",
      ],
    };

    return (
      baseScenarios[documentType.toLowerCase()] || baseScenarios["contract"]
    );
  }
}

module.exports = WhatIfSimulatorService;
