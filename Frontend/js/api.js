const BASE_URL = 'http://localhost:8081';

const API = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Server error");
            return data;
        } catch (err) {
            console.error("Connection Failed:", err.message);
            throw err;
        }
    }
};