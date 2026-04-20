const { extractText } = require("../utils/textExtractor");
const GroqService = require("./groqService");
const SimpleFairnessService = require("./simpleFairnessService");

const groqService = new GroqService();
const simpleFairnessService = new SimpleFairnessService();

async function analyzeDocumentFromBase64(
  base64Content,
  fileName,
  mimeType,
  userRole = "Tenant",
  jurisdiction = "India"
) {
  try {
    // Decode Base64 to a Buffer
    const fileBuffer = Buffer.from(base64Content, "base64");

    // Extract text from the buffer
    const extractedText = await extractText(fileBuffer, mimeType);

    if (!extractedText || extractedText.trim() === "") {
      return {
        success: false,
        error: "No text could be extracted from the document.",
        fileName,
      };
    }

    // Get AI analysis from Groq
    const analysis = await groqService.analyzeDocument(
      extractedText,
      userRole
    );

    // Get fairness benchmark analysis
    let fairnessBenchmark = null;
    try {
      const contractType = determineContractType(fileName, extractedText);
      fairnessBenchmark = await fairnessBenchmarkService.analyzeFairness(
        extractedText,
        contractType,
        jurisdiction,
        userRole
      );
    } catch (fairnessError) {
      console.warn(
        "Fairness benchmark analysis failed:",
        fairnessError.message
      );
    }

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      fairnessBenchmark,
      metadata: {
        processingMethod: "backend-base64",
        source: "base64-upload",
      },
    };
  } catch (error) {
    console.error(`Error analyzing document from Base64: ${error.message}`);
    throw new Error(`Failed to analyze document from Base64: ${error.message}`);
  }
}

async function analyzeDocumentFromBuffer(
  fileBuffer,
  fileName,
  mimeType,
  userRole = "Tenant",
  jurisdiction = "India"
) {
  const analysisStart = Date.now();
  const analysisId = Math.random().toString(36).substr(2, 9);

  try {
    // Extract text from the buffer
    const textExtractionStart = Date.now();

    let extractedText;
    try {
      extractedText = await extractText(fileBuffer, mimeType);
    } catch (extractionError) {
      const textExtractionTime = Date.now() - textExtractionStart;
      console.error(
        `âŒ [${analysisId}] Text extraction failed in ${textExtractionTime}ms:`,
        extractionError.message
      );
      return {
        success: false,
        error: `Text extraction failed: ${extractionError.message}`,
        fileName,
        metadata: {
          textExtractionTime,
          extractionError: extractionError.message,
        },
      };
    }

    const textExtractionTime = Date.now() - textExtractionStart;

    if (!extractedText || extractedText.trim() === "") {
      console.error(
        `âŒ [${analysisId}] No text could be extracted from the document`
      );
      return {
        success: false,
        error: "No text could be extracted from the document.",
        fileName,
      };
    }

    // Get AI analysis from Groq
    const groqStart = Date.now();

    const analysis = await groqService.analyzeDocument(
      extractedText,
      userRole
    );

    const groqTime = Date.now() - groqStart;

    // Get quick fairness analysis (much faster!)
    const fairnessStart = Date.now();

    let fairnessBenchmark = null;
    try {
      const contractType = determineContractType(fileName, extractedText);

      fairnessBenchmark = await simpleFairnessService.quickFairnessAnalysis(
        extractedText,
        contractType,
        jurisdiction,
        userRole
      );

      const fairnessTime = Date.now() - fairnessStart;
    } catch (fairnessError) {
      const fairnessTime = Date.now() - fairnessStart;
      console.warn(
        `âš ï¸ [${analysisId}] Quick fairness analysis failed after ${fairnessTime}ms:`,
        fairnessError.message
      );
    }

    const totalTime = Date.now() - analysisStart;

    return {
      success: true,
      fileName,
      extractedText,
      analysis,
      fairnessBenchmark,
      metadata: {
        processingMethod: "backend-buffer",
        source: "direct-upload",
        timings: {
          textExtraction: textExtractionTime,
          geminiAnalysis: geminiTime,
          total: totalTime,
        },
      },
    };
  } catch (error) {
    const totalTime = Date.now() - analysisStart;
    console.error(
      `âŒ [${analysisId}] Document analysis failed after ${totalTime}ms:`,
      error.message
    );

    return {
      success: false,
      error: `Failed to analyze document: ${error.message}`,
      fileName,
    };
  }
}

