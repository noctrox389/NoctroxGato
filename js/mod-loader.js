document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('mods.json');
    const mods = await response.json();
    const container = document.getElementById('modsContainer');

    mods.forEach(mod => {
      const modCard = document.createElement('article');
      modCard.className = 'mod-card neon-card';
      modCard.style.background = mod.cardColor || '#1a1a2e';
      modCard.style.borderColor = mod.nameColor || '#0ff0fc';
      
      modCard.innerHTML = `
        <div class="mod-preview">
          <iframe src="https://www.youtube.com/embed/${mod.videoId}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="mod-info">
          <h2 class="neon-title" style="color: ${mod.nameColor || '#0ff0fc'}">
            ${mod.name}
          </h2>
          <div class="mod-meta">
            ${mod.tags.map(tag => `<span class="neon-tag">${tag}</span>`).join('')}
          </div>
          <p class="mod-desc">${mod.description}</p>
          <div class="mod-links">
            <a href="${mod.mediafireUrl}" class="neon-download" target="_blank">
              <i class="fas fa-download"></i> MediaFire
            </a>
            <button class="neon-credits" onclick="alert('${mod.credits.replace(/'/g, "\\'")}')">
              <i class="fas fa-users"></i> Créditos
            </button>
          </div>
        </div>
      `;
      container.appendChild(modCard);
    });

  } catch (error) {
    console.error('Error cargando mods:', error);
    document.getElementById('modsContainer').innerHTML = `
      <div class="error neon-text">
        Error cargando los mods. Por favor intenta más tarde.
      </div>
    `;
  }
});
