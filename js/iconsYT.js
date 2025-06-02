/**
 * Módulo para manejar iconos y miniaturas de YouTube
 */

// Función para extraer el handle/ID de YouTube
export const getYouTubeHandle = (url) => {
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
export const getYouTubeThumbnail = (handleOrId) => {
  if (!handleOrId) return null;
  return `https://yt3.googleusercontent.com/ytc/${handleOrId}=s88-c-k-c0x00ffffff-no-rj`;
};

// Función principal para generar el HTML del crédito
export const renderCreditItem = (credit, nameColor = '#0ff0fc') => {
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
