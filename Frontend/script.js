const API_URL = 'http://localhost:8081';
let myChart = null; // Global chart instance

document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    loadClubs(); // Populate dropdowns
});

// --- 1. CORE DATA FUNCTIONS ---
function loadPlayers() {
    fetch(`${API_URL}/players`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('playersTableBody');
            tbody.innerHTML = "";
            data.forEach(p => {
                tbody.innerHTML += `
                <tr>
                    <td>${p.Player_ID}</td>
                    <td><b>${p.F_Name} ${p.L_Name}</b></td>
                    <td><span class="badge ${p.Position}">${p.Position}</span></td>
                    <td>${p.Club_Name || 'Unknown'}</td>
                    <td>
                        <button class="btn-icon edit" onclick="openEdit(${p.Player_ID}, '${p.F_Name}', '${p.Position}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon del" onclick="delPlayer(${p.Player_ID})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
            });
        });
}

// Fetch Clubs for the Dropdown (New Feature)
function loadClubs() {
    fetch(`${API_URL}/clubs`)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('club_select');
            select.innerHTML = '<option value="">Select Club...</option>';
            data.forEach(c => {
                select.innerHTML += `<option value="${c.Club_ID}">${c.Club_Name}</option>`;
            });
        });
}

// --- 2. ACTIONS ---
function addPlayer() {
    const data = {
        f_name: document.getElementById('fname').value,
        l_name: document.getElementById('lname').value,
        position: document.getElementById('position').value,
        club_id: document.getElementById('club_select').value
    };
    
    fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(() => {
        closeModal('addModal');
        showToast('✅ Player Signed!');
        loadPlayers();
    });
}

function updatePlayer() {
    const id = document.getElementById('edit_id').value;
    const pos = document.getElementById('edit_position').value;
    
    fetch(`${API_URL}/players/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ position: pos })
    }).then(() => {
        closeModal('editModal');
        showToast('🔄 Info Updated');
        loadPlayers();
    });
}

function delPlayer(id) {
    if(confirm("Release this player?")) {
        fetch(`${API_URL}/players/${id}`, { method: 'DELETE' })
        .then(() => {
            showToast('🗑️ Player Released');
            loadPlayers();
        });
    }
}

// --- 3. REPORTS & CHART (New Feature) ---
function loadReports() {
    fetch(`${API_URL}/reports`)
        .then(res => res.json())
        .then(data => {
            // 1. Text Cards
            const grid = document.getElementById('statsGrid');
            grid.innerHTML = "";
            const labels = [];
            const values = [];
            
            data.forEach(d => {
                grid.innerHTML += `
                <div class="stat-card">
                    <h3>${d.Club_Name}</h3>
                    <div class="num">${d.Total}</div>
                    <p>Players</p>
                </div>`;
                labels.push(d.Club_Name);
                values.push(d.Total);
            });

            // 2. Render Pie Chart
            renderChart(labels, values);
        });
}

function renderChart(labels, data) {
    const ctx = document.getElementById('clubChart').getContext('2d');
    if(myChart) myChart.destroy(); // Destroy old chart before creating new one
    
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- 4. UTILS ---
function switchTab(tab) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    if(tab === 'reports') loadReports();
}

function openAddModal() { document.getElementById('addModal').style.display = 'block'; loadClubs(); }
function openEdit(id, name, pos) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = name;
    document.getElementById('edit_position').value = pos;
    document.getElementById('editModal').style.display = 'block';
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.className = "show";
    setTimeout(() => t.className = t.className.replace("show", ""), 3000);
}

function searchTable() {
    const filter = document.getElementById('searchInput').value.toUpperCase();
    const rows = document.getElementById('playersTableBody').getElementsByTagName('tr');
    for (let row of rows) {
        const txt = row.cells[1].textContent;
        row.style.display = txt.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}

function sortTable(n) {
    const table = document.getElementById("sortableTable");
    let rows, switching = true, i, x, y, shouldSwitch, dir = "asc", switchcount = 0;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) { shouldSwitch = true; break; }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) { shouldSwitch = true; break; }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") { dir = "desc"; switching = true; }
        }
    }
}