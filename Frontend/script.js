const API_URL = 'http://localhost:8081';

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    loadReports();
});

// --- 1. VIEW & SEARCH ---
function loadPlayers() {
    fetch(`${API_URL}/players`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('playersTableBody');
            tbody.innerHTML = "";
            data.forEach(player => {
                const row = `
                <tr>
                    <td>#${player.Player_ID}</td>
                    <td class="player-name">${player.F_Name} ${player.L_Name}</td>
                    <td><span style="padding: 4px 8px; background: #e0f2fe; color: #0284c7; border-radius: 4px; font-size: 0.8rem;">${player.Position}</span></td>
                    <td>${player.Club_Name || 'Free Agent'}</td>
                    <td>
                        <button class="btn-icon edit-icon" onclick="openEditModal(${player.Player_ID}, '${player.F_Name} ${player.L_Name}', '${player.Position}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-icon delete-icon" onclick="deletePlayer(${player.Player_ID})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
}

function searchTable() {
    const filter = document.getElementById('searchInput').value.toUpperCase();
    const rows = document.getElementById('playersTableBody').getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const nameCol = rows[i].getElementsByClassName('player-name')[0];
        if (nameCol) {
            const txtValue = nameCol.textContent || nameCol.innerText;
            rows[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// --- 2. ADD PLAYER ---
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
        closeModal('addModal');
        showToast("✅ Player Signed Successfully!");
        loadPlayers();
        loadReports(); // Update stats
    });
}

// --- 3. DELETE PLAYER ---
function deletePlayer(id) {
    if(confirm("Are you sure you want to release this player?")) {
        fetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(msg => {
            showToast("🗑️ Player Removed");
            loadPlayers();
            loadReports();
        });
    }
}

// --- 4. EDIT PLAYER ---
function openEditModal(id, name, currentPos) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = name;
    document.getElementById('edit_position').value = currentPos;
    openModal('editModal');
}

function updatePlayer() {
    const id = document.getElementById('edit_id').value;
    const position = document.getElementById('edit_position').value;

    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
    }).then(res => res.json()).then(msg => {
        closeModal('editModal');
        showToast("🔄 Contract Updated");
        loadPlayers();
    });
}

// --- 5. REPORTS ---
function loadReports() {
    fetch(`${API_URL}/reports`)
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById('statsGrid');
        grid.innerHTML = "";
        data.forEach(stat => {
            const card = `
            <div class="stat-card">
                <h3>${stat.Club_Name}</h3>
                <div class="number">${stat.Total_Players}</div>
                <small>Registered Players</small>
            </div>`;
            grid.innerHTML += card;
        });
    });
}

// --- UI HELPERS ---
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function switchTab(tab) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    
    // Update Sidebar Active State
    const items = document.querySelectorAll('.sidebar li');
    items.forEach(item => item.classList.remove('active'));
    
    if(tab === 'dashboard') items[0].classList.add('active');
    if(tab === 'reports') items[1].classList.add('active');
}

function showToast(message) {
    const x = document.getElementById("toast");
    x.innerText = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// Close modal if clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}