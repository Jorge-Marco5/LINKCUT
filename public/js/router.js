document.addEventListener('DOMContentLoaded', () => {
    const views = {
        '/': document.getElementById('view-dashboard'),
        '/qrcode': document.getElementById('view-qrcode'),
        '/analytics': document.getElementById('view-analytics')
    };

    const navLinks = document.querySelectorAll('.nav-link');

    // Handle initial load
    const path = window.location.pathname;
    if (views[path]) {
        showView(path);
    } else {
        // Default to dashboard
        showView('/'); 
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPath = link.getAttribute('href');
            
            if (views[targetPath]) {
                history.pushState(null, '', targetPath);
                showView(targetPath);
            }
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        if (views[path]) {
            showView(path);
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
