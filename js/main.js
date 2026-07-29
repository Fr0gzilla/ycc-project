(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav solidify on scroll
  var nav = document.getElementById('nav');
  if(nav){
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  // mobile menu (accessible : inert quand fermé sur mobile, fermeture au clavier)
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if(burger && links){
    var mq = window.matchMedia('(max-width:720px)');
    var syncMenu = function(open){
      var hidden = mq.matches && !open;
      if(hidden){ links.setAttribute('inert',''); links.setAttribute('aria-hidden','true'); }
      else { links.removeAttribute('inert'); links.removeAttribute('aria-hidden'); }
    };
    var setMenu = function(open){
      links.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      syncMenu(open);
    };
    burger.addEventListener('click', function(){ setMenu(!links.classList.contains('open')); });
    links.addEventListener('click', function(e){ if(e.target.tagName === 'A'){ setMenu(false); } });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){ setMenu(false); burger.focus(); }
    });
    mq.addEventListener('change', function(){ syncMenu(links.classList.contains('open')); });
    syncMenu(false);
  }

  // reveal on scroll
  var revs = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
    }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
    revs.forEach(function(r){ io.observe(r); });
  } else {
    revs.forEach(function(r){ r.classList.add('in'); });
  }

  // count-up stats
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var uNode = el.querySelector('.u');
    var uHTML = uNode ? uNode.outerHTML : '';
    if(reduce){ el.innerHTML = target + suffix + uHTML; return; }
    var start = null, dur = 1400;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      var val = Math.round(target * eased);
      el.innerHTML = val + suffix + uHTML;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statNodes = document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ countUp(en.target); io2.unobserve(en.target);} });
    }, {threshold:.6});
    statNodes.forEach(function(n){ io2.observe(n); });
  } else { statNodes.forEach(countUp); }

  // subtle hero parallax
  if(!reduce){
    var boat = document.querySelector('.boat');
    var sun = document.querySelector('.sun');
    if(boat || sun){
      window.addEventListener('pointermove', function(e){
        var x = (e.clientX / window.innerWidth - .5);
        var y = (e.clientY / window.innerHeight - .5);
        if(boat) boat.style.marginLeft = (x*18) + 'px';
        if(sun) sun.style.transform = 'translate('+(x*-22)+'px,'+(y*-12)+'px)';
      }, {passive:true});
    }
  }

  // formulaire de contact : ouvre le client mail avec la demande pré-remplie
  var form = document.getElementById('bookform');
  var msg = document.getElementById('formmsg');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var val = function(n){ var el = form.elements[n]; return el ? el.value : ''; };
      var sujet = 'Demande — ' + (val('activite') || 'Yacht Club de Carnac');
      var corps = 'Prénom : ' + val('prenom') + '\nNom : ' + val('nom') +
                  '\nE-mail : ' + val('email') + '\nTéléphone : ' + val('telephone') +
                  '\nActivité : ' + val('activite') + '\nPériode : ' + val('periode') +
                  '\n\nMessage :\n' + val('message');
      window.location.href = 'mailto:infos@yccarnac.com?subject=' +
        encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
      if(msg) msg.classList.add('show');
    });
  }
})();
