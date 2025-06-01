// Configuración automática de redes
const socialLinks = {
  whatsapp: "https://wa.me/tunúmero",
  discord: "https://discord.gg/tuinvitación",
  youtube: "https://youtube.com/tucanal"
};

document.addEventListener('DOMContentLoaded', function() {
  // Aplicar enlaces
  document.querySelector('.whatsapp').href = socialLinks.whatsapp;
  document.querySelector('.discord').href = socialLinks.discord;
  document.querySelector('.youtube').href = socialLinks.youtube;
});