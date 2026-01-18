const listQr = document.getElementById("list-qr");

async function listQrcodes() {
    try {
        const { data } = await axios.get("/api/qrcode", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        listQr.innerHTML = data.data.map(qrcode => `
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
    } catch (error) {
        console.error(error);
    }
}

listQrcodes();

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
        listQrcodes();
        showQRModal(text);
    } catch (error) {
        console.error(error);
        alert("Error al crear el codigo QR: " + error.response.data.message);
    }
});

function deleteQrcode(id) {
    try {
        const result = confirm("¿Estas seguro de eliminar este codigo QR?");
        if (result) {
            const { data } = axios.delete(`/api/qrcode/${id}`);
            listQrcodes();
        }
    } catch (error) {
        console.error(error);
        alert("Error al eliminar el codigo QR: " + error.response.data.message);
    }
}
    