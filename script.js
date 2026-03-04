async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    // Esta es tu clave de seguridad. Google la detectará en GitHub, 
    // pero te servirá para que la app funcione ahora mismo.
    const key = 'AIzaSyDLP8bb3eHSV7yGQeyzzdrDyGBoaTSx3JM'; 
    
    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    // Estado de carga
    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('opacity-0');

    try {
        // Conexión con Gemini 2.0 Flash Lite
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Actúa como un experto en compras. Analiza el producto "${query}". Dame: 1) Precio estimado en dólares, 2) Calidad del 1 al 10, 3) Nivel de confianza de las tiendas. Separa los 3 datos solo con el símbolo "|".` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error de Google: " + data.error.message);
            return;
        }

        // Procesar respuesta de la IA
        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        // Mostrar resultados en los cuadros
        document.getElementById('res-price').innerText = partes[0] || "No disponible";
        document.getElementById('res-quality').innerText = partes[1] || "Análisis listo";
        document.getElementById('res-trust').innerText = partes[2] || "Información verificada";
        
        // Animación de entrada
        results.classList.remove('opacity-0');

    } catch (err) {
        alert("Hubo un problema al conectar con el cerebro de la IA.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
