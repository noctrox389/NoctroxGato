// Vista previa de YouTube
document.getElementById('youtubeUrl')?.addEventListener('input', function(e) {
  const url = e.target.value;
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
  
  if (videoId) {
    document.getElementById('videoPreview').innerHTML = `
      <iframe 
        width="100%" 
        height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>`;
  }
});

// Manejar formulario
document.getElementById('modForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Mod añadido (simulación)');
  window.location.href = 'index.html';
});