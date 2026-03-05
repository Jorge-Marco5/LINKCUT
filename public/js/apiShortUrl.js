const listRecentShorts = document.getElementById("list-recent-shorts");
let urlCurrentPage = 1;

async function listLinks(page = 1) {
    try {
        const { data } = await axios.get(`/api/link?page=${page}&limit=5`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // La nueva estructura devuelve { links: [], meta: {total, page, limit, totalPages} }
        const linksArray = Array.isArray(data.data) ? data.data : data.data.links;
        const meta = data.data.meta;

        if (!linksArray || linksArray.length === 0) {
            listRecentShorts.innerHTML = window.generateEmptyLinkHTML();
            return;
        }

        // Obtenemos solo la URL base (ej. http://localhost:3000 o https://midominio.com)
        const baseUrl = window.location.origin + "/";
        if (linksArray.length > 0) {
            let htmlList = linksArray.map(short => window.generateLinkCardHTML(short, baseUrl)).join("");

            // Controles de Paginación UI
            htmlList += window.generatePaginationHTML(meta, 'changeUrlPage');

            listRecentShorts.innerHTML = htmlList;

            // Render charts for each link
            linksArray.forEach(short => {
                window.renderChartShared(short.id);
            });

        } else {
            listRecentShorts.innerHTML = window.generateEmptyLinkHTML();
        }
    } catch (error) {
        console.error(error);
        listRecentShorts.innerHTML = window.generateEmptyLinkHTML();
    }
}

function changeUrlPage(newPage) {
    urlCurrentPage = newPage;
    listLinks(urlCurrentPage);
}

listLinks(urlCurrentPage);

const shortenForm = document.getElementById("shorten-form");

shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = shortenForm.querySelector("input").value;
    try {
        const { data } = await axios.post("/api/link", { url });
        shortenForm.querySelector("input").value = "";
        listLinks();
    } catch (error) {
        console.error(error);
        alert("Error al crear el enlace: " + error.response.data.message);
    }
});



window.sharedDeleteLink = async function (id) {
    try {
        const result = confirm("¿Estas seguro de eliminar este enlace?");
        if (result) {
            await axios.delete(`/api/link/${id}`);
            // Recarga las listas conectadas globalmente
            if (window.listLinks) window.listLinks(urlCurrentPage);
            if (window.listBigLinks) window.listBigLinks();
        }
    } catch (error) {
        console.error(error);
    }
}

// User Dropdown Logic
const userMenuBtn = document.getElementById('user-menu-btn');
const userDropdown = document.getElementById('user-dropdown');
const logoutBtn = document.getElementById('logout-btn');

if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await axios.get('/api/auth/logout');
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Falló el cierre de sesión');
        }
    });
}


/**
 * Notification Dropdown Logic
 */
const notificationBtn = document.getElementById('notification-btn');
const notificationDropdown = document.getElementById('notification-dropdown');

if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
}

