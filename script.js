async function handleSearch() {
    const query = document.getElementById('productInput').value;
    const key = 'AIzaSyAYqCxsfcf894zRIhQkYmyAYLvADAeHlD4'; 
    
    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('opacity-0', 'translate-y-10');

    try {
        const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=' + key;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: 'Actúa como experto en compras. Analiza el producto "' + query + '". Dame una respuesta breve en español dividida en tres partes claras: 1) Precio y tienda, 2) Calidad, 3) Confianza. Separa cada sección con el símbolo "|".' 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Aviso de Google: " + data.error.message);
            return;
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        document.getElementById('res-price').innerText = partes[0] || textoIA;
        document.getElementById('res-quality').innerText = partes[1] || "Análisis completado.";
        document.getElementById('res-trust').innerText = partes[2] || "Tienda analizada.";
        
        results.classList.remove('opacity-0', 'translate-y-10');

    } catch (err) {
        alert("Error al conectar con la IA.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
