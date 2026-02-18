const BASE_URL = 'http://localhost:8081';

const API = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Server Error");
            }
            return await response.json();
        } catch (err) {
            console.error("Fetch failed:", err);
            throw err;
        }
    }
};