// 1. Fetch and Display Players on Load
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:8081/players')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('playersTable');
            tableBody.innerHTML = ''; // Clear existing data
            
            data.forEach(player => {
                const row = `<tr>
                    <td>${player.Player_ID}</td>
                    <td>${player.F_Name}</td>
                    <td>${player.L_Name}</td>
                    <td>${player.Position}</td>
                    <td>${player.Club_ID}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Error:', err));
});

// 2. Send New Player Data to Backend
function addPlayer() {
    const f_name = document.getElementById('fname').value;
    const l_name = document.getElementById('lname').value;
    const position = document.getElementById('position').value;
    const club_id = document.getElementById('club_id').value;

    fetch('http://localhost:8081/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f_name, l_name, position, club_id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        location.reload(); // Refresh to see new player
    })
    .catch(err => console.error('Error:', err));
}