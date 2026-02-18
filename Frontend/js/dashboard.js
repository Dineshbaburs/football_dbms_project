document.addEventListener("DOMContentLoaded", async () => {
    try {
        const stats = await API.request('/dashboard-summary');

        // Mapping Backend variables to HTML IDs
        document.getElementById("totalPlayers").innerText = stats.totalPlayers || 0;
        document.getElementById("totalClubs").innerText = stats.totalClubs || 0;

        // Formatting currency for the "Total Budget" (SUM aggregate requirement)
        const budget = stats.totalBudget || 0;
        document.getElementById("totalValue").innerText = `₹${Number(budget).toLocaleString()}`;

        // Showing Average Salary (AVG aggregate requirement)
        const avg = stats.avgSalary || 0;
        document.getElementById("avgSalary").innerText = `Avg: ₹${Math.round(avg).toLocaleString()}`;

    } catch (e) {
        console.error("Dashboard Load Error:", e);
    }
});