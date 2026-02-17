const API = "http://localhost:8081";

async function getData(endpoint){
    const res = await fetch(`${API}/${endpoint}`);
    return await res.json();
}

async function postData(endpoint,data){
    await fetch(`${API}/${endpoint}`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    });
}

async function putData(endpoint,data){
    await fetch(`${API}/${endpoint}`,{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    });
}

async function deleteData(endpoint){
    await fetch(`${API}/${endpoint}`,{method:"DELETE"});
}
