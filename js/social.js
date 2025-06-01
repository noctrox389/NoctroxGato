// Configuración automática de redes
const socialLinks = {
  whatsapp: "https://chat.whatsapp.com/IjomD8ixNCy5ynpiNbt6X6",
  discord: "https://discord.gg/tuinvitación",
  youtube: "https://youtube.com/@noctroxgato"
};

document.addEventListener('DOMContentLoaded', function() {
  // Aplicar enlaces
  document.querySelector('.whatsapp').href = socialLinks.whatsapp;
  document.querySelector('.discord').href = socialLinks.discord;
  document.querySelector('.youtube').href = socialLinks.youtube;
});
