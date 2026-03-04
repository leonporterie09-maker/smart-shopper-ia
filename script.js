async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    const p1 = 'AIzaSy';
    const p2 = 'CyKY108i4PiNBVPbTUjBYIGUXreg2Pwd0';
    const key = p1 + p2;

    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('hidden'); 

    try {
        // USAMOS V1BETA Y GEMINI-1.5-FLASH (La combinación más compatible)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Producto: "${query}". Dame: Precio USD | Calidad 1-10 | Confianza` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error de Google: " + data.error.message);
            return;
        }

        if (!data.candidates || !data.candidates[0]) {
            alert("La IA no devolvió datos. Intenta con otro producto.");
            return;
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        document.getElementById('res-price').innerText = partes[0] ? partes[0].trim() : "N/A";
        document.getElementById('res-quality').innerText = partes[1] ? partes[1].trim() : "N/A";
        document.getElementById('res-trust').innerText = partes[2] ? partes[2].trim() : "Alta";
        
        loading.classList.add('hidden');
        results.classList.remove('hidden');

    } catch (err) {
        alert("Error de conexión. Revisa tu internet.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
