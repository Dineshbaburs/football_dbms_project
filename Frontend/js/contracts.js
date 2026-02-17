document.addEventListener("DOMContentLoaded", loadContracts);

async function loadContracts(){
    const data = await getData("contracts");
    contractTable.innerHTML="";
    data.forEach(c=>{
        contractTable.innerHTML+=`
        <tr>
        <td>${c.player_id}</td>
        <td>${c.club_id}</td>
        <td>₹${c.salary}</td>
        <td>${c.start_date}</td>
        <td>${c.end_date}</td>
        <td>
            <button onclick="deleteContract(${c.contract_id})">Delete</button>
        </td>
        </tr>`;
    });
}

async function saveContract(){
    await postData("contracts",{
        player_id:player_id.value,
        club_id:club_id_c.value,
        salary:salary.value,
        start_date:start_date.value,
        end_date:end_date.value,
        bonus:bonus.value,
        release_clause:release_clause.value
    });
    closeModal('contractModal');
    loadContracts();
}

async function deleteContract(id){
    await deleteData(`contracts/${id}`);
    loadContracts();
}
