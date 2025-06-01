document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');
    if (!container) throw new Error('No se encontró el contenedor de mods');

    mods.forEach(mod => {
      // Solo usamos nameColor (con valor por defecto)
      const nameColor = mod.nameColor || '#0ff0fc';

      const modCard = document.createElement('article');
      modCard.className = 'mod-card';
      
      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" 
                  frameborder="0" 
                  allowfullscreen></iframe>
        </div>
        <div class="mod-info">
          <h2 style="color: ${nameColor}">
            ${mod.name}
          </h2>
          <div class="mod-meta">
            ${(mod.tags || []).map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <p>${mod.description || 'Sin descripción'}</p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" target="_blank">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button onclick="alert('${(mod.credits || 'Sin créditos').replace(/'/g, "\\'")}')">
              <i class="fas fa-users"></i> Créditos
            </button>
          </div>
        </div>
      `;
      
      container.appendChild(modCard);
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMsg = document.createElement('div');
    errorMsg.textContent = `Error: ${error.message}`;
    errorMsg.style.color = 'red';
    errorMsg.style.padding = '1rem';
    document.body.prepend(errorMsg);
  }
});
