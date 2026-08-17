(() => {
  const root = document.querySelector('.nn-elementor-landing');
  if (!root) return;

  const menuButton = root.querySelector('#menuButton');
  const mobileMenu = root.querySelector('#mobileMenu');
  const stickyCta = root.querySelector('#stickyCta');
  const finalCta = root.querySelector('.final-cta');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      root.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        root.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  root.querySelectorAll('.faq-question').forEach((button) => {
    const answer = button.nextElementSibling;
    button.setAttribute('aria-expanded', 'false');
    if (answer?.id) button.setAttribute('aria-controls', answer.id);

    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const toggleSticky = () => {
    if (!stickyCta || !finalCta) return;
    const isPastHero = window.scrollY > 720;
    const isNearFinalCta = finalCta.getBoundingClientRect().top < window.innerHeight - 40;
    stickyCta.classList.toggle('show', isPastHero && !isNearFinalCta);
    stickyCta.classList.toggle('at-page-end', isNearFinalCta);
  };

  toggleSticky();
  window.addEventListener('scroll', toggleSticky, { passive: true });
})();
