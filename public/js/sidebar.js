document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    if (!hamburgerBtn || !navLinks || !closeBtn) return;

    function openSidebar() {
        navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeSidebar() {
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    hamburgerBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    if (navOverlay) {
        navOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });
});
