async function handleSearch() {
    const query = document.getElementById('productInput').value;
    const key = 'AIzaSyAYqCxsfcf894zRIhQkYmyAYLvADAeHlD4'; 
    
    if (!query) return;
