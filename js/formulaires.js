/* Formulaires du site (contact de l'accueil + lettre de la baie sur toutes les pages).
   Tant que FORMSPREE_ID est vide, on ouvre la messagerie avec un message pré-rempli (mailto).
   Une fois le formulaire créé sur formspree.io, coller ici son identifiant (la fin de https://formspree.io/f/XXXXXXX). */
(function(){
  var FORMSPREE_ID = '';
  var MAIL = 'info@yccarnac.com';

  function mailto(sujet, corps){
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
  }
  function envoyer(data){
    return fetch('https://formspree.io/f/' + FORMSPREE_ID, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
      .then(function(r){ if(!r.ok) throw new Error(r.status); });
  }

  // formulaire de contact (accueil)
  var form = document.getElementById('bookform');
  var msg = document.getElementById('formmsg');
  if(form){
    if(FORMSPREE_ID){ form.action = 'https://formspree.io/f/' + FORMSPREE_ID; form.method = 'POST'; }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var val = function(n){ var el = form.elements[n]; return el ? el.value : ''; };
      var sujet = 'Demande — ' + (val('activite') || 'Yacht Club de Carnac');
      if(!FORMSPREE_ID){
        mailto(sujet, 'Prénom : ' + val('prenom') + '\nNom : ' + val('nom') +
                      '\nE-mail : ' + val('email') + '\nTéléphone : ' + val('telephone') +
                      '\nActivité : ' + val('activite') + '\nPériode : ' + val('periode') +
                      '\n\nMessage :\n' + val('message'));
        msg.classList.add('show');
        return;
      }
      var data = new FormData(form);
      data.append('_subject', sujet);
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      envoyer(data).then(function(){
        form.reset();
        msg.textContent = 'Merci, votre demande est bien partie ! Nous vous répondons sous 24 h. 🌊';
      }).catch(function(){
        msg.textContent = 'L\'envoi n\'a pas abouti. Écrivez-nous directement à ' + MAIL + '.';
      }).then(function(){ msg.classList.add('show'); btn.disabled = false; });
    });
  }

  // lettre de la baie (pied de page)
  document.querySelectorAll('form.news').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var i = f.querySelector('input[type="email"]');
      if(!i || !i.value) return;
      if(!FORMSPREE_ID){
        mailto('Inscription a la lettre de la baie', 'Bonjour, je souhaite recevoir la lettre de la baie a cette adresse : ' + i.value);
        return;
      }
      var data = new FormData();
      data.append('email', i.value);
      data.append('_subject', 'Inscription à la lettre de la baie');
      envoyer(data).then(function(){ i.value = ''; i.placeholder = 'Merci, c\'est noté !'; })
                   .catch(function(){ i.value = ''; i.placeholder = 'Échec, écrivez à ' + MAIL; });
    });
  });
})();
