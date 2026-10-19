/* Contenus tiers chargés seulement à la demande du visiteur (pas de cookie tiers sans action de sa part). */
(function(){
  document.querySelectorAll('.meteo-consent').forEach(function(box){
    box.querySelector('button').addEventListener('click', function(){
      var f = document.createElement('iframe');
      f.title = 'Prévisions de vent en direct — Baie de Quiberon';
      f.src = box.getAttribute('data-src');
      box.parentNode.replaceChild(f, box);
    });
  });
})();
