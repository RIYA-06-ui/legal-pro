// Enhanced error handling utility for client-side
export class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export const handleApiError = (error) => {
  // Return user-friendly error message
  if (error.statusCode) {
    switch (error.statusCode) {
      case 400:
        return "Invalid request. Please check your input and try again.";
      case 401:
        return "Authentication failed. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 413:
        return "File is too large. Please select a smaller file.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 503:
        return "Service is temporarily unavailable. Please try again later.";
      case 504:
        return "Request timeout. Please try again with a shorter message.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  // Handle network errors
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Network connection failed. Please check your internet connection.";
  }

  // Handle file-related errors
  if (error.message?.includes("file type")) {
    return "Unsupported file type. Please select a PDF, Word document, or text file.";
  }

  if (error.message?.includes("size")) {
    return "File is too large. Maximum file size is 10MB.";
  }

  // Default fallback
  return error.message || "An unexpected error occurred. Please try again.";
};

export const createApiError = async (response) => {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    // If response is not JSON, create error from status
    return new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }

  return new ApiError(
    errorData.error ||
      errorData.message ||
      `Request failed with status ${response.status}`,
    response.status,
    errorData.details
  );
};

export const logError = (error, context = "", additionalInfo = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
    },
    additionalInfo,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // In production, you might want to send this to a logging service
  if (import.meta.env.PROD) {
    // Example: Send to logging service
    // sendToLoggingService(errorLog);
  }

  return errorLog;
};
