document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const backToTop = document.querySelector('.back-to-top');
  const loadingScreen = document.querySelector('.loading-screen');
  const revealElements = document.querySelectorAll('.reveal');
  const menuCards = document.querySelectorAll('.menu-card');
  const filterButtons = document.querySelectorAll('.filter-button');
  const emptyMessage = document.querySelector('.filter-empty');
  const modal = document.querySelector('.menu-modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalDescription = document.querySelector('#modal-description');
  const modalPrice = document.querySelector('#modal-price');

  const closeNavigation = () => {
    nav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  };

  const updateScrollState = () => {
    const hasScrolled = window.scrollY > 20;
    header.classList.toggle('is-scrolled', hasScrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNavigation();
    });
  });

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      menuCards.forEach((card) => {
        const isVisible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !isVisible);
        if (isVisible) visibleCount += 1;
      });
      emptyMessage.hidden = visibleCount > 0;
    });
  });

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  };

  menuCards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    const openModal = () => {
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalDescription.textContent = card.dataset.description;
      modalPrice.textContent = card.querySelector('.menu-info > strong').textContent;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      modal.querySelector('.modal-close').focus();
    };
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('load', () => {
    window.setTimeout(() => loadingScreen.classList.add('is-hidden'), 350);
  });
});