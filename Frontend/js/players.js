document.addEventListener("DOMContentLoaded", loadPlayers);

async function loadPlayers() {
    try {
        const data = await API.request('/players');
        const table = document.getElementById("playerTable");
        table.innerHTML = "";

        data.forEach(p => {
            table.innerHTML += `
            <tr>
                <td>${p.f_name} ${p.l_name}</td>
                <td>${p.age}</td>
                <td>${p.position}</td>
                <td>${p.club_name}</td>
                <td>₹${Number(p.market_value || 0).toLocaleString()}</td>
                <td>
                    <button class="danger" onclick="deletePlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
        if (window.checkPermissions) checkPermissions();
    } catch (e) { console.error(e); }
}

async function savePlayer() {
    const payload = {
        f_name: document.getElementById("f_name").value,
        l_name: document.getElementById("l_name").value,
        age: parseInt(document.getElementById("age").value),
        position: document.getElementById("position").value,
        market_value: document.getElementById("market_value").value,
        club_id: document.getElementById("club_id").value
    };

    try {
        await API.request('/players', { method: 'POST', body: JSON.stringify(payload) });
        alert("Success! Trigger checked the age constraint.");
        closeModal('playerModal');
        loadPlayers();
    } catch (e) { alert("Error: " + e.message); }
}

async function deletePlayer(id) {
    if (confirm("Delete player? This will be logged via SQL Trigger.")) {
        await API.request(`/players/${id}`, { method: 'DELETE' });
        loadPlayers();
    }
}