async function analyzeDocumentFromCloudinaryUrl(
  cloudinaryUrl,
  fileName,
  userRole = "Tenant",
  jurisdiction = "India"
) {
  const analysisStart = Date.now();
  const analysisId = Math.random().toString(36).substr(2, 9);

  try {
    // Fetch the file from Cloudinary
    const fetchStart = Date.now();

    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.status} ${response.statusText}`
      );
    }

    const fileBuffer = Buffer.from(await response.arrayBuffer());

    if (fileBuffer.length === 0) {
      throw new Error(`Cloudinary returned empty file buffer`);
    }
    const fetchTime = Date.now() - fetchStart;

    // Determine MIME type from URL or filename
    let mimeType = "application/octet-stream";
    const urlLower = cloudinaryUrl.toLowerCase();
    const fileNameLower = fileName.toLowerCase();

    if (urlLower.includes(".pdf") || fileNameLower.includes(".pdf")) {
      mimeType = "application/pdf";
    } else if (
      urlLower.includes(".docx") ||
      fileNameLower.includes(".docx") ||
      fileNameLower.includes("_docx")
    ) {
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (
      urlLower.includes(".doc") ||
      fileNameLower.includes(".doc") ||
      fileNameLower.includes("_doc")
    ) {
      mimeType = "application/msword";
    } else if (urlLower.includes(".txt") || fileNameLower.includes(".txt")) {
      mimeType = "text/plain";
    }

    // Extract text from the buffer using the previously analyzed function
    const delegationStart = Date.now();

    const result = await analyzeDocumentFromBuffer(
      fileBuffer,
      fileName,
      mimeType,
      userRole,
      jurisdiction
    );

    const delegationTime = Date.now() - delegationStart;
    const totalTime = Date.now() - analysisStart;

    // Add Cloudinary-specific metadata
    if (result.success && result.metadata) {
      result.metadata.processingMethod = "cloudinary-url";
      result.metadata.source = "cloudinary";
      result.metadata.timings = {
        ...result.metadata.timings,
        cloudinaryFetch: fetchTime,
        total: totalTime,
      };
    }

    return result;
  } catch (error) {
    const totalTime = Date.now() - analysisStart;
    console.error(
      `âŒ [${analysisId}] Cloudinary analysis failed after ${totalTime}ms:`,
      error.message
    );

    return {
      success: false,
      error: `Failed to analyze document from Cloudinary: ${error.message}`,
      fileName,
    };
  }
}

/**
 * Helper function to determine contract type from filename and content
 * @param {string} fileName - The name of the file
 * @param {string} extractedText - The extracted text content
 * @returns {string} Contract type
 */
function determineContractType(fileName, extractedText) {
  const fileNameLower = fileName.toLowerCase();
  const textLower = extractedText.toLowerCase();

  // Check filename for keywords
  if (
    fileNameLower.includes("rent") ||
    fileNameLower.includes("lease") ||
    fileNameLower.includes("tenancy")
  ) {
    return "rental agreement";
  }
  if (
    fileNameLower.includes("employ") ||
    fileNameLower.includes("job") ||
    fileNameLower.includes("work")
  ) {
    return "employment contract";
  }
  if (fileNameLower.includes("service") || fileNameLower.includes("vendor")) {
    return "service agreement";
  }

  // Check content for keywords
  if (
    textLower.includes("tenant") ||
    textLower.includes("landlord") ||
    textLower.includes("rent") ||
    textLower.includes("lease")
  ) {
    return "rental agreement";
  }
  if (
    textLower.includes("employee") ||
    textLower.includes("employer") ||
    textLower.includes("salary") ||
    textLower.includes("employment")
  ) {
    return "employment contract";
  }
  if (
    textLower.includes("service provider") ||
    textLower.includes("client") ||
    textLower.includes("vendor")
  ) {
    return "service agreement";
  }
  if (
    textLower.includes("purchase") ||
    textLower.includes("buyer") ||
    textLower.includes("seller")
  ) {
    return "purchase agreement";
  }
  if (
    textLower.includes("license") ||
    textLower.includes("software") ||
    textLower.includes("intellectual property")
  ) {
    return "license agreement";
  }

  // Default fallback
  return "contract";
}

module.exports = {
  analyzeDocumentFromBase64,
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
};
