function go(page) {
    window.location.href = page;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function checkPermissions() {
    const role = localStorage.getItem('role');
    if (role === 'user') {
        // Hide Admin Actions
        document.querySelectorAll('.btn-add, .danger, .admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Sidebar "Active" Highlighting
function highlightNav() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) document.getElementById('nav-dash').classList.add('active');
    if (path.includes('players')) document.getElementById('nav-players').classList.add('active');
    if (path.includes('clubs')) document.getElementById('nav-clubs').classList.add('active');
    if (path.includes('contracts')) document.getElementById('nav-contracts').classList.add('active');
    if (path.includes('matches')) document.getElementById('nav-matches').classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    highlightNav();
    checkPermissions();
});

// Modal Helpers
function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }