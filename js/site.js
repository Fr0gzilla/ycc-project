/* Petits automatismes communs à toutes les pages. */
(function(){
  // année du copyright à jour sans retoucher les pages chaque janvier
  document.querySelectorAll('[data-annee]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // menu mobile : un toucher en dehors du panneau le referme
  var b = document.getElementById('burger'), l = document.getElementById('navlinks');
  if(b && l){
    document.addEventListener('click', function(e){
      if(l.classList.contains('open') && !l.contains(e.target) && !b.contains(e.target)) b.click();
    });
  }
})();
