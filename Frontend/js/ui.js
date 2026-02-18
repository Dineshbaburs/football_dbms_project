/**
 * Hides administrative actions if the user is not an 'admin'
 */
function checkPermissions() {
    const role = localStorage.getItem('role');
    if (role === 'user') {
        // Select and hide all administrative buttons/sections
        const adminElements = document.querySelectorAll('.btn-add, .danger, .admin-only, button:contains("Delete")');
        adminElements.forEach(el => el.style.display = 'none');

        // Disable editing inputs for users
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(i => i.disabled = true);
    }
}

/**
 * Global authentication check - Redirects to login if session is missing
 */
document.addEventListener("DOMContentLoaded", () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage && !localStorage.getItem('role')) {
        window.location.href = "login.html";
    }
    checkPermissions();
});

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function go(page) {
    window.location.href = page;
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// Close modals when clicking outside the content box
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}