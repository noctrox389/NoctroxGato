document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    if (!response.ok) throw new Error('No se pudo cargar mods.json');
    
    const mods = await response.json();
    const container = document.getElementById('modscontainer');
    if (!container) throw new Error('Contenedor de mods no encontrado');

    if (!Array.isArray(mods)) throw new Error('Formato de mods.json inválido');

    // Función para extraer el handle/ID de YouTube (se mantiene igual)
    const getYouTubeHandle = (url) => {
      try {
        if (typeof url !== 'string') return null;
        
        if (url.includes('youtube.com/@')) {
          const handle = url.split('@')[1].split('/')[0].split('?')[0];
          return handle || null;
        }
        
        const channelIdRegex = /(?:youtube\.com\/(?:channel\/|user\/)|youtu\.be\/)([^\/\?]+)/i;
        const match = url.match(channelIdRegex);
        return match ? match[1] : null;
        
      } catch (error) {
        console.error('Error al extraer handle de YouTube:', error);
        return null;
      }
    };

    // Función para generar URL de thumbnail (se mantiene igual)
    const getYouTubeThumbnail = (handleOrId) => {
      if (!handleOrId) return null;
      return `https://yt3.googleusercontent.com/ytc/${handleOrId}=s88-c-k-c0x00ffffff-no-rj`;
    };

    // Función para obtener icono de plataforma (se mantiene igual)
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

    // Función para generar créditos (se mantiene igual)
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

    // Creación de tarjetas (con la mejora en la descripción)
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
        height: 500px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: height 0.3s ease; /* Para animación suave */
      `;
      
      // Generar lista de créditos
      const creditsList = mod.credits?.map(credit => 
        renderCreditItem(credit, nameColor)
      ).join('') || 'Créditos no disponibles';

      // Sistema de descripción expandible
      const fullDesc = mod.description || 'Descripción no disponible';
      const maxChars = 100;
      const isLongDesc = fullDesc.length > maxChars;
      const shortDesc = isLongDesc ? fullDesc.substring(0, maxChars) + '...' : fullDesc;

      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>
        </div>
        <div class="mod-info" style="flex: 1; display: flex; flex-direction: column;">
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
          <p class="mod-desc" style="
            flex: 1;
            overflow: hidden;
            margin: 10px 0;
          ">
            <span class="desc-text">${shortDesc}</span>
            ${isLongDesc ? `
              <button class="read-toggle" style="
                background: transparent;
                border: none;
                color: ${nameColor};
                cursor: pointer;
                padding: 0;
                font-size: 0.9em;
                display: block;
                margin-top: 5px;
              ">Leer más</button>
            ` : ''}
          </p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" 
               class="neon-download" 
               target="_blank" 
               rel="noopener noreferrer"
               style="color: ${nameColor}">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button class="neon-credits" data-credits="${creditsList.replace(/"/g, '&quot;')}"
                    style="color: black;
                           border-color: ${nameColor};
                           background-color: ${nameColor}30;">
              <i class="fas fa-users"></i> Créditos
            </button>
          </div>
        </div>
      `;
      
      // Funcionalidad toggle (Leer más/Mostrar menos)
      if (isLongDesc) {
        const descText = modCard.querySelector('.desc-text');
        const toggleBtn = modCard.querySelector('.read-toggle');
        let isExpanded = false;

        toggleBtn.addEventListener('click', () => {
          isExpanded = !isExpanded;
          
          if (isExpanded) {
            descText.textContent = fullDesc;
            toggleBtn.textContent = 'Mostrar menos';
            modCard.style.height = 'auto';
          } else {
            descText.textContent = shortDesc;
            toggleBtn.textContent = 'Leer más';
            modCard.style.height = '500px';
          }
        });
      }
      
      container.appendChild(modCard);
    });

    // Popup de créditos (se mantiene igual)
    document.querySelectorAll('.neon-credits').forEach(button => {
      button.addEventListener('click', () => {
        const popup = document.createElement('div');
        popup.className = 'credits-popup';
        popup.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        `;
        
        const cyanColor = '#00FFFF';
        popup.innerHTML = `
          <div class="credits-content" style="
            background: #1a1a2e;
            border: 2px solid ${cyanColor};
            box-shadow: 0 0 20px ${cyanColor};
            padding: 1.5rem;
            max-width: 80vw;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 8px;
          ">
            <h3 style="
              margin-top: 0; 
              color: ${cyanColor};
              text-shadow: 0 0 8px ${cyanColor};
            ">
              <i class="fas fa-users"></i> Créditos
            </h3>
            <div style="color: #ffffff;">${button.dataset.credits}</div>
            <button class="close-btn" style="
              margin-top: 1rem;
              background: transparent;
              color: ${cyanColor};
              border: 1px solid ${cyanColor};
              padding: 0.5rem 1rem;
              cursor: pointer;
              border-radius: 4px;
              transition: all 0.3s ease;
            ">
              Cerrar
            </button>
          </div>
        `;
        
        // Efectos hover para el botón de cerrar
        const closeBtn = popup.querySelector('.close-btn');
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.background = 'rgba(0, 255, 255, 0.2)';
          closeBtn.style.boxShadow = '0 0 10px #00FFFF';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.background = 'transparent';
          closeBtn.style.boxShadow = 'none';
        });
        
        closeBtn.addEventListener('click', () => {
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
