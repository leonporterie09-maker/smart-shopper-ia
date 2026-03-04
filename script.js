async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    // IMPORTANTE: Para probarlo localmente, pon tu llave nueva aquí.
    // Pero antes de subirlo a Vercel, te enseñaré a ocultarla.
    const key = 'TU_NUEVA_LLAVE_AQUI'; 
    
    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    btn.disabled = true;
    loading.classList.remove('hidden');

    try {
        // Usamos la versión estable v1 y el modelo Gemini 3 Flash
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Analiza el producto "${query}" brevemente. Dame precio, calidad y confianza en español, separado por "|".` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error: " + data.error.message);
            return;
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        document.getElementById('res-price').innerText = partes[0] || "No disponible";
        document.getElementById('res-quality').innerText = partes[1] || "No disponible";
        document.getElementById('res-trust').innerText = partes[2] || "No disponible";
        
        results.classList.remove('opacity-0');

    } catch (err) {
        alert("Error de conexión con la IA.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
