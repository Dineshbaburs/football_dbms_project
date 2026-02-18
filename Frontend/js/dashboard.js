document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
    try {
        const stats = await API.request('/dashboard-summary');

        // Update the UI with aggregated data
        document.getElementById("totalPlayers").innerText = stats.totalPlayers || 0;
        document.getElementById("totalClubs").innerText = stats.totalClubs || 0;
        document.getElementById("totalValue").innerText = `₹${Number(stats.totalBudget).toLocaleString()}`;

        // Use of Aggregate Functions (AVG) from the backend
        const avgEl = document.getElementById("avgSalary");
        if (avgEl) {
            avgEl.innerText = `Average Salary: ₹${Math.round(stats.avgSalary).toLocaleString()}`;
        }
    } catch (err) {
        console.error("Dashboard failed to load:", err);
    }
}