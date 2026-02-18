document.addEventListener("DOMContentLoaded", async () => {
    try {
        const stats = await API.request('/dashboard-summary');
        document.getElementById("totalPlayers").innerText = stats.totalPlayers || 0;
        document.getElementById("totalClubs").innerText = stats.totalClubs || 0;
        document.getElementById("totalValue").innerText = `₹${Number(stats.totalValue).toLocaleString()}`;
        document.getElementById("avgSalary").innerText = `Avg Value: ₹${Math.round(stats.avgSalary).toLocaleString()}`;
    } catch (e) { console.error("Dashboard error:", e); }
});