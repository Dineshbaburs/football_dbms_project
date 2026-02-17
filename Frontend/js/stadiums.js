document.addEventListener("DOMContentLoaded", loadStadiums);

async function loadStadiums(){
    const data = await getData("stadiums");
    stadiumTable.innerHTML="";
    data.forEach(s=>{
        stadiumTable.innerHTML+=`
        <tr>
        <td>${s.stadium_name}</td>
        <td>${s.city}</td>
        <td>${s.capacity}</td>
        <td>${s.country||'-'}</td>
        <td>
            <button onclick="deleteStadium(${s.stadium_id})">Delete</button>
        </td>
        </tr>`;
    });
}

async function saveStadium(){
    await postData("stadiums",{
        stadium_name:stadium_name.value,
        city:city.value,
        capacity:capacity.value,
        country:country_s.value
    });
    closeModal('stadiumModal');
    loadStadiums();
}

async function deleteStadium(id){
    await deleteData(`stadiums/${id}`);
    loadStadiums();
}
