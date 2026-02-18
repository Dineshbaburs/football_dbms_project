// Dynamic Base URL: If on localhost, use port 8081. Otherwise, use the current domain.
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : window.location.origin;

const API = {
    // Utility for generic fetch requests
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            return await response.json();
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("Connection to server failed. Make sure the backend is running.");
            throw err;
        }
    },

    // Players
    getPlayers: () => API.request('/players'),
    addPlayer: (data) => API.request('/players', { method: 'POST', body: JSON.stringify(data) }),
    deletePlayer: (id) => API.request(`/players/${id}`, { method: 'DELETE' }),

    // Clubs
    getClubs: () => API.request('/clubs'),
    deleteClub: (id) => API.request(`/clubs/${id}`, { method: 'DELETE' }),

    // Stadiums (Now fully connected)
    getStadiums: () => API.request('/stadiums'),
    addStadium: (data) => API.request('/stadiums', { method: 'POST', body: JSON.stringify(data) }),
    deleteStadium: (id) => API.request(`/stadiums/${id}`, { method: 'DELETE' }),

    // Matches (Now fully connected)
    getMatches: () => API.request('/matches'),
    deleteMatch: (id) => API.request(`/matches/${id}`, { method: 'DELETE' }),

    // Dashboard
    getDashboardSummary: () => API.request('/dashboard-summary'),
    getReports: () => API.request('/reports')
};