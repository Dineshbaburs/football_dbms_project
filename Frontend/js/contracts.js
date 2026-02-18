document.addEventListener("DOMContentLoaded", loadContracts);

async function loadContracts() {
    try {
        const response = await fetch(`${BASE_URL}/reports`); // Using the report logic for contract overview
        const data = await response.json();
        const contractTable = document.getElementById("contractTable");
        contractTable.innerHTML = "";

        data.forEach(c => {
            contractTable.innerHTML += `
            <tr>
                <td>${c.club_name}</td>
                <td>${c.total} Players</td>
                <td>Active</td>
                <td>
                    <button class="danger" disabled title="Reports are read-only">N/A</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load contracts report:", err);
    }
}