document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');
    if (!container) throw new Error('Contenedor de mods no encontrado');

    if (!Array.isArray(mods)) throw new Error('Formato de mods.json inválido');

    // Función para extraer el handle/ID de YouTube
    const getYouTubeHandle = (url) => {
      try {
        if (typeof url !== 'string') return null;
        
        // Para handles (@nombre)
        if (url.includes('youtube.com/@')) {
          const handle = url.split('@')[1].split('/')[0].split('?')[0];
          return handle || null;
        }
        
        // Para IDs de canal (UC...)
        const channelIdRegex = /(?:youtube\.com\/(?:channel\/|user\/)|youtu\.be\/)([^\/\?]+)/i;
        const match = url.match(channelIdRegex);
        return match ? match[1] : null;
        
      } catch (error) {
        console.error('Error al extraer handle de YouTube:', error);
        return null;
      }
    };

    // Función para generar URL de thumbnail
    const getYouTubeThumbnail = (handleOrId) => {
      if (!handleOrId) return null;
      return `https://yt3.googleusercontent.com/ytc/${handleOrId}=s88-c-k-c0x00ffffff-no-rj`;
    };

    // Función para obtener icono de plataforma
    const getPlatformIcon = (platform) => {
      const icons = {
        youtube: 'fab fa-youtube',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        tiktok: 'fab fa-tiktok',
        facebook: 'fab fa-facebook',
        twitch: 'fab fa-twitch',
        discord: 'fab fa-discord',
        website: 'fas fa-globe',
        default: 'fas fa-link'
      };
      return `<i class="${icons[platform] || icons.default}"></i>`;
    };

    // Función principal para generar el HTML del crédito
    const renderCreditItem = (credit, nameColor = '#0ff0fc') => {
      if (!credit?.url) {
        return `<div class="credit-item">${credit?.name || 'Crédito no disponible'}</div>`;
      }

      let mediaContent = '';
      const platform = credit.platform?.toLowerCase();

      try {
        if (platform === 'youtube') {
          const ytHandle = getYouTubeHandle(credit.url);
          if (ytHandle) {
            mediaContent = `
              <img src="${getYouTubeThumbnail(ytHandle)}" 
                   alt="${credit.name || 'YouTube'}"
                   class="yt-thumbnail"
                   style="border-color: ${nameColor}"
                   onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${ytHandle}/default.jpg'">`;
          } else {
            mediaContent = '<i class="fab fa-youtube"></i>';
          }
        } else {
          mediaContent = platform ? getPlatformIcon(platform) : '';
        }
      } catch (error) {
        console.error('Error generando crédito:', error);
        mediaContent = '<i class="fas fa-exclamation-circle"></i>';
      }

      return `
        <div class="credit-item" style="--neon-color: ${nameColor}">
          ${mediaContent}
          <a href="${credit.url}" 
             target="_blank" 
             rel="noopener noreferrer"
             style="color: ${nameColor}">
            ${credit.name}
          </a>
        </div>
      `;
    };

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
      
      // Generar lista de créditos
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
