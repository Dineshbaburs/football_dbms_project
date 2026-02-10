const API_URL = 'http://localhost:8081';

// --- NAVIGATION & UI LOGIC ---
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    // Show selected
    document.getElementById(sectionId).style.display = 'block';
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Auto-load data if needed
    if(sectionId === 'view-section') loadPlayers();
    if(sectionId === 'report-section') loadReports();
}

// --- 1. VIEW PLAYERS & SEARCH ---
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
                    <td><span class="badge">${player.Position}</span></td>
                    <td>${player.Club_Name || 'Free Agent'}</td>
                    <td>
                        <button class="btn-sm btn-edit" onclick="fillUpdateForm(${player.Player_ID})">Edit</button>
                        <button class="btn-sm btn-del" onclick="deleteRow(${player.Player_ID})">Delete</button>
                    </td>
                </tr>`;
                table.innerHTML += row;
            });
        });
}

function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const rows = document.getElementById("mainTable").getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let td = rows[i].getElementsByTagName("td")[1]; // Searching Name Column
        if (td) {
            let txtValue = td.textContent || td.innerText;
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
        alert(msg);
        document.getElementById('fname').value = ''; // Clear form
        document.getElementById('lname').value = '';
        showSection('view-section'); // Go back to list
        loadPlayers();
    });
}

// --- 3. UPDATE PLAYER ---
function fillUpdateForm(id) {
    // Switch to Update Tab
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('update-section').style.display = 'block';
    
    // Fill ID automatically
    document.getElementById('update_id').value = id;
}

function updatePlayer() {
    const id = document.getElementById('update_id').value;
    const position = document.getElementById('new_position').value;
    
    if(!id) return alert("No ID selected!");

    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
    }).then(res => res.json()).then(msg => {
        alert(msg);
        showSection('view-section');
        loadPlayers();
    });
}

// --- 4. DELETE PLAYER ---
function deleteRow(id) {
    if(confirm("Are you sure you want to delete Player ID " + id + "?")) {
        fetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(msg => {
            loadPlayers(); // Refresh table immediately
        });
    }
}

function deletePlayer() {
    // Manual delete from the form
    const id = document.getElementById('delete_id').value;
    deleteRow(id);
}

// --- 5. REPORTS ---
function loadReports() {
    fetch(`${API_URL}/reports`)
    .then(res => res.json())
    .then(data => {
        const area = document.getElementById('reportArea');
        area.innerHTML = "";
        data.forEach(item => {
            const card = `
            <div class="stat-card">
                <h3>${item.Club_Name}</h3>
                <div class="stat-number">${item.Total_Players}</div>
                <p>Registered Players</p>
            </div>`;
            area.innerHTML += card;
        });
    });
}

// Init
loadPlayers();