async function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;

    // We use the dynamic BASE_URL from api.js if available, 
    // otherwise we hardcode the Docker mapping for this test.
    const targetUrl = 'http://localhost:8081/login';

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        if (!response.ok) {
            throw new Error("Invalid username or password");
        }

        const data = await response.json();

        // DBMS Requirement: Store role for Admin/User modules
        localStorage.setItem('role', data.role);
        console.log("Login successful, role:", data.role);

        window.location.href = "dashboard.html";
    } catch (err) {
        console.error("Connection Error:", err);
        alert("Login Failed: Make sure the Backend is running and credentials are correct (admin/admin).");
    }
}