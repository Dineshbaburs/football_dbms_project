// Automatically detect if running on localhost or a deployed server
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : window.location.origin;

const API = {
    /**
     * Generic request handler for all API calls
     * @param {string} endpoint - The API path (e.g., '/players')
     * @param {object} options - Fetch options (method, body, etc.)
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Request failed");
            }
            return data;
        } catch (err) {
            console.error("API Error:", err.message);
            throw err;
        }
    }
};