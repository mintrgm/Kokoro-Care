import axiosInstance from "../utils/axiosInstance";

const apiService = {
  /**
   * Send a query to the medical chatbot
   * @param {string} query - The user's medical question
   * @returns {Promise} - Promise containing the response data
   */
  sendMessage: async (query) => {
    try {
      const response = await axiosInstance.post("/api/chat", { query });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  /**
   * Check if the API service is available
   * @returns {Promise} - Promise containing the status
   */
  checkStatus: async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data;
    } catch (error) {
      console.error("API Status Check Error:", error);
      throw error;
    }
  },
};

export default apiService;
