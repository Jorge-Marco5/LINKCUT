const listQr = document.getElementById("list-qr");
let qrCurrentPage = 1;

async function listQrcodes(page = 1) {
    try {
        const { data } = await axios.get(`/api/qrcode?page=${page}&limit=5`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const qrArray = Array.isArray(data.data) ? data.data : data.data.qrCodes;
        const meta = data.data.meta;

        if (!qrArray || qrArray.length === 0) {
            listQr.innerHTML = `
            <div style='display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; gap: 12px;'>
                <i class="fa-solid fa-qrcode" style="font-size: 2rem; color: var(--text-muted);"></i>
                <p>No hay codigos QR creados</p>
            </div>`;
            return;
        }

        let htmlList = qrArray.map(qrcode => `
            <div class="qrcode-card">
                <div class="card-left">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div style="min-width: 40px; height: 40px; background: rgba(6,182,212,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-color);">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                             <p class="qrcode-text" title="${qrcode.text}">
                                ${qrcode.text}
                            </p>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(qrcode.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button onclick="copyToClipboard('${qrcode.text}')" class="icon-btn" title="Copiar Texto">
                            <i class="fa-regular fa-copy"></i>
                    </button>
                    <button onclick="showQRModal('${qrcode.text}')" class="icon-btn" title="Ver QR">
                            <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="deleteQrcode('${qrcode.id}')" class="icon-btn" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join("");

        if (meta && meta.totalPages > 1) {
            htmlList += `
            <div class="pagination-container" style="display: flex; justify-content: center; gap: 10px; margin-top: 20px; align-items: center;">
                <button class="btn-action secondary" onclick="changeQrPage(${meta.page - 1})" ${meta.page === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Anterior</button>
                <span style="color: var(--text-secondary); font-size: 0.9rem;">Página ${meta.page} de ${meta.totalPages}</span>
                <button class="btn-action secondary" onclick="changeQrPage(${meta.page + 1})" ${meta.page === meta.totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Siguiente</button>
            </div>
            `;
        }

        listQr.innerHTML = htmlList;
    } catch (error) {
        console.error(error);
    }
}

function changeQrPage(newPage) {
    qrCurrentPage = newPage;
    listQrcodes(qrCurrentPage);
}

listQrcodes(qrCurrentPage);

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles: " + text);
}

const qrForm = document.getElementById("qr-form");

qrForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = qrForm.querySelector("input").value;
    try {
        const { data } = await axios.post("/api/qrcode", { text }, {
        });
        qrForm.querySelector("input").value = "";
        listQrcodes(1); // Volver a pagina 1 despues de crear
        showQRModal(text);
    } catch (error) {
        console.error(error);
        alert("Error al crear el codigo QR: " + error.response.data.message);
    }
});

async function deleteQrcode(id) {
    try {
        const result = confirm("¿Estas seguro de eliminar este codigo QR?");
        if (result) {
            const { data } = await axios.delete(`/api/qrcode/${id}`);
            listQrcodes(qrCurrentPage);
        }
    } catch (error) {
        console.error(error);
        alert("Error al eliminar el codigo QR: " + error.response.data.message);
    }
}