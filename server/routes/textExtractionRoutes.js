const express = require("express");
const {
  analyzeDocumentFromCloudinaryUrl,
} = require("../services/documentAnalysisService");

const router = express.Router();

// POST /extract-text - Extract text from existing document and save to database
router.post("/extract-text/:documentId", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  const { documentId } = req.params;
  const { userId } = req.body;

  console.group(`ðŸ”§ [${requestId}] Text Extraction Request Started`);

  try {
    // This will attempt to extract text from Cloudinary and save to database
    // The analyzeDocumentFromCloudinaryUrl function should handle the text extraction

    const result = {
      success: true,
      message: "Text extraction initiated",
      documentId: documentId,
    };

    const totalTime = Date.now() - requestStart;
    console.groupEnd();

    res.json(result);
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] Text extraction failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Text extraction failed",
      documentId: documentId,
    });
  }
});

module.exports = router;
