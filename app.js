/* ADESEN — JS partagé multi-pages */

// Nav burger
function toggleNav() {
  var links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// Lightbox zoom
function openLightbox(src) {
  var overlay = document.getElementById('lightbox-overlay');
  var img = document.getElementById('lightbox-img');
  if (overlay && img) {
    img.src = src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeLightbox() {
  var overlay = document.getElementById('lightbox-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
// Fermer avec Échap
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

// Marquer le lien actif selon la page courante
(function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-links a.navlink').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  });
})();

// Scroll reveal (IntersectionObserver)
document.addEventListener('DOMContentLoaded', function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { obs.observe(el); });
});

// Flip cards — tap sur mobile
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.flip-card').forEach(function (card) {
    card.addEventListener('click', function () { card.classList.toggle('flipped'); });
  });
});

// Année footer
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Compteur animé de la bande de stats
(function () {
  var done = false;
  function run() {
    if (done) return;
    done = true;
    document.querySelectorAll('.stat-band-num').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10) || 0;
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var steps = 60, step = 0;
      var timer = setInterval(function () {
        step++;
        el.textContent = prefix + Math.round(target * step / steps) + suffix;
        if (step >= steps) { el.textContent = prefix + target + suffix; clearInterval(timer); }
      }, 26);
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    var band = document.querySelector('.stats-band');
    if (!band) return;
    if (!('IntersectionObserver' in window)) { run(); return; }
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { run(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(band);
  });
})();

// Compte à rebours & statut événement
(function () {
  function initCountdowns() {
    var cards = document.querySelectorAll('[data-countdown]');
    
    cards.forEach(function(card) {
      var startDateStr = card.getAttribute('data-countdown');
      var endDateStr = card.getAttribute('data-countdown-end') || '2026-09-27T00:00:00+02:00';
      
      var startDate = new Date(startDateStr).getTime();
      var endDate = new Date(endDateStr).getTime();
      
      var daysEl = card.querySelector('[data-days]');
      var hoursEl = card.querySelector('[data-hours]');
      var minutesEl = card.querySelector('[data-minutes]');
      var secondsEl = card.querySelector('[data-seconds]');
      var badgeEl = card.querySelector('.upcoming-badge');
      var countdownWrapper = card.querySelector('.countdown-wrapper');
      var emptyState = document.getElementById('upcoming-empty-state');
      
      if (!startDate) return;

      function updateCountdown() {
        var now = new Date().getTime();

        // 1. Événement terminé (après minuit) -> Masquer la carte et afficher l'état vide
        if (now >= endDate) {
          if (typeof interval !== 'undefined') clearInterval(interval);
          card.style.display = 'none';
          if (emptyState) {
            emptyState.style.display = 'block';
          }
          return;
        }

        // 2. Événement en cours (entre 15h00 et minuit) -> Afficher "EN COURS"
        if (now >= startDate && now < endDate) {
          if (badgeEl && !badgeEl.classList.contains('live')) {
            badgeEl.textContent = '🔴 Événement en cours';
            badgeEl.classList.add('live');
          }
          if (countdownWrapper && !countdownWrapper.querySelector('.countdown-live-banner')) {
            countdownWrapper.innerHTML = '<div class="countdown-live-banner">🎉 <span>L\'événement est actuellement en cours ! Soyez les bienvenus !</span></div>';
          }
          return;
        }

        // 3. Avant l'événement -> Compte à rebours actif
        var distance = startDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
      }

      updateCountdown();
      var interval = setInterval(updateCountdown, 1000);
    });
  }

  document.addEventListener('DOMContentLoaded', initCountdowns);
})();

// Inscription Newsletter via Web3Forms
document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var statusEl = form.querySelector('.newsletter-status');
      var btn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;

      var emailVal = emailInput.value.trim();
      var origBtnText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Envoi…';
      if (statusEl) {
        statusEl.textContent = 'Inscription en cours…';
        statusEl.className = 'newsletter-status';
      }

      try {
        var formData = new FormData();
        formData.append('access_key', 'd8cf37e6-7263-4f91-9faf-11607939c164');
        formData.append('subject', 'Nouvelle inscription Newsletter ADESEN');
        formData.append('from_name', 'Site Web ADESEN');
        formData.append('email', emailVal);
        formData.append('message', 'Nouvelle inscription à la newsletter ADESEN avec l\'adresse email : ' + emailVal);

        var res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        var data = await res.json();
        if (data.success) {
          if (statusEl) {
            statusEl.textContent = '✓ Merci ! Vous êtes bien inscrit(e).';
            statusEl.className = 'newsletter-status ok';
          }
          emailInput.value = '';
        } else {
          if (statusEl) {
            statusEl.textContent = 'Une erreur est survenue. Veuillez réessayer.';
            statusEl.className = 'newsletter-status err';
          }
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'Erreur réseau. Veuillez réessayer.';
          statusEl.className = 'newsletter-status err';
        }
      } finally {
        btn.disabled = false;
        btn.innerHTML = origBtnText;
      }
    });
  });
});
