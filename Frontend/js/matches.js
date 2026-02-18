document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await API.request('/matches');
        const table = document.getElementById("matchTable");
        table.innerHTML = "";

        data.forEach(m => {
            table.innerHTML += `
            <tr>
                <td>${new Date(m.match_date).toLocaleDateString()}</td>
                <td><strong>${m.type}</strong></td>
                <td>${m.club_name}</td>
                <td>${m.stadium_name}</td>
                <td>Confirmed</td>
            </tr>`;
        });
    } catch (e) { console.error(e); }
});