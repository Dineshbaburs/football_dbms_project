document.addEventListener("DOMContentLoaded", loadClubs);

async function loadClubs(){
    const data = await getData("clubs");
    clubTable.innerHTML="";
    data.forEach(c=>{
        clubTable.innerHTML+=`
        <tr>
        <td>${c.club_name}</td>
        <td>${c.country||'-'}</td>
        <td>${c.manager_name||'-'}</td>
        <td>₹${c.budget||0}</td>
        <td>
            <button onclick="deleteClub(${c.club_id})">Delete</button>
        </td>
        </tr>`;
    });
}

async function saveClub(){
    await postData("clubs",{
        club_name:club_name.value,
        founded_year:founded_year.value,
        total_trophies:total_trophies.value,
        owner_name:owner_name.value,
        manager_name:manager_name.value,
        country:country.value,
        budget:budget.value,
        stadium_id:stadium_id.value
    });
    closeModal('clubModal');
    loadClubs();
}

async function deleteClub(id){
    await deleteData(`clubs/${id}`);
    loadClubs();
}
