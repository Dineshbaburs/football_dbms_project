document.addEventListener("DOMContentLoaded", loadStadiums);

async function loadStadiums() {
    try {
        const data = await API.request('/stadiums');
        const stadiumTable = document.getElementById("stadiumTable");

        if (!stadiumTable) return;
        stadiumTable.innerHTML = "";

        data.forEach(s => {
            stadiumTable.innerHTML += `
            <tr>
                <td>${s.stadium_name}</td>
                <td>${s.city}</td>
                <td>${Number(s.capacity).toLocaleString()}</td>
                <td>
                    <button class="danger" disabled title="DBMS: Referenced in Match Info">Delete</button>
                </td>
            </tr>`;
        });

        if (typeof checkPermissions === "function") checkPermissions();

    } catch (err) {
        console.error("Failed to load stadiums:", err);
    }
}