const listShorts = document.getElementById("list-shorts");
const listQr = document.getElementById("list-qr");

async function listLinks() {
    try {
        const { data } = await axios.get("/api/link");
        //url actual
        const urlActual = window.location.href;
        if(data.data.length > 0){
            listShorts.innerHTML = data.data.map(short => `
            <div class="link-card">
                <div class="card-left">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <a href="${urlActual}${short.short_url}" target="_blank" class="short-url">
                            ${urlActual}${short.short_url} 
                        </a>
                        <i class="fa-regular fa-copy copy-icon" onclick="copyToClipboard('${urlActual}${short.short_url}')"></i>
                    </div>
                    <div class="original-url" title="${short.url}">
                        ${short.url}
                    </div>
                </div>
                <div class="card-right" style="display: flex; align-items: center; gap: 32px;">
                    <!-- Simple Mock Chart using inline SVG or just visuals -->
                     <svg width="100" height="30" viewBox="0 0 100 30" fill="none" stroke="#06b6d4" stroke-width="2">
                        <path d="M0 25 Q 10 20, 20 22 T 40 15 T 60 20 T 80 10 T 100 5" />
                    </svg>

                    <div class="card-stats">
                        <div class="stat-item">
                            <span class="stat-label">CLICKS</span>
                            <span class="stat-value">${short.clicks}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">CREATED</span>
                            <span class="stat-value">${new Date(short.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                        <button onclick="showQRModal('${urlActual}${short.short_url}')" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;">
                             <i class="fa-solid fa-qrcode"></i>
                        </button>
                        <button onclick="deleteLink('${short.id}')" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;">
                             <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
        }else{
            listShorts.innerHTML = `
            <div class="link-card">
                <p>No hay enlaces</p>
            </div>
            `;
        }
    } catch (error) {
        console.error(error);
    }
}

listLinks();

const shortenForm = document.getElementById("shorten-form");
const qrForm = document.getElementById("qr-form");

shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = shortenForm.querySelector("input").value;
    try {
        const { data } = await axios.post("/api/link", { url });
        listLinks();
    } catch (error) {
        console.error(error);
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles: " + text);
}

function deleteLink(id) {
    try {
        //alert dialog
        const result = confirm("¿Estas seguro de eliminar este enlace?");
        if (result) {
            axios.delete(`/api/link/${id}`);
            listLinks();
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
