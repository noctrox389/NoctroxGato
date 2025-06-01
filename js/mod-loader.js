document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');

    // Validar que mods sea un array
    if (!Array.isArray(mods)) throw new Error('Formato de mods.json inválido');

    mods.forEach(mod => {
      // Aplicar colores con valores por defecto
      const nameColor = mod.nameColor || '#0ff0fc';
      const cardColor = mod.cardColor || '#1a1a2e';
      const borderColor = nameColor;

      const modCard = document.createElement('article');
      modCard.className = 'mod-card neon-card';
      
      // Aplicar estilos personalizados
      modCard.style.backgroundColor = cardColor;
      modCard.style.borderColor = borderColor;
      modCard.style.boxShadow = `0 0 15px ${nameColor}80`;
      
      // Escapar comillas simples en los créditos
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
          <h2 class="mod-name neon-flicker" style="
            color: ${nameColor};
            --neon-color: ${nameColor};
          ">
            ${mod.name}
          </h2>
          <div class="mod-meta">
            ${(mod.tags || []).map(tag => `<span class="neon-tag">${tag}</span>`).join('')}
          </div>
          <p class="mod-desc">${mod.description || 'Descripción no disponible'}</p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" 
               class="neon-download" 
               target="_blank" 
               rel="noopener noreferrer">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button class="neon-credits" data-credits="${safeCredits}">
              <i class="fas fa-users"></i> Créditos
            </button>
          </div>
        </div>
      `;
      
      container.appendChild(modCard);
    });

    // Manejar clics en botones de créditos
    document.querySelectorAll('.neon-credits').forEach(button => {
      button.addEventListener('click', () => {
        alert(button.dataset.credits);
      });
    });

  } catch (error) {
    console.error('Error cargando mods:', error);
    const errorContainer = document.getElementById('modsContainer') || document.body;
    errorContainer.innerHTML = `
      <div class="error neon-text">
        Error cargando los mods: ${error.message}
      </div>
    `;
  }
});


actualiza 
