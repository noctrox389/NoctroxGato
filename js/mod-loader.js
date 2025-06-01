document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('Error al cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');
    if (!container) throw new Error('No se encontró el contenedor de mods');

    mods.forEach(mod => {
      // 1. Configuración de colores (¡conservando todo!)
      const nameColor = mod.nameColor || '#0ff0fc';
      const cardColor = mod.cardColor || '#1a1a2e';
      const borderColor = mod.borderColor || nameColor;

      // 2. Crear tarjeta con todos los efectos
      const modCard = document.createElement('article');
      modCard.className = 'mod-card neon-card';
      modCard.style.cssText = `
        background: ${cardColor};
        border: 2px solid ${borderColor};
        box-shadow: 0 0 20px ${borderColor}80;
      `;

      // 3. HTML con todos los estilos
      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" 
                  frameborder="0" 
                  allowfullscreen></iframe>
        </div>
        <div class="mod-info">
          <h2 style="
            color: ${nameColor};
            text-shadow: 0 0 10px ${nameColor};
          ">
            ${mod.name}
          </h2>
          <div class="mod-meta">
            ${(mod.tags || []).map(tag => `
              <span style="
                background: ${borderColor}20;
                border: 1px solid ${borderColor};
                color: ${nameColor};
              ">
                ${tag}
              </span>
            `).join('')}
          </div>
          <p>${mod.description || 'Sin descripción'}</p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" target="_blank" style="color: ${nameColor}">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button onclick="alert('${(mod.credits || 'Sin créditos').replace(/'/g, "\\'")}')"
                    style="color: ${nameColor}">
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
    errorMsg.innerHTML = `
      <p style="
        color: #ff0000;
        background: #1a1a2e;
        padding: 1rem;
        border: 1px solid #ff0000;
      ">
        ⚠️ Error: ${error.message}
      </p>
    `;
    document.body.prepend(errorMsg);
  }
});
