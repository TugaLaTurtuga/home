function adjustColorOpacity(hex, opacity) {
    const num = parseInt(hex.slice(1), 16);
    const R = (num >> 16) & 0xFF;
    const G = (num >> 8) & 0xFF;
    const B = num & 0xFF;

    return `rgba(${R}, ${G}, ${B}, ${opacity})`;
}


function showNotification(message, borderColor = '#2ecc71', duration = 3000, confirm = false) {
    return new Promise((resolve) => {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = 'notification fade-in';

        const color = adjustColorOpacity(borderColor, 0.8);
        console.log(color, borderColor);
        notification.style.backgroundColor = color;
        notification.style.borderColor = borderColor;

        const text = document.createElement('span');
        text.textContent = message;
        notification.appendChild(text);

        let timeoutId;
        let resolved = false;

        const cleanup = (result) => {
            if (resolved) return; // Prevent multiple resolutions
            resolved = true;
            clearTimeout(timeoutId);
            notification.classList.remove('fade-in');
            notification.classList.add('fade-out');
            notification.addEventListener('animationend', () => {
                notification.remove();
                resolve(result);
                container.focus();
            }, { once: true });
        };

        

        if (confirm) {
            notification.style.paddingBottom = '40px';
            const acceptBtn = document.createElement('button');
            acceptBtn.textContent = 'Accept';
            acceptBtn.style.marginLeft = '10px';
            acceptBtn.onclick = () => cleanup(true);

            const denyBtn = document.createElement('button');
            denyBtn.id = 'deny-btn';
            denyBtn.textContent = 'Deny';
            denyBtn.onclick = () => cleanup(false);

            notification.appendChild(acceptBtn);
            notification.appendChild(denyBtn);

            // Keyboard support
            const keyListener = (e) => {
                console.log(e.key);
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.removeEventListener('keydown', keyListener);
                    cleanup(true);
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    document.removeEventListener('keydown', keyListener);
                    cleanup(false);
                }
            };
            document.addEventListener('keydown', keyListener);
        } else {
            timeoutId = setTimeout(() => {
                cleanup(null);
            }, duration);
        }

        container.appendChild(notification);
    });
}