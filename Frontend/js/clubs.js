document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await API.request('/clubs');
        const table = document.getElementById("clubTable");
        table.innerHTML = "";

        data.forEach(c => {
            table.innerHTML += `
            <tr>
                <td>${c.club_name}</td>
                <td>${c.founded_year}</td>
                <td>${c.total_trophies}</td>
                <td>${c.owner_name}</td>
                <td><button disabled title="FK Constraints Active">Protected</button></td>
            </tr>`;
        });
        if (window.checkPermissions) checkPermissions();
    } catch (e) { console.error(e); }
});