// Global URL
const API_URL = 'http://localhost:8081';

// 1. Fetch and Display Players (READ)
function loadPlayers() {
    fetch(`${API_URL}/players`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('playersTable');
            tableBody.innerHTML = ''; 
            
            data.forEach(player => {
                const row = `<tr>
                    <td>${player.Player_ID}</td>
                    <td>${player.F_Name} ${player.L_Name}</td>
                    <td>${player.Position}</td>
                    <td>${player.Club_Name || 'Free Agent'}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Error:', err));
}

// 2. Add New Player (CREATE)
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
    .then(response => response.json())
    .then(data => {
        alert(data);
        loadPlayers(); // Refresh list
    });
}

// 3. Delete Player (DELETE)
function deletePlayer() {
    const id = document.getElementById('delete_id').value;
    if(!id) return alert("Please enter an ID");

    fetch(`${API_URL}/players/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        loadPlayers();
    });
}

// 4. Update Player (UPDATE)
function updatePlayer() {
    const id = document.getElementById('update_id').value;
    const position = document.getElementById('new_position').value;
    if(!id) return alert("Please enter an ID");

    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: position })
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        loadPlayers();
    });
}

// 5. Load Stats (REPORT)
function loadStats() {
    fetch(`${API_URL}/stats`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('statsList');
            list.innerHTML = '';
            data.forEach(stat => {
                list.innerHTML += `<li><strong>${stat.Club_Name}:</strong> ${stat.Player_Count} Players</li>`;
            });
        });
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadPlayers);