document.addEventListener("DOMContentLoaded", loadContracts);

async function loadContracts() {
    try {
        const data = await API.request('/contracts');
        const contractTable = document.getElementById("contractTable");
        contractTable.innerHTML = "";

        data.forEach(c => {
            contractTable.innerHTML += `
            <tr>
                <td>${c.f_name} ${c.l_name}</td>
                <td>${new Date(c.start_date).toLocaleDateString()}</td>
                <td>₹${Number(c.salary).toLocaleString()}</td>
                <td>Active</td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load contracts:", err);
    }
}

/**
 * DBMS Concept: Demonstrates row-by-row processing via SQL Cursor
 */
async function runAnnualRaise() {
    if (confirm("Are you sure you want to run the SQL Procedure?\nThis uses a CURSOR to increase all salaries by 10% row-by-row.")) {
        try {
            const res = await API.request('/contracts/increase-salaries', { method: 'POST' });
            alert(res.message);
            loadContracts(); // Refresh to see the new salaries
        } catch (err) {
            alert("Procedure failed: " + err.message);
        }
    }
}