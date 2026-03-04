async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    // REEMPLAZA ESTO CON TU NUEVA LLAVE DE GOOGLE AI STUDIO
    const key = 'TU_NUEVA_LLAVE_AQUI'; 
    
    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('opacity-0');

    try {
        // Usamos Gemini 2.0 Flash Lite que es el modelo más eficiente para este tipo de apps
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Analiza el producto "${query}". Dame precio, calidad y confianza en español, separado por "|".` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error de Google: " + data.error.message); // Aquí verás si la cuota ya se reseteó
            return;
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        document.getElementById('res-price').innerText = partes[0] || "No disponible";
        document.getElementById('res-quality').innerText = partes[1] || "Análisis listo";
        document.getElementById('res-trust').innerText = partes[2] || "Información verificada";
        
        results.classList.remove('opacity-0');

    } catch (err) {
        alert("Hubo un problema al conectar.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
