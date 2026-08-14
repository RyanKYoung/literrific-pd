(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function () {
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Subscribing…';
      }
      window.setTimeout(function () {
        form.innerHTML = '<p class="form-success" role="status">✓ You’re subscribed. Check your inbox for a welcome email.</p>';
      }, 1000);
    });
  });

  const teamButtons = document.querySelectorAll('[data-team-index]');
  const teamImages = document.querySelectorAll('.team-portrait img');
  const teamName = document.getElementById('team-name');
  const teamRole = document.getElementById('team-role');
  const teamCredential = document.getElementById('team-credential');
  const portraitIndex = document.querySelector('.portrait-index');

  teamButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const index = Number(button.dataset.teamIndex);
      teamButtons.forEach(function (item) { item.classList.remove('is-active'); item.setAttribute('aria-pressed', 'false'); });
      teamImages.forEach(function (image) { image.classList.remove('is-active'); });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      if (teamImages[index]) teamImages[index].classList.add('is-active');
      if (teamName) teamName.textContent = button.dataset.name || '';
      if (teamRole) teamRole.textContent = button.dataset.role || '';
      if (teamCredential) teamCredential.textContent = button.dataset.credential || '';
      if (portraitIndex) portraitIndex.textContent = String(index + 1).padStart(2, '0');
    });
  });

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    let current = 0;

    function show(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      const source = galleryItems[current].querySelector('img');
      const copy = galleryItems[current].querySelector('.gallery-caption');
      image.src = source.src;
      image.alt = source.alt;
      caption.textContent = copy ? copy.textContent : '';
      counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + galleryItems.length;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('lightbox-close').focus();
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      image.src = '';
      galleryItems[current].focus();
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { show(index); });
    });
    document.getElementById('lightbox-close').addEventListener('click', close);
    document.getElementById('lightbox-prev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      const button = contactForm.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }
      window.setTimeout(function () {
        contactForm.hidden = true;
        const success = document.getElementById('contact-success');
        if (success) success.classList.add('is-visible');
      }, 1500);
    });
  }
})();
