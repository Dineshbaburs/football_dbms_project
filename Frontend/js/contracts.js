document.addEventListener("DOMContentLoaded", loadContracts);

async function loadContracts() {
    try {
        const data = await API.request('/contracts');
        const table = document.getElementById("contractTable");
        table.innerHTML = "";

        data.forEach(c => {
            table.innerHTML += `
            <tr>
                <td>${c.f_name} ${c.l_name}</td>
                <td>${new Date(c.start_date).toLocaleDateString()}</td>
                <td>₹${Number(c.salary).toLocaleString()}</td>
                <td><span style="color:green">● Active</span></td>
            </tr>`;
        });
    } catch (e) { console.error(e); }
}

async function runAnnualRaise() {
    if (confirm("Run Cursor? This iterates through every contract and hikes salaries by 10%.")) {
        try {
            const res = await API.request('/contracts/increase-salaries', { method: 'POST' });
            alert(res.message);
            loadContracts();
        } catch (e) { alert(e.message); }
    }
}