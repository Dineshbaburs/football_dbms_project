document.addEventListener("DOMContentLoaded", loadClubs);

/**
 * DBMS Concept: Multi-table relational display
 */
async function loadClubs() {
    try {
        const data = await API.request('/clubs');
        const clubTable = document.getElementById("clubTable");

        if (!clubTable) return; // Guard clause
        clubTable.innerHTML = "";

        data.forEach(c => {
            clubTable.innerHTML += `
            <tr>
                <td>${c.club_name}</td>
                <td>${c.country || 'N/A'}</td>
                <td>${c.manager_name || 'Unassigned'}</td>
                <td>${c.founded_year || 'Unknown'}</td>
                <td>
                    <button class="danger" disabled title="DBMS: Restricted by Foreign Key">Delete</button>
                </td>
            </tr>`;
        });

        // Apply Admin/User role restrictions
        if (typeof checkPermissions === "function") checkPermissions();

    } catch (err) {
        console.error("Failed to load clubs:", err);
    }
}