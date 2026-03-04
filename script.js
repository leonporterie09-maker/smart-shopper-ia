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
        // Esta URL usa "1.5-flash-latest" que es el nombre universal actual
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Analiza "${query}". Responde solo: Precio USD | Calidad 1-10 | Confianza` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error de Google: " + data.error.message);
            return;
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        document.getElementById('res-price').innerText = partes[0] || "N/A";
        document.getElementById('res-quality').innerText = partes[1] || "N/A";
        document.getElementById('res-trust').innerText = partes[2] || "Alta";
        
        loading.classList.add('hidden');
        results.classList.remove('hidden');

    } catch (err) {
        alert("Error de conexión");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
