document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');

    if (!Array.isArray(mods)) throw new Error('Formato de mods.json inválido');

    mods.forEach(mod => {
      const nameColor = mod.nameColor || '#0ff0fc';
      const cardColor = mod.cardColor || '#1a1a2e';
      const borderColor = nameColor;

      const modCard = document.createElement('article');
      modCard.className = 'mod-card neon-card';
      
      modCard.style.cssText = `
        background: ${cardColor};
        border: 2px solid ${borderColor};
        box-shadow: 0 0 15px ${nameColor}80;
      `;
      
      const safeCredits = (mod.credits || 'Créditos no disponibles')
                         .replace(/'/g, "\\'")
                         .replace(/"/g, '&quot;');

      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" 
                  frameborder="0" 
                  allowfullscreen></iframe>
        </div>
        <div class="mod-info">
          <h2 class="neon-flicker" style="
            color: ${nameColor};
            --neon-color: ${nameColor};
            --neon-pink: #ff00ff;
          ">
            ${mod.name}
          </h2>
          <div class="mod-meta">
            ${(mod.tags || []).map(tag => `
              <span class="neon-tag" style="
                background: ${nameColor}20;
                border: 1px solid ${nameColor};
                color: ${nameColor};
              ">
                ${tag}
              </span>
            `).join('')}
          </div>
          <p class="mod-desc">${mod.description || 'Descripción no disponible'}</p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" 
               class="neon-download" 
               target="_blank" 
               rel="noopener noreferrer"
               style="color: ${nameColor}">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button class="neon-credits" data-credits="${safeCredits}"
                    style="color: ${nameColor}">
              <i class="fas fa-users"></i> Créditos
            </button>
          </div>
        </div>
      `;
      
      container.appendChild(modCard);
    });

    document.querySelectorAll('.neon-credits').forEach(button => {
      button.addEventListener('click', () => {
        alert(button.dataset.credits);
      });
    });

  } catch (error) {
    console.error('Error cargando mods:', error);
    const errorContainer = document.getElementById('modscontainer') || document.body;
    errorContainer.innerHTML = `
      <div style="
        color: #ff0000;
        background: #1a1a2e;
        padding: 1rem;
        border: 1px solid #ff0000;
        text-align: center;
      ">
        ⚠️ Error cargando los mods: ${error.message}
      </div>
      ${errorContainer.innerHTML}
    `;
  }
});
