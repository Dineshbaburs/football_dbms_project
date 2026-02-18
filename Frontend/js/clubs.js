document.addEventListener("DOMContentLoaded", loadClubs);

async function loadClubs() {
    try {
        const data = await API.getClubs();
        const clubTable = document.getElementById("clubTable");
        clubTable.innerHTML = "";

        data.forEach(c => {
            clubTable.innerHTML += `
            <tr>
                <td>${c.club_name}</td>
                <td>${c.country || '-'}</td>
                <td>${c.manager_name || '-'}</td>
                <td>₹${c.budget || 0}</td>
                <td>
                    <button class="danger" onclick="deleteClub(${c.club_id})">Delete</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load clubs:", err);
    }
}

async function saveClub() {
    const clubData = {
        club_name: document.getElementById("club_name").value,
        founded_year: document.getElementById("founded_year").value,
        total_trophies: document.getElementById("total_trophies").value || 0,
        owner_name: document.getElementById("owner_name").value,
        manager_name: document.getElementById("manager_name").value,
        country: document.getElementById("country").value,
        budget: document.getElementById("budget").value,
        stadium_id: document.getElementById("stadium_id").value
    };

    try {
        await fetch(`${BASE_URL}/clubs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clubData)
        });
        closeModal('clubModal');
        loadClubs();
    } catch (err) {
        console.error("Failed to save club:", err);
    }
}

async function deleteClub(id) {
    if (confirm("Are you sure you want to delete this club?")) {
        try {
            await API.deleteClub(id);
            loadClubs();
        } catch (err) {
            console.error("Failed to delete club:", err);
        }
    }
}