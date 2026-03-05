/**
 * Funciones compartidas para renderizar Tarjetas de Links, 
 * Gráficos y controles transversales en el Dashboard y Lista Completa.
 */

// Genera el HTML de una tarjeta de Link
function generateLinkCardHTML(short, urlActual) {
    const createdDate = new Date(short.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isActiveColor = short.is_active === 0 ? 'var(--danger-color) !important; text-decoration: line-through' : 'var(--accent-color)';
    return `
        <div class="link-card">
            <div class="card-left">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="min-width: 40px; height: 40px; background: rgba(6,182,212,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-color);">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <a href="${urlActual}${short.short_url}" target="_blank" class="short-url" style="color: ${isActiveColor};">
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
                    <span class="stat-value">${createdDate}</span>
                </div>
            </div>
            
            <div class="card-actions">
            <button onclick="location.href='/link/${short.id}'" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;" title="Analíticas">
                     <i class="fa-solid fa-chart-line"></i>
                </button>
                <button onclick="showQRModal('${urlActual}${short.short_url}')" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;" title="Código QR">
                     <i class="fa-solid fa-qrcode"></i>
                </button>
                <button onclick="window.sharedDeleteLink('${short.id}')" class="icon-btn" style="width: 32px; height: 32px; border: none; background: transparent;" title="Eliminar">
                     <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    </div>
    `;
}

// Genera los botones de Paginación
function generatePaginationHTML(meta, onClickFunctionName) {
    if (!meta || meta.totalPages <= 1) return "";
    return `
    <div class="pagination-container" style="display: flex; justify-content: center; gap: 10px; margin-top: 20px; align-items: center;">
        <button class="btn-action secondary" onclick="${onClickFunctionName}(${meta.page - 1})" ${meta.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Anterior</button>
        <span style="color: var(--text-secondary); font-size: 0.9rem;">Página ${meta.page} de ${meta.totalPages}</span>
        <button class="btn-action secondary" onclick="${onClickFunctionName}(${meta.page + 1})" ${meta.page === meta.totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Siguiente</button>
    </div>
    `;
}

// HTML vacío por defecto
function generateEmptyLinkHTML() {
    return `
    <div style='display: flex; align-items: center; justify-content: center; height: 70svh; flex-direction: column; gap: 12px;'>
        <i class="fa-solid fa-link" style="font-size: 2rem; color: var(--text-muted);"></i>
        <p>No hay enlaces creados</p>
    </div>`;
}

// Lógica Compartida de Portapapeles (removida de los archivos individuales)
window.copyToClipboard = function (text) {
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
};

window.fallbackCopyTextToClipboard = function (text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
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
};

// Renderizado de Gráficos (Para Links)
window.renderChartShared = async function (id) {
    try {
        const response = await axios.get(`/api/link/stats/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const stats = response.data.data;
        const labels = [];
        const dataPoints = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

            const dayStat = stats.find(s => s.day === dateStr);
            dataPoints.push(dayStat ? dayStat.clicks : 0);
        }

        const ctx = document.getElementById(`chart-${id}`);
        if (!ctx) return;

        // Verify if a chart instance already exists on this canvas and destroy it
        let existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

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
};

window.generateLinkCardHTML = generateLinkCardHTML;
window.generatePaginationHTML = generatePaginationHTML;
window.generateEmptyLinkHTML = generateEmptyLinkHTML;
