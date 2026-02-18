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
                <td>${p.age || 'N/A'}</td>
                <td>${p.position || 'N/A'}</td>
                <td>${p.club_name || 'Free Agent'}</td>
                <td>₹${Number(p.market_value || 0).toLocaleString()}</td>
                <td>
                    <button class="danger" onclick="deletePlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
        checkPermissions();
    } catch (e) { console.error("View Load Error:", e); }
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
        alert("Success! Trigger verified registration.");
        closeModal('playerModal');
        loadPlayers();
    } catch (e) { alert("Error: " + e.message); }
}

async function undoAction() {
    if (confirm("Undo the last registration? (Stored Procedure call)")) {
        try {
            const res = await API.request('/players/undo', { method: 'POST' });
            alert(res.message);
            loadPlayers();
        } catch (e) { alert(e.message); }
    }
}

async function deletePlayer(id) {
    if (confirm("Delete player? (Audit Trigger will log this)")) {
        await API.request(`/players/${id}`, { method: 'DELETE' });
        loadPlayers();
    }
}