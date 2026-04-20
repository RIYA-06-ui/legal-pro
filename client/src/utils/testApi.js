// API Configuration Test
// Run this in your browser console to test the API endpoint

const testApiConnection = async () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://lexi-gaurd.vercel.app/api";

  console.log("Testing API Base URL:", API_BASE_URL);

  try {
    const response = await fetch(
      `${API_BASE_URL.replace("/api", "")}/api/health`
    );
    const data = await response.json();
    console.log("✅ API Health Check:", data);
    return data;
  } catch (error) {
    console.error("❌ API Connection Failed:", error);
    return null;
  }
};

// Test the connection
testApiConnection();

export default testApiConnection;
