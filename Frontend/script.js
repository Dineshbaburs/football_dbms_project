const API_URL = 'http://localhost:8081';

// 1. READ
function loadPlayers() {
    fetch(`${API_URL}/players`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('playersTableBody');
            table.innerHTML = "";
            data.forEach(player => {
                const row = `<tr>
                    <td>${player.Player_ID}</td>
                    <td>${player.F_Name} ${player.L_Name}</td>
                    <td>${player.Position}</td>
                    <td>${player.Club_Name || 'None'}</td>
                </tr>`;
                table.innerHTML += row;
            });
        });
}

// 2. CREATE
function addPlayer() {
    const f_name = document.getElementById('fname').value;
    const l_name = document.getElementById('lname').value;
    const position = document.getElementById('position').value;
    const club_id = document.getElementById('club_id').value;

    fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f_name, l_name, position, club_id })
    }).then(res => res.json()).then(msg => {
        alert(msg);
        loadPlayers();
    });
}

// 3. UPDATE
function updatePlayer() {
    const id = document.getElementById('update_id').value;
    const position = document.getElementById('new_position').value;
    
    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
    }).then(res => res.json()).then(msg => {
        alert(msg);
        loadPlayers();
    });
}

// 4. DELETE
function deletePlayer() {
    const id = document.getElementById('delete_id').value;
    fetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
    .then(res => res.json()).then(msg => {
        alert(msg);
        loadPlayers();
    });
}

// 5. REPORT
function loadReports() {
    fetch(`${API_URL}/reports`)
    .then(res => res.json()).then(data => {
        const area = document.getElementById('reportArea');
        area.innerHTML = "<ul>" + data.map(i => `<li>${i.Club_Name}: ${i.Total_Players} Players</li>`).join('') + "</ul>";
    });
}

loadPlayers();