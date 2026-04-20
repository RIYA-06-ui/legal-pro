// Main API service - simplified without Google Drive
export {
  isAuthenticated,
  getCurrentUser,
  handleApiError,
} from "./documentService.js";

// Import the new document service for direct uploads
export { default as documentService } from "./documentService.js";
