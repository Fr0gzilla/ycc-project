/* Petits automatismes communs à toutes les pages. */
(function(){
  // année du copyright à jour sans retoucher les pages chaque janvier
  document.querySelectorAll('[data-annee]').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
