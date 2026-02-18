document.addEventListener("DOMContentLoaded", async () => {
    try {
        const stats = await API.request('/dashboard-summary');

        // Match these IDs exactly to the dashboard.html elements
        document.getElementById("totalPlayers").innerText = stats.totalPlayers || 0;
        document.getElementById("totalClubs").innerText = stats.totalClubs || 0;

        // Format money for professional look
        const budget = stats.totalBudget || 0;
        document.getElementById("totalValue").innerText = `₹${Number(budget).toLocaleString()}`;

        const avg = stats.avgSalary || 0;
        document.getElementById("avgSalary").innerText = `₹${Math.round(avg).toLocaleString()}`;
    } catch (e) {
        console.error("Failed to load dashboard stats", e);
    }
});