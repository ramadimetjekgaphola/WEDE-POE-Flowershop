document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));
    }

    const greetEl = document.getElementById('greeting');
    if (greetEl) {
        const hour = new Date().getHours();
        let txt = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
        greetEl.textContent = `${txt}! Welcome to Garden Bloom 🌹`;
        greetEl.style.background = "white";
        greetEl.style.padding = "12px";
        greetEl.style.borderRadius = "8px";
        greetEl.style.color = "#a92e8c";
        greetEl.style.fontWeight = "bold";
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(btn.dataset.tab);
            if (pane) pane.classList.add('active');
        });
    });

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    const modal = document.getElementById('teamModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModal');
    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.add('show'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', (e) => { if (e.target == modal) modal.classList.remove('show'); });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    document.querySelectorAll('.lightbox-img').forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightboxImg.src = img.src.replace('w=200', 'w=800');
                lightbox.classList.add('show');
            }
        });
    });
    const lbClose = document.querySelector('.lightbox-close');
    if (lbClose && lightbox) lbClose.addEventListener('click', () => lightbox.classList.remove('show'));
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) lightbox.classList.remove('show'); });

    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        setTimeout(() => {
            try {
                if (typeof L !== 'undefined') {
                    const map = L.map('map').setView([-29.0852, 26.1596], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap'
                    }).addTo(map);
                    L.marker([-29.0852, 26.1596]).addTo(map).bindPopup("<b>Garden Bloom Flowers</b><br>Bloemfontein").openPopup();
                    setTimeout(() => map.invalidateSize(), 500);
                } else {
                    mapDiv.innerHTML = '<div style="padding:30px; text-align:center;"><p style="color:#a92e8c; font-weight:bold;">Garden Bloom - Bloemfontein</p><p>-29.0852, 26.1596</p><a href="https://www.google.com/maps/search/?api=1&query=-29.0852,26.1596" target="_blank" style="display:inline-block; margin-top:10px; background:#a92e8c; color:white; padding:8px 15px; border-radius:8px; text-decoration:none;">Open in Google Maps</a><p style="font-size:12px; margin-top:10px;">Connect to internet to see interactive map</p></div>';
                }
            } catch (err) {
                console.log(err);
                mapDiv.innerHTML = '<p style="padding:20px;">Map loading... please refresh with internet.</p>';
            }
        }, 600);
    }
});