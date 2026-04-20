const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Text extraction utility for different file types
 */
class TextExtractor {
  /**
   * Extract text from a file based on its type
   * @param {string|Buffer} fileInput - Path to the file or buffer
   * @param {string} mimeType - MIME type of the file
   * @returns {Promise<string>} Extracted text content
   */
  static async extractText(fileInput, mimeType) {
    try {
      // Determine file type from MIME type
      let fileType;
      switch (mimeType) {
        case "application/pdf":
          fileType = "pdf";
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          fileType = "docx";
          break;
        case "application/msword":
          fileType = "doc";
          break;
        case "text/plain":
          fileType = "txt";
          break;
        default:
          throw new Error(`Unsupported MIME type: ${mimeType}`);
      }

      // Check if input is a Buffer or file path
      if (Buffer.isBuffer(fileInput)) {
        return await this.extractFromBuffer(fileInput, fileType);
      } else {
        return await this.extractFromFile(fileInput, fileType);
      }
    } catch (error) {
      console.error(`Error extracting text from ${mimeType} file:`, error);
      throw new Error(
        `Failed to extract text from ${mimeType} file: ${error.message}`
      );
    }
  }

  /**
   * Extract text from a buffer based on file type
   * @param {Buffer} buffer - File buffer
   * @param {string} fileType - File type (pdf, txt, doc, docx)
   * @returns {Promise<string>} Extracted text content
   */
  static async extractFromBuffer(buffer, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return await this.extractFromPDFBuffer(buffer);
        case "txt":
          return await this.extractFromTXTBuffer(buffer);
        case "doc":
        case "docx":
          return await this.extractFromWordBuffer(buffer);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error(`Error extracting text from ${fileType} buffer:`, error);
      throw new Error(
        `Failed to extract text from ${fileType} buffer: ${error.message}`
      );
    }
  }

  /**
   * Extract text from a file based on its type (legacy method for file paths)
   * @param {string} filePath - Path to the file
   * @param {string} fileType - File extension (pdf, txt, doc, docx)
   * @returns {Promise<string>} Extracted text content
   */
  static async extractFromFile(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return await this.extractFromPDF(filePath);
        case "txt":
          return await this.extractFromTXT(filePath);
        case "doc":
        case "docx":
          return await this.extractFromWord(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error(`Error extracting text from ${fileType} file:`, error);
      throw new Error(
        `Failed to extract text from ${fileType} file: ${error.message}`
      );
    }
  }

  /**
   * Extract text from PDF buffer with multiple fallback methods
   * @param {Buffer} buffer - PDF file buffer
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromPDFBuffer(buffer) {
    let lastError = null;

    try {
      const data = await pdf(buffer);

      // Clean up the extracted text
      let text = data.text;

      // Remove excessive whitespace and normalize line breaks
      text = text.replace(/\s+/g, " ").trim();
      text = text.replace(/\n\s*\n/g, "\n\n");

      if (!text || text.length < 10) {
        throw new Error("No readable text found in PDF buffer");
      }

      return text;
    } catch (error) {
      console.warn("ðŸ“„ PDF default extraction failed:", error.message);
      lastError = error;

      // Try fallback method with different options
      try {
        const data = await pdf(buffer, {
          // Use recovery mode for corrupted PDFs
          verbosity: 0,
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        });

        let text = data.text || "";

        // More aggressive text cleaning for problematic PDFs
        text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ""); // Remove control chars
        text = text.replace(/\s+/g, " ").trim();
        text = text.replace(/\n\s*\n/g, "\n\n");

        if (!text || text.length < 5) {
          throw new Error("Fallback method also returned no readable text");
        }

        return text;
      } catch (fallbackError) {
        console.warn(
          "ðŸ“„ PDF fallback extraction also failed:",
          fallbackError.message
        );

        // Final attempt - try to extract any available info
        try {
          const data = await pdf(buffer, { max: 1 }); // Try just first page

          let text = data.text || data.info?.Title || data.info?.Subject || "";

          if (text && text.length >= 3) {
            return `PDF Content (partial): ${text}`;
          }

          throw new Error("No extractable content found");
        } catch (finalError) {
          console.error("âŒ All PDF extraction methods failed");
          throw new Error(
            `Failed to extract text from PDF buffer: ${
              lastError?.message || finalError.message
            }`
          );
        }
      }
    }
  }

  /**
   * Extract text from Word document buffer (DOC/DOCX)
   * @param {Buffer} buffer - Word file buffer
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromWordBuffer(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer: buffer });
      let text = result.value;

      // Clean up the extracted text
      text = text.replace(/\s+/g, " ").trim();
      text = text.replace(/\n\s*\n/g, "\n\n");

      if (!text || text.length < 10) {
        throw new Error("No readable text found in Word document buffer");
      }

      // Log any messages from mammoth (warnings about unsupported elements)
      if (result.messages && result.messages.length > 0) {
      }

      return text;
    } catch (error) {
      console.error("Word buffer extraction error:", error);
      throw new Error(
        `Failed to extract text from Word document buffer: ${error.message}`
      );
    }
  }

  /**
   * Extract text from TXT buffer
   * @param {Buffer} buffer - TXT file buffer
   * @returns {Promise<string>} File content
   */
  static async extractFromTXTBuffer(buffer) {
    try {
      const content = buffer.toString("utf8");

      if (!content || content.trim().length === 0) {
        throw new Error("Text buffer is empty");
      }

      return content.trim();
    } catch (error) {
      console.error("TXT buffer extraction error:", error);
      throw new Error(`Failed to read text buffer: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      return await this.extractFromPDFBuffer(dataBuffer);
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from Word document (DOC/DOCX)
   * @param {string} filePath - Path to Word file
   * @returns {Promise<string>} Extracted text
   */
  static async extractFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      let text = result.value;

      // Clean up the extracted text
      text = text.replace(/\s+/g, " ").trim();
      text = text.replace(/\n\s*\n/g, "\n\n");

      if (!text || text.length < 10) {
        throw new Error("No readable text found in Word document");
      }

      // Log any messages from mammoth (warnings about unsupported elements)
      if (result.messages && result.messages.length > 0) {
      }

      return text;
    } catch (error) {
      console.error("Word extraction error:", error);
      throw new Error(
        `Failed to extract text from Word document: ${error.message}`
      );
    }
  }

  /**
   * Extract text from TXT file
   * @param {string} filePath - Path to TXT file
   * @returns {Promise<string>} File content
   */
  static async extractFromTXT(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      if (!content || content.trim().length === 0) {
        throw new Error("Text file is empty");
      }

      return content.trim();
    } catch (error) {
      console.error("TXT extraction error:", error);
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  }

  /**
   * Validate if file exists and is readable
   * @param {string} filePath - Path to file
   * @returns {boolean} True if file is accessible
   */
  static validateFile(filePath) {
    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to file
   * @returns {number} File size in bytes
   */
  static getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if MIME type is supported
   * @param {string} mimeType - MIME type
   * @returns {boolean} True if supported
   */
  static isSupportedMimeType(mimeType) {
    const supportedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    return supportedTypes.includes(mimeType.toLowerCase());
  }

  /**
   * Check if file type is supported (legacy method)
   * @param {string} fileType - File extension
   * @returns {boolean} True if supported
   */
  static isSupportedType(fileType) {
    const supportedTypes = ["pdf", "txt", "doc", "docx"];
    return supportedTypes.includes(fileType.toLowerCase());
  }
}

// Export both the class and individual methods for backward compatibility
module.exports = TextExtractor;
module.exports.extractText = TextExtractor.extractText.bind(TextExtractor);
