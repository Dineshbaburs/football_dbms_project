document.addEventListener("DOMContentLoaded", loadMatches);

async function loadMatches(){
    const data = await getData("matches");
    matchTable.innerHTML="";
    data.forEach(m=>{
        matchTable.innerHTML+=`
        <tr>
        <td>${m.match_date}</td>
        <td>${m.match_type}</td>
        <td>${m.home_team||m.home_club}</td>
        <td>${m.away_team||m.away_club}</td>
        <td>${m.status}</td>
        <td>
            <button onclick="deleteMatch(${m.match_id})">Delete</button>
        </td>
        </tr>`;
    });
}

async function saveMatch(){
    await postData("matches",{
        match_type:match_type.value,
        match_date:match_date.value,
        home_club:home_club.value,
        away_club:away_club.value,
        stadium_id:stadium_id_m.value,
        status:status.value
    });
    closeModal('matchModal');
    loadMatches();
}

async function deleteMatch(id){
    await deleteData(`matches/${id}`);
    loadMatches();
}
