document.addEventListener("DOMContentLoaded", loadPlayers);

async function loadPlayers() {
    try {
        const data = await API.request('/players');
        const playerTable = document.getElementById("playerTable");
        playerTable.innerHTML = "";

        data.forEach(p => {
            playerTable.innerHTML += `
            <tr>
                <td>${p.f_name} ${p.l_name}</td>
                <td>${p.age}</td>
                <td>${p.position}</td>
                <td>${p.club_name || 'Free Agent'}</td>
                <td>₹${Number(p.market_value).toLocaleString()}</td>
                <td>
                    <button class="danger" onclick="deletePlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
        checkPermissions();
    } catch (err) {
        console.error("Failed to load players view:", err);
    }
}

async function savePlayer() {
    const playerData = {
        f_name: document.getElementById("f_name").value,
        l_name: document.getElementById("l_name").value,
        age: parseInt(document.getElementById("age").value),
        position: document.getElementById("position").value,
        nationality: document.getElementById("nationality").value,
        market_value: document.getElementById("market_value").value,
        club_id: document.getElementById("club_id").value
    };

    try {
        const res = await API.request('/players', {
            method: 'POST',
            body: JSON.stringify(playerData)
        });
        alert(res.message);
        closeModal('playerModal');
        loadPlayers();
    } catch (err) {
        alert("DB Validation Failed: " + err.message);
    }
}

async function deletePlayer(id) {
    if (confirm("Delete this player? The database Trigger will automatically log this action.")) {
        try {
            const res = await API.request(`/players/${id}`, { method: 'DELETE' });
            alert(res.message);
            loadPlayers();
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
}