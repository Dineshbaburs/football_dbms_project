document.addEventListener("DOMContentLoaded", () => {
    loadPlayers();
    loadClubsForDropdown();
});

async function loadPlayers() {
    try {
        const response = await fetch('http://localhost:3000/players');
        const data = await response.json();

        const table = document.getElementById("playerTable");
        table.innerHTML = "";

        data.forEach(p => {
            table.innerHTML += `
            <tr>
                <td>${p.full_name}</td>
                <td>${p.position || 'N/A'}</td>
                <td>${p.nationality || 'N/A'}</td>
                <td>${p.club_name || 'Free Agent'}</td>
                <td>$${Number(p.market_value || 0).toLocaleString()}</td>
                <td class="admin-only">
                    <button class="danger" onclick="deletePlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
        checkPermissions();
    } catch (e) { console.error("Error loading players:", e); }
}

async function loadClubsForDropdown() {
    try {
        const response = await fetch('http://localhost:3000/clubs');
        const clubs = await response.json();
        const select = document.getElementById("club_id");

        clubs.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.club_id;
            opt.innerText = c.club_name;
            select.appendChild(opt);
        });
    } catch (e) { console.error("Error loading clubs:", e); }
}

async function savePlayer() {
    const payload = {
        first_name: document.getElementById("f_name").value,
        last_name: document.getElementById("l_name").value,
        dob: document.getElementById("dob").value,
        nationality: document.getElementById("nationality").value,
        position: document.getElementById("position").value,
        market_value: document.getElementById("market_value").value,
        club_id: document.getElementById("club_id").value || null
    };

    try {
        const res = await fetch('http://localhost:3000/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeModal('playerModal');
            loadPlayers();
        } else {
            const err = await res.json();
            alert(err.error);
        }
    } catch (e) { alert("Failed to save player."); }
}

async function deletePlayer(id) {
    if (!confirm("Are you sure?")) return;
    try {
        await fetch(`http://localhost:3000/players/${id}`, { method: 'DELETE' });
        loadPlayers();
    } catch (e) { console.error(e); }
}

function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

function checkPermissions() {
    const role = localStorage.getItem('role') || 'user';
    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
}

function logout() {
    localStorage.removeItem('role');
    window.location.href = "login.html";
}