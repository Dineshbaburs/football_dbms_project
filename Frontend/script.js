const API_URL = 'http://localhost:8081';

// 1. READ: Load Players
function loadPlayers() {
    fetch(`${API_URL}/players`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('playersTable');
            table.innerHTML = "";
            data.forEach(player => {
                const row = `<tr>
                    <td>${player.Player_ID}</td>
                    <td>${player.F_Name} ${player.L_Name}</td>
                    <td>${player.Position}</td>
                    <td>${player.Club_Name || 'No Club'}</td>
                </tr>`;
                table.innerHTML += row;
            });
        })
        .catch(err => console.log(err));
}

// 2. CREATE: Add Player
function addPlayer() {
    const f_name = document.getElementById('fname').value;
    const l_name = document.getElementById('lname').value;
    const position = document.getElementById('position').value;
    const club_id = document.getElementById('club_id').value;

    fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f_name, l_name, position, club_id })
    })
    .then(res => res.json())
    .then(msg => {
        alert(msg);
        loadPlayers(); // Refresh list
    });
}

// 3. DELETE: Remove Player
function deletePlayer() {
    const id = document.getElementById('delete_id').value;
    if(!id) return alert("Enter an ID!");

    fetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(msg => {
        alert(msg);
        loadPlayers();
    });
}

// 4. UPDATE: Change Position
function updatePlayer() {
    const id = document.getElementById('update_id').value;
    const position = document.getElementById('new_position').value;
    if(!id) return alert("Enter an ID!");

    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: position })
    })
    .then(res => res.json())
    .then(msg => {
        alert(msg);
        loadPlayers();
    });
}

// 5. REPORT: Load Stats
function loadReports() {
    fetch(`${API_URL}/reports`)
        .then(res => res.json())
        .then(data => {
            const area = document.getElementById('reportArea');
            area.innerHTML = "<h4>Total Players per Club:</h4><ul>";
            data.forEach(item => {
                area.innerHTML += `<li>${item.Club_Name}: <strong>${item.Total_Players}</strong> players</li>`;
            });
            area.innerHTML += "</ul>";
        });
}

// Load automatically on start
loadPlayers();