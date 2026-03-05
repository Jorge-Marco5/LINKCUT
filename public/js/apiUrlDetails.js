(function () {
    const pathParts = window.location.pathname.split('/');
    const linkId = pathParts[pathParts.length - 1];
    const currentHost = window.location.origin;

    async function loadLinkDetails() {
        try {
            const { data } = await axios.get(`/api/link/${linkId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const short = data.data;
            if (!short) {
                alert("Enlace no encontrado");
                window.location.href = '/';
                return;
            }

            const fullShortUrl = `${currentHost}${short.short_url}`;

            // Populate header
            document.getElementById('detail-short-url').innerHTML = `<i class="fa-solid fa-link"></i> ${currentHost}/${short.short_url} <span class="badge active" id="detail-status">Active</span>`;
            document.getElementById('detail-short-url').onclick = () => {
                window.location.href = `${currentHost}/${short.short_url}`;
            };
            // Toggle logic setup
            const statusBadge = document.getElementById('detail-status');
            const toggleBtn = document.getElementById('btn-toggle-status');
            let isActive = short.is_active;

            if (isActive) {
                statusBadge.style.display = 'inline-block';
                statusBadge.innerText = 'Active';
                statusBadge.className = 'badge active';
                toggleBtn.querySelector('span').innerText = "Desactivar";
            } else {
                statusBadge.style.display = 'inline-block';
                statusBadge.innerText = 'Inactive';
                statusBadge.className = 'badge inactive';
                toggleBtn.querySelector('span').innerText = "Activar";
                toggleBtn.style.color = "var(--danger-color)";
                toggleBtn.style.borderColor = "var(--danger-color)";
            }

            toggleBtn.onclick = async () => {
                try {
                    const newStatus = isActive ? 0 : 1;
                    await axios.patch(`/api/link/${linkId}/toggle`, { is_active: newStatus }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });

                    // Reload UI after toggle
                    loadLinkDetails();
                } catch (e) {
                    console.error("Error toggling status", e);
                    alert("No se pudo actualizar el estado");
                }
            }

            document.getElementById('detail-long-url').innerHTML = `<i class="fa-solid fa-link"></i> ${short.url}`;

            // Populate stats
            document.getElementById('detail-total-clicks').innerText = short.clicks || 0;
            document.getElementById('detail-created-date').innerText = new Date(short.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            // Generate QR Code inline
            try {
                document.getElementById('qr-loading').style.display = 'block';
                document.getElementById('detail-qr-img').style.display = 'none';

                const qrResponse = await axios.post('/api/qrcode/generate', { text: fullShortUrl }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const qrDataUrl = qrResponse.data.data.qr;

                document.getElementById('detail-qr-img').src = qrDataUrl;
                document.getElementById('detail-qr-img').style.display = 'block';
                document.getElementById('qr-loading').style.display = 'none';

                // Set up download button
                const btnDownload = document.getElementById('btn-download-qr');
                btnDownload.onclick = () => {
                    const a = document.createElement('a');
                    a.href = qrDataUrl;
                    a.download = `QR-${short.short_url.replace('/', '')}.png`;
                    a.click();
                };
            } catch (qrError) {
                console.error(qrError);
                document.getElementById('qr-loading').innerText = 'Error al cargar QR';
            }

            // Render Chart & Locations
            renderChart(linkId);
            renderLocations(linkId);

            document.getElementById('btn-copy-detail').onclick = () => {
                if (typeof copyToClipboard === 'function') {
                    copyToClipboard(`${currentHost}/${short.short_url}`);
                } else {
                    navigator.clipboard.writeText(`${currentHost}/${short.short_url}`)
                        .then(() => alert("Copiado al portapapeles: " + `${currentHost}/${short.short_url}`))
                        .catch(err => alert("Error al copiar"));
                }
            };

            document.getElementById('btn-delete-detail').onclick = async () => {
                if (confirm("¿Estás seguro de eliminar este enlace?")) {
                    try {
                        await axios.delete(`/api/link/${linkId}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        });
                        window.location.href = '/';
                    } catch (err) {
                        console.error(err);
                        alert("Error al eliminar");
                    }
                }
            };

        } catch (error) {
            console.error(error);
            alert("Error al cargar los detalles del enlace");
        }
    }

    async function renderChart(id) {
        try {
            const response = await axios.get(`/api/link/stats/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const stats = response.data.data;

            const labels = [];
            const dataPoints = [];
            let text_description = "";
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);

                // Extraer YYYY-MM-DD usando la zona horaria LOCAL del navegador
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                // format MM/DD para la grafica
                labels.push(`${date.getMonth() + 1}/${date.getDate()}`);

                const dayStat = stats.find(s => s.day === dateStr);
                dataPoints.push(dayStat ? dayStat.clicks : 0);
                text_description = dayStat ? dayStat.text_description : "";
            }
            document.getElementById('description-analitycs').innerHTML = `<p style="margin: 20px 10px; text-align: center;" >${text_description}</p>`;
            // calculate last 24 hours based on the last element
            const last24Clicks = dataPoints[dataPoints.length - 1] || 0;
            document.getElementById('detail-last-24').innerText = `+${last24Clicks}`;

            const ctx = document.getElementById(`detail-chart`);
            if (!ctx) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataPoints,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        fill: true,
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
                        x: {
                            display: true,
                            grid: { display: false, drawBorder: false },
                            ticks: {
                                color: '#a1a1aa',
                                font: { size: 10 },
                                maxTicksLimit: 7
                            }
                        },
                        y: {
                            display: false,
                            min: 0,
                        }
                    },
                    layout: { padding: 0 }
                }
            });

        } catch (error) {
            console.error("Error rendering chart for link " + id, error);
        }
    }

    async function renderLocations(id) {
        try {
            const response = await axios.get(`/api/link/stats/locations/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const locations = response.data.data;
            const listDiv = document.getElementById('detail-locations-list');

            if (!locations || locations.length === 0) {
                listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aún no hay clics para rastrear países.</p>';
                return;
            }

            const maxClicks = Math.max(...locations.map(l => l.clicks));

            listDiv.innerHTML = locations.map(loc => {
                const percentage = Math.round((loc.clicks / maxClicks) * 100);
                const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(loc.country) || loc.country;
                return `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 0.9rem; color: var(--text-primary); width: 100px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${loc.country === 'Unknown' ? 'Desconocido' : countryName} 
                    </span>
                    <div style="flex-grow: 1; margin: 0 15px; background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: #06b6d4; border-radius: 4px;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: var(--text-secondary); min-width: 30px; text-align: right;">${loc.clicks}</span>
                </div>
            `;
            }).join('');

        } catch (error) {
            console.error("Error fetching locations", error);
            document.getElementById('detail-locations-list').innerHTML = '<p style="text-align: center; color: var(--danger-color);">Error al cargar ubicaciones.</p>';
        }
    }
    // (La lógica del User Menu y Notifications se maneja globalmente en otro script, así evitamos redeclaraciones)

    if (window.location.pathname.startsWith('/link/')) {
        loadLinkDetails();
    }
})();
