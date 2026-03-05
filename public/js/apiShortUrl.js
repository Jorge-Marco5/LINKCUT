const listShorts = document.getElementById("list-shorts");

async function listLinks() {
    try {
        const { data } = await axios.get("/api/link", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        //url actual
        const urlActual = window.location.href;
        if (data.data.length > 0) {
            listShorts.innerHTML = data.data.map(short => `
                <div class="link-card">
                    <div class="card-left">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="min-width: 40px; height: 40px; background: rgba(6,182,212,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-color);">
                                <i class="fa-solid fa-link"></i>
                            </div>
                            <a href="${urlActual}${short.short_url}" target="_blank" class="short-url" style="color: ${short.is_active === 0 ? 'var(--danger-color) !important; text-decoration: line-through' : 'var(--accent-color)'};">
                                ${urlActual}${short.short_url} 
                            </a>
                            <i class="fa-regular fa-copy copy-icon" onclick="copyToClipboard('${urlActual}${short.short_url}')"></i>
                        </div>
                    <div class="original-url" title="${short.url}">
                        ${short.url}
                    </div>
                </div>
                <div class="card-right" style="display: flex; align-items: center; gap: 32px;">
                <div style="width: 120px; height: 60px;">
                   <canvas id="chart-${short.id}"></canvas>
                </div>
                <div class="card-stats">
                        <div class="stat-item">
                            <span class="stat-label">CLICKS</span>
                            <span class="stat-value">${short.clicks}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">CREADO</span>
                            <span class="stat-value">${new Date(short.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                    <button onclick="location.href='/link/${short.id}'" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;">
                             <i class="fa-solid fa-chart-line"></i>
                        </button>
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

            // Render charts for each link
            data.data.forEach(short => {
                renderChart(short.id);
            });

        } else {
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

function copyToClipboard(text) {
    // Verificar si el navegador soporta el API de Portapapeles Seguro (necesita HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => alert("Copiado al portapapeles: " + text))
            .catch(err => {
                console.error("Error al copiar usando Clipboard API:", err);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Respaldo para navegadores viejos o HTTP puro sin contexto seguro
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Evita el scroll hacia el fondo
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            alert("Copiado al portapapeles: " + text);
        } else {
            alert("Error al copiar el enlace. Házlo manualmente.");
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert("Error al copiar el enlace.");
    }
    document.body.removeChild(textArea);
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

async function renderChart(id) {
    try {
        const response = await axios.get(`/api/link/stats/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const stats = response.data.data; // Array of { day: 'YYYY-MM-DD', clicks: number }

        // Generate labels and data for the last 7 days (including today)
        const labels = [];
        const dataPoints = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' })); // e.g., Mon, Tue

            // Find stats for this day
            const dayStat = stats.find(s => s.day === dateStr);
            dataPoints.push(dayStat ? dayStat.clicks : 0);
        }

        const ctx = document.getElementById(`chart-${id}`);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: dataPoints,
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        intersect: false,
                        mode: 'index',
                    }
                },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0 }
                },
                layout: {
                    padding: 0
                }
            }
        });

    } catch (error) {
        console.error("Error rendering chart for link " + id, error);
    }
}
