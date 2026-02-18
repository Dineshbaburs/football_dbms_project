document.addEventListener("DOMContentLoaded", loadPlayers);

async function loadPlayers() {
    try {
        const data = await API.getPlayers();
        const playerTable = document.getElementById("playerTable");
        playerTable.innerHTML = "";

        data.forEach(p => {
            playerTable.innerHTML += `
            <tr>
                <td>${p.f_name} ${p.l_name}</td>
                <td>${p.position}</td>
                <td>${p.club_name || '-'}</td>
                <td>₹${p.market_value || 0}</td>
                <td>
                    <button class="danger" onclick="deletePlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load players:", err);
    }
}

async function savePlayer() {
    const playerData = {
        f_name: document.getElementById("f_name").value,
        l_name: document.getElementById("l_name").value,
        position: document.getElementById("position").value,
        market_value: document.getElementById("market_value").value,
        club_id: document.getElementById("club_id").value
    };

    try {
        await API.addPlayer(playerData);
        closeModal('playerModal');
        loadPlayers();
    } catch (err) {
        console.error("Failed to save player:", err);
    }
}

async function deletePlayer(id) {
    if (confirm("Are you sure you want to delete this player?")) {
        try {
            await API.deletePlayer(id);
            loadPlayers();
        } catch (err) {
            console.error("Failed to delete player:", err);
        }
    }
}