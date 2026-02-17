const API = "http://localhost:8081";

document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    loadClubs();
});

/* VIEW */
function loadPlayers(){
    fetch(`${API}/players`).then(r=>r.json()).then(data=>{
        if(!playersTableBody) return;
        playersTableBody.innerHTML="";
        data.forEach(p=>{
            playersTableBody.innerHTML+=`
            <tr>
                <td>${p.player_id}</td>
                <td>${p.f_name} ${p.l_name}</td>
                <td>${p.position}</td>
                <td>${p.club_name||'N/A'}</td>
                <td>
                    <button onclick="location.href='edit-player.html?id=${p.player_id}'">Edit</button>
                    <button onclick="delPlayer(${p.player_id})">Delete</button>
                </td>
            </tr>`;
        });
    });
}

/* CLUBS */
function loadClubs(){
    fetch(`${API}/clubs`).then(r=>r.json()).then(data=>{
        if(!club_select) return;
        club_select.innerHTML="";
        data.forEach(c=>club_select.innerHTML+=`<option value="${c.club_id}">${c.club_name}</option>`);
    });
}

/* INSERT */
function addPlayer(){
    fetch(`${API}/players`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({f_name:fname.value,l_name:lname.value,position:position.value,club_id:club_select.value})
    }).then(()=>location="dashboard.html");
}

/* UPDATE */
function updatePlayer(){
    const id=new URLSearchParams(window.location.search).get('id');
    fetch(`${API}/players/${id}`,{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({position:edit_position.value})
    }).then(()=>location="dashboard.html");
}

/* DELETE */
function delPlayer(id){
    fetch(`${API}/players/${id}`,{method:"DELETE"}).then(loadPlayers);
}

/* REPORTS */
if(document.getElementById('clubChart')){
    fetch(`${API}/reports`).then(r=>r.json()).then(data=>{
        new Chart(clubChart,{type:'pie',
            data:{labels:data.map(d=>d.club_name),datasets:[{data:data.map(d=>d.player_count)}]}
        });
    });
}
