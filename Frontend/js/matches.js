document.addEventListener("DOMContentLoaded", loadMatches);

/**
 * DBMS Concept: Demonstrating JOIN results (Club + Stadium + Match)
 * and String Functions (UPPER case match types).
 */
async function loadMatches() {
    try {
        const data = await API.request('/matches');
        const matchTable = document.getElementById("matchTable");

        if (!matchTable) return;
        matchTable.innerHTML = "";

        data.forEach(m => {
            // match_date formatting
            const dateStr = new Date(m.match_date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            matchTable.innerHTML += `
            <tr>
                <td>${dateStr}</td>
                <td><strong>${m.type}</strong></td> <td>${m.club_name}</td>
                <td>${m.stadium_name}</td>
                <td><span class="status-pill">Scheduled</span></td>
            </tr>`;
        });

        if (typeof checkPermissions === "function") checkPermissions();

    } catch (err) {
        console.error("Failed to load match schedule:", err);
    }
}