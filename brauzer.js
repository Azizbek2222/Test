const API_KEY = "AIzaSyDbWSvtOGrdO9RsWjMmpbgY1Ttht-O7O8c";
const CX_ID = "9514406a63f704399";

async function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let loader = document.getElementById('loader');
    let welcome = document.getElementById('welcome-msg');

    if (url === "") return;

    // Vizual effektlar
    loader.style.width = "30%";
    
    // Agar kiritilgan matn URL emas, qidiruv so'zi bo'lsa
    if (!url.includes('.') && !url.startsWith('http')) {
        welcome.style.opacity = "0";
        setTimeout(() => welcome.style.display = "none", 500);
        executeFlashSearch(url);
        return;
    }

    // URL formatini tekshirish
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    welcome.style.opacity = "0";
    setTimeout(() => {
        welcome.style.display = "none";
        viewport.src = url;
        loader.style.width = "100%";
        setTimeout(() => loader.style.width = "0%", 500);
        urlInput.blur();
    }, 500);
}

async function executeFlashSearch(query) {
    const viewport = document.getElementById('browser-viewport');
    const loader = document.getElementById('loader');
    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}`;

    loader.style.width = "60%";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.items) {
            let resultsHtml = data.items.map(item => `
                <div style="margin-bottom: 30px; animation: fadeIn 0.5s ease forwards;">
                    <a href="${item.link}" target="_parent" style="color: #00d2ff; text-decoration: none; font-size: 20px; font-weight: bold; font-family: sans-serif;">${item.title}</a>
                    <div style="color: #28c840; font-size: 13px; margin: 4px 0;">${item.displayLink}</div>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0; line-height: 1.5; font-family: sans-serif;">${item.snippet}</p>
                </div>
            `).join('');

            const pageDesign = `
                <style>
                    body { background: #0f0f1a; color: white; padding: 40px; font-family: 'Segoe UI', sans-serif; }
                    h2 { color: white; border-bottom: 2px solid #00d2ff; padding-bottom: 15px; margin-bottom: 30px; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                </style>
                <body>
                    <h2><i class="fas fa-search"></i> FlashNet Natijalari: "${query}"</h2>
                    ${resultsHtml}
                </body>
            `;
            viewport.srcdoc = pageDesign;
        } else {
            viewport.srcdoc = "<body style='background:#0f0f1a;color:white;text-align:center;padding-top:100px;'><h1>Hech narsa topilmadi 😕</h1></body>";
        }
    } catch (error) {
        viewport.srcdoc = "<body style='background:#0f0f1a;color:red;text-align:center;padding-top:100px;'><h1>Xatolik yuz berdi. API limitini tekshiring.</h1></body>";
    }

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
});
