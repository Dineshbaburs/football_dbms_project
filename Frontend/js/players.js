document.addEventListener("DOMContentLoaded",loadPlayers);

async function loadPlayers(){
    const data = await getData("players");
    playerTable.innerHTML="";
    data.forEach(p=>{
        playerTable.innerHTML+=`
        <tr>
        <td>${p.f_name} ${p.l_name}</td>
        <td>${p.position}</td>
        <td>${p.club_name||'-'}</td>
        <td>₹${p.market_value||0}</td>
        <td>
            <button onclick="deletePlayer(${p.player_id})">Delete</button>
        </td>
        </tr>`;
    });
}

async function savePlayer(){
    await postData("players",{
        f_name:f_name.value,
        l_name:l_name.value,
        position:position.value,
        market_value:market_value.value,
        club_id:club_id.value
    });
    closeModal('playerModal');
    loadPlayers();
}

async function deletePlayer(id){
    await deleteData(`players/${id}`);
    loadPlayers();
}
