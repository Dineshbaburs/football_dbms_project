document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
    try {
        const stats = await API.getDashboardSummary();

        document.getElementById("totalPlayers").innerText = stats.totalPlayers || 0;
        document.getElementById("totalClubs").innerText = stats.totalClubs || 0;
        document.getElementById("totalValue").innerText = `₹${Number(stats.totalValue).toLocaleString()}`;

        if (stats.highestPaid) {
            document.getElementById("topPlayer").innerText = `${stats.highestPaid.name} (₹${Number(stats.highestPaid.market_value).toLocaleString()})`;
        } else {
            document.getElementById("topPlayer").innerText = "N/A";
        }
    } catch (err) {
        console.error("Failed to load dashboard:", err);
    }
}