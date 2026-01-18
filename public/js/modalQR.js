async function showQRModal(linkUrl) {
    
    // Create modal structure
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Initial Loading Content
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">Generating QR...</h3>
            <div class="modal-body">
                <i class="fa-solid fa-spinner fa-spin modal-loading"></i>
            </div>
            <div class="modal-actions">
                 <button id="close-qr-modal" class="btn-secondary">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Trigger Fade In
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300); // Wait for transition
    };

    const closeBtn = document.getElementById('close-qr-modal');
    if(closeBtn) closeBtn.onclick = closeModal;
    
    modal.onclick = (e) => { 
        if (e.target === modal) closeModal(); 
    };

    try {
        const response = await axios.post('/api/qrcode/generate', { text: linkUrl });
        const qrDataUrl = response.data.data.qr;

        // Update modal content with QR code
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <h3 class="modal-title">Your QR Code</h3>
            <div class="modal-body">
                <img src="${qrDataUrl}" alt="QR Code" class="qr-image">
            </div>
            <div class="modal-actions">
                <button id="close-qr-modal-btn" class="btn btn-secondary">Close</button>
                <a href="${qrDataUrl}" download="LINKCUT-qr-code.png" style="flex: 1; text-decoration: none;">
                    <button class="btn btn-download">Download</button>
                </a>
            </div>
        `;
        
        // Re-attach close handler
        const newCloseBtn = document.getElementById('close-qr-modal-btn');
        if(newCloseBtn) newCloseBtn.onclick = closeModal;

    } catch (error) {
         const modalContent = modal.querySelector('.modal-content');
         modalContent.innerHTML = `
            <h3 class="modal-title" style="color: var(--danger-color);">Error</h3>
            <div class="modal-body">
                <p style="color: var(--text-secondary);">Could not generate QR code.</p>
            </div>
            <div class="modal-actions">
                <button id="close-qr-modal-error" class="btn-secondary">Close</button>
            </div>
         `;
         const errorCloseBtn = document.getElementById('close-qr-modal-error');
         if(errorCloseBtn) errorCloseBtn.onclick = closeModal;
    }
}
