document.addEventListener("DOMContentLoaded", loadStadiums);

async function loadStadiums() {
    try {
        const data = await API.getStadiums();
        const stadiumTable = document.getElementById("stadiumTable");
        stadiumTable.innerHTML = "";

        data.forEach(s => {
            stadiumTable.innerHTML += `
            <tr>
                <td>${s.stadium_name}</td>
                <td>${s.city}</td>
                <td>${s.capacity}</td>
                <td>${s.country || '-'}</td>
                <td>
                    <button class="danger" onclick="deleteStadium(${s.stadium_id})">Delete</button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load stadiums:", err);
    }
}

async function saveStadium() {
    const stadiumData = {
        stadium_name: document.getElementById("stadium_name").value,
        city: document.getElementById("city").value,
        capacity: document.getElementById("capacity").value,
        country: document.getElementById("country_s") ? document.getElementById("country_s").value : ""
    };

    try {
        await API.addStadium(stadiumData);
        closeModal('stadiumModal');
        loadStadiums();
    } catch (err) {
        console.error("Failed to save stadium:", err);
    }
}

async function deleteStadium(id) {
    if (confirm("Are you sure you want to delete this stadium?")) {
        try {
            await API.deleteStadium(id);
            loadStadiums();
        } catch (err) {
            console.error("Failed to delete stadium:", err);
        }
    }
}