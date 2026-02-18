document.addEventListener("DOMContentLoaded", loadMatches);

async function loadMatches() {
    try {
        const data = await API.getMatches();
        const matchTable = document.getElementById("matchTable");
        matchTable.innerHTML = "";

        data.forEach(m => {
            matchTable.innerHTML += `
            <tr>
                <td>${new Date(m.match_date).toLocaleDateString()}</td>
                <td>${m.match_type}</td>
                <td>${m.home_team || m.home_club}</td>
                <td>${m.away_team || m.away_club}</td>
                <td>${m.status || 'Scheduled'}</td>
                <td>
                    <button class="danger" onclick="deleteMatch(${m.match_id})">Delete</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load matches:", err);
    }
}

async function saveMatch() {
    const matchData = {
        match_type: document.getElementById("match_type").value,
        match_date: document.getElementById("match_date").value,
        home_club: document.getElementById("home_club").value,
        away_club: document.getElementById("away_club").value,
        stadium_id: document.getElementById("stadium_id_m").value,
        status: document.getElementById("status").value
    };

    try {
        await fetch(`${BASE_URL}/matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matchData)
        });
        closeModal('matchModal');
        loadMatches();
    } catch (err) {
        console.error("Failed to save match:", err);
    }
}

async function deleteMatch(id) {
    if (confirm("Are you sure you want to delete this match record?")) {
        try {
            await API.deleteMatch(id);
            loadMatches();
        } catch (err) {
            console.error("Failed to delete match:", err);
        }
    }
}