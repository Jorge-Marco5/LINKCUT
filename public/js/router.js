document.addEventListener('DOMContentLoaded', () => {
    const views = {
        '/': document.getElementById('view-dashboard'),
        '/qrcode': document.getElementById('view-qrcode'),
        '/analytics': document.getElementById('view-analytics'),
        '/link': document.getElementById('view-links'),
        '/link/detail': document.getElementById('view-url-details'), // Identificador unico lógico para el DOM
        '/link/protect': document.getElementById('view-protect'),
    };

    const navLinks = document.querySelectorAll('.nav-link');

    // Function to get base path for dynamic URLs
    const getBasePath = (path) => {
        if (path === '/link' || path === '/link/') return '/link';
        if (path.startsWith('/link/')) return '/link/detail';
        return path;
    };

    // Handle initial load
    const path = window.location.pathname;
    const resolvedPath = getBasePath(path);
    if (views[resolvedPath]) {
        showView(resolvedPath);
    } else {
        // Default to dashboard
        showView('/');
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPath = link.getAttribute('href');

            if (views[getBasePath(targetPath)]) {
                history.pushState(null, '', targetPath);
                showView(getBasePath(targetPath));
            }
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        if (views[getBasePath(path)]) {
            showView(getBasePath(path));
        }
    });

    function showView(path) {
        // Hide all views
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });

        // Show target view
        if (views[path]) {
            views[path].style.display = 'block';
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }
});
