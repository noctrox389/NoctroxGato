import { renderCreditItem } from './iconsYT.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');
    if (!container) throw new Error('Contenedor de mods no encontrado');

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
      
      // Generar lista de créditos (usando la función importada)
      const creditsList = mod.credits?.map(credit => 
        renderCreditItem(credit, nameColor)
      ).join('') || 'Créditos no disponibles';

      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
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
            <button class="neon-credits" data-credits="${creditsList.replace(/"/g, '&quot;')}"
                    style="color: ${nameColor}">
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
        const popup = document.createElement('div');
        popup.className = 'credits-popup';
        popup.innerHTML = `
          <div class="credits-content" style="
            background: #1a1a2e;
            border: 2px solid ${button.style.color};
            padding: 1rem;
            max-width: 80vw;
          ">
            <h3 style="margin-top: 0; color: ${button.style.color}">
              <i class="fas fa-users"></i> Créditos
            </h3>
            <div>${button.dataset.credits}</div>
            <button class="close-btn" style="
              margin-top: 1rem;
              background: transparent;
              color: ${button.style.color};
              border: 1px solid ${button.style.color};
            ">Cerrar</button>
          </div>
        `;
        
        popup.querySelector('.close-btn').addEventListener('click', () => {
          document.body.removeChild(popup);
        });
        
        document.body.appendChild(popup);
      });
    });

  } catch (error) {
    console.error('Error:', error);
    const errorContainer = document.getElementById('modscontainer') || document.body;
    errorContainer.innerHTML = `
      <div class="error-message" style="
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
