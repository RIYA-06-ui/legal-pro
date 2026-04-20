const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const {
  analyzeDocumentFromBuffer,
  analyzeDocumentFromCloudinaryUrl,
} = require("../services/documentAnalysisService");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload-only - Simple document upload WITH text extraction (fixed for cached clients)
router.post("/upload-only", upload.single("file"), async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(
    `ðŸ“¤ [${requestId}] FIXED Upload-Only (with text extraction) Started`
  );

  try {
    const { file } = req;
    const { userRole = "user", jurisdiction = "India" } = req.body;


    if (!file) {
      console.error(`âŒ [${requestId}] No file provided`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }


    // Step 2: Upload to Cloudinary
    const cloudinaryStart = Date.now();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "legal-documents",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const cloudinaryTime = Date.now() - cloudinaryStart;

    // Step 3: NEW - Extract text and analyze (this is the fix!)
    const analysisStart = Date.now();


    const analysis = await analyzeDocumentFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;

    const totalTime = Date.now() - requestStart;
    console.groupEnd();

    // Return both upload and analysis data
    res.json({
      success: true,
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        // Include analysis data if successful
        analysis: analysis.success ? analysis.analysis : null,
        fairnessBenchmark: analysis.success ? analysis.fairnessBenchmark : null,
        extractedText: analysis.success ? analysis.extractedText : null,
        metadata: {
          processingMethod: "upload-only-with-analysis-fix",
          cloudinaryUploadTime: cloudinaryTime,
          textExtractionTime: analysisTime,
          totalRequestTime: totalTime,
          analysisSuccess: analysis.success,
          ...(analysis.success ? analysis.metadata : {}),
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] FIXED Upload failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document upload failed",
      details: {
        totalTime: totalTime,
      },
    });
  }
});

// POST /upload-and-analyze
router.post("/upload-and-analyze", upload.single("file"), async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`ðŸ“¤ [${requestId}] Document Upload Request Started`);

  try {
    const { file } = req;
    const { userRole = "Tenant", jurisdiction = "India" } = req.body;


    if (!file) {
      console.error(`âŒ [${requestId}] No file provided`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }


    // Step 2: Upload to Cloudinary
    const cloudinaryStart = Date.now();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "legal-documents",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const cloudinaryTime = Date.now() - cloudinaryStart;

    // Step 3: Analyze document
    const analysisStart = Date.now();


    const analysis = await analyzeDocumentFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;

    if (!analysis.success) {
      console.error(`âŒ [${requestId}] Analysis failed:`, analysis.error);
      console.error(`âŒ [${requestId}] Analysis object:`, analysis);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
        details: {
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          cloudinaryUrl: result.secure_url,
          analysisTime: analysisTime,
        },
      });
    }

    const totalTime = Date.now() - requestStart;
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          cloudinaryUploadTime: cloudinaryTime,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] Request failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document upload and analysis failed",
    });
  }
});

// POST /reanalyze - Reanalyze document from Cloudinary URL
router.post("/reanalyze", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`ðŸ”„ [${requestId}] Document Reanalysis Request Started`);

  try {
    const {
      cloudinaryUrl,
      fileName,
      userRole = "Tenant",
      jurisdiction = "India",
    } = req.body;


    if (!cloudinaryUrl || !fileName) {
      console.error(`âŒ [${requestId}] Missing cloudinaryUrl or fileName`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Cloudinary URL and file name are required",
      });
    }


    // Analyze document from Cloudinary URL
    const analysisStart = Date.now();

    const analysis = await analyzeDocumentFromCloudinaryUrl(
      cloudinaryUrl,
      fileName,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;

    if (!analysis.success) {
      console.error(`âŒ [${requestId}] Analysis failed:`, analysis.error);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
      });
    }

    const totalTime = Date.now() - requestStart;
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] Reanalysis failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Document reanalysis failed",
    });
  }
});

// POST /analyze-base64 - Analyze document from base64 data
router.post("/analyze-base64", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`ðŸ“„ [${requestId}] Base64 Document Analysis Request Started`);

  try {
    const {
      base64Data,
      fileName,
      mimeType,
      userRole = "Tenant",
      jurisdiction = "India",
    } = req.body;


    if (!base64Data || !fileName) {
      console.error(`âŒ [${requestId}] Missing base64Data or fileName`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Base64 data and file name are required",
      });
    }


    // Convert base64 to buffer
    const conversionStart = Date.now();

    const fileBuffer = Buffer.from(base64Data, "base64");

    const conversionTime = Date.now() - conversionStart;

    // Analyze document from buffer
    const analysisStart = Date.now();

    const analysis = await analyzeDocumentFromBuffer(
      fileBuffer,
      fileName,
      mimeType,
      userRole,
      jurisdiction
    );

    const analysisTime = Date.now() - analysisStart;

    if (!analysis.success) {
      console.error(`âŒ [${requestId}] Analysis failed:`, analysis.error);
      console.groupEnd();
      return res.status(500).json({
        success: false,
        error: analysis.error,
      });
    }

    const totalTime = Date.now() - requestStart;
    console.groupEnd();

    res.json({
      success: true,
      data: {
        fileName,
        analysis: analysis.analysis,
        fairnessBenchmark: analysis.fairnessBenchmark,
        extractedText: analysis.extractedText,
        metadata: {
          ...analysis.metadata,
          base64ConversionTime: conversionTime,
          totalRequestTime: totalTime,
        },
      },
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] Base64 analysis failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Base64 document analysis failed",
    });
  }
});

// GET /signed-url - Generate signed URL for Cloudinary
router.get("/signed-url", async (req, res) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  console.group(`ðŸ” [${requestId}] Signed URL Request Started`);

  try {
    const { publicId } = req.query;


    if (!publicId) {
      console.error(`âŒ [${requestId}] Missing publicId`);
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: "Public ID is required",
      });
    }


    // Generate signed URL
    const signedUrlStart = Date.now();

    const signedUrl = cloudinary.url(publicId, {
      sign_url: true,
      resource_type: "auto",
    });

    const signedUrlTime = Date.now() - signedUrlStart;
    const totalTime = Date.now() - requestStart;

    console.groupEnd();

    res.json({
      success: true,
      url: signedUrl,
      publicId: publicId,
    });
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    console.error(
      `âŒ [${requestId}] Signed URL generation failed after ${totalTime}ms:`,
      error.message
    );
    console.groupEnd();

    res.status(500).json({
      success: false,
      error: error.message || "Signed URL generation failed",
    });
  }
});

module.exports = router;
