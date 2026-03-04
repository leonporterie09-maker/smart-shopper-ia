async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    // --- CONFIGURACIÓN DE TU LLAVE ---
    const p1 = 'AIzaSy';
    const p2 = 'CyKY108i4PiNBVPbTUjBYIGUXreg2Pwd0'; // <--- PEGA AQUÍ EL RESTO DE TU LLAVE (SIN EL AIZASY)
    const key = p1 + p2;
    // ---------------------------------

    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    // 1. Mostrar estado de carga
    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('hidden'); 

    try {
        // Esta es la URL que Google recomienda para el modelo Flash 1.5
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Analiza el producto "${query}". Dame el precio promedio en dólares, su calidad del 1 al 10 y un nivel de confianza (Baja, Media o Alta). Responde estrictamente en este formato, separado por barras: Precio | Calidad | Confianza` }]
                }]
            })
        });

        const data = await response.json();

        // Si Google devuelve un error específico
        if (data.error) {
            console.error("Error de la API:", data.error);
            alert("Google dice: " + data.error.message);
            return;
        }

        // Extraer el texto de la respuesta
        const textoIA = data.candidates[0].content.parts[0].text;
        const partes = textoIA.split('|');

        // 2. Insertar los datos en los cuadritos de colores
        document.getElementById('res-price').innerText = partes[0] ? partes[0].trim() : "No disponible";
        document.getElementById('res-quality').innerText = partes[1] ? partes[1].trim() : "N/A";
        document.getElementById('res-trust').innerText = partes[2] ? partes[2].trim() : "Media";
        
        // 3. Mostrar el resultado final
        loading.classList.add('hidden');
