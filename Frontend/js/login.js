async function login() {
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    try {
        const result = await API.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        // Store role for permission handling
        localStorage.setItem('role', result.role);
        window.location.href = "dashboard.html";
    } catch (err) {
        alert("Login Failed: " + err.message + "\nTry admin/admin or user/user");
    }
}