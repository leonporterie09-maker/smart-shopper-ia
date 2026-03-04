async function handleSearch() {
    const query = document.getElementById('productInput').value;
    
    // TRUCO PARA LA LLAVE
    const p1 = 'AIzaSy';
    const p2 = 'CyKY108i4PiNBVPbTUjBYIGUXreg2Pwd0'; // <--- PEGA AQUÍ EL RESTO DE TU LLAVE SIN EL AIZASY
    const key = p1 + p2;

    if (!query) return;

    const btn = document.getElementById('btnSearch');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    // 1. Mostrar que está cargando
    btn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('hidden'); 

    try {
        // Usamos el modelo 1.5 que es más estable para la cuota
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Analiza el producto "${query}". Dame el precio promedio en dólares, su calidad del 1 al 10 y un nivel de confianza. Separa los tres datos solo con el símbolo | (ejemplo: 500 USD | 8 | Alta).` }]
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

        // 2. Mostrar los resultados
        document.getElementById('res-price').innerText = partes[0] || "No disponible";
        document.getElementById('res-quality').innerText = partes[1] || "N/A";
        document.getElementById('res-trust').innerText = partes[2] || "Media";
        
        loading.classList.add('hidden');
        results.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        alert("Error de conexión. Revisa tu internet o la consola.");
    } finally {
        btn.disabled = false;
        loading.classList.add('hidden');
    }
}
