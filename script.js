(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const desktopMenu = window.matchMedia('(min-width: 861px)');
  const menuTriggers = [...document.querySelectorAll('[data-mega-trigger]')];
  const menus = new Map([...document.querySelectorAll('[data-mega-menu]')].map(menu => [menu.dataset.megaMenu, menu]));
  let openMenuName = null;
  let closeTimer;

  function cancelMenuClose() {
    window.clearTimeout(closeTimer);
  }

  function closeMenu() {
    cancelMenuClose();
    menus.forEach(menu => {
      menu.hidden = true;
      menu.inert = true;
    });
    menuTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    header.classList.remove('has-open-menu');
    openMenuName = null;
  }

  function openMenu(name) {
    if (!desktopMenu.matches || !menus.has(name)) return;
    cancelMenuClose();
    menus.forEach((menu, key) => {
      const visible = key === name;
      menu.hidden = !visible;
      menu.inert = !visible;
    });
    menuTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(trigger.dataset.megaTrigger === name)));
    header.classList.add('has-open-menu');
    openMenuName = name;
  }

  function scheduleMenuClose() {
    cancelMenuClose();
    closeTimer = window.setTimeout(() => {
      const trigger = menuTriggers.find(link => link.dataset.megaTrigger === openMenuName);
      const menu = menus.get(openMenuName);
      if (trigger?.matches(':hover') || menu?.matches(':hover')) return;
      closeMenu();
    }, 180);
  }

  menuTriggers.forEach(trigger => {
    trigger.addEventListener('pointerenter', () => openMenu(trigger.dataset.megaTrigger));
    trigger.addEventListener('pointerleave', scheduleMenuClose);
    trigger.addEventListener('focusin', () => openMenu(trigger.dataset.megaTrigger));
    trigger.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown' || !desktopMenu.matches) return;
      event.preventDefault();
      openMenu(trigger.dataset.megaTrigger);
      menus.get(trigger.dataset.megaTrigger).querySelector('a').focus();
    });
    trigger.addEventListener('click', closeMenu);
  });

  menus.forEach(menu => {
    menu.addEventListener('pointerenter', cancelMenuClose);
    menu.addEventListener('pointerleave', scheduleMenuClose);
    menu.addEventListener('focusin', cancelMenuClose);
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
  });

  header.addEventListener('pointerleave', scheduleMenuClose);
  header.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!header.contains(document.activeElement)) closeMenu();
    }, 0);
  });
  document.addEventListener('pointerdown', event => {
    if (openMenuName && !header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !openMenuName) return;
    const trigger = menuTriggers.find(link => link.dataset.megaTrigger === openMenuName);
    closeMenu();
    trigger?.focus({ preventScroll: true });
  });
  desktopMenu.addEventListener('change', closeMenu);

  const serviceData = {
    design: { count: '01 / 04', number: '01', icon: 'web-design', title: 'Web Design', copy: 'Distinctive websites shaped around your audience and brand.' },
    development: { count: '02 / 04', number: '02', icon: 'development', title: 'Web Development', copy: 'Reliable, responsive builds made for real business needs.' },
    commerce: { count: '03 / 04', number: '03', icon: 'commerce', title: 'E-Commerce', copy: 'A clearer path from product discovery to purchase.' },
    growth: { count: '04 / 04', number: '04', icon: 'growth', title: 'SEO & Digital Growth', copy: 'Focused digital strategy that helps the right people find you.' }
  };
  const serviceMenu = menus.get('services');
  const servicePreview = serviceMenu.querySelector('.mega-preview-service');
  const serviceLinks = [...serviceMenu.querySelectorAll('[data-service-preview]')];

  function showServicePreview(key) {
    const item = serviceData[key];
    if (!item) return;
    servicePreview.dataset.serviceVisual = key;
    servicePreview.querySelector('[data-service-count]').textContent = item.count;
    servicePreview.querySelector('[data-service-number]').textContent = item.number;
    servicePreview.querySelector('[data-service-icon] use').setAttribute('href', `assets/icons.svg#${item.icon}`);
    servicePreview.querySelector('[data-service-title]').textContent = item.title;
    servicePreview.querySelector('[data-service-copy]').textContent = item.copy;
    serviceLinks.forEach(link => link.classList.toggle('is-preview-active', link.dataset.servicePreview === key));
  }

  serviceLinks.forEach(link => {
    link.addEventListener('pointerenter', () => showServicePreview(link.dataset.servicePreview));
    link.addEventListener('focusin', () => showServicePreview(link.dataset.servicePreview));
  });

  const workData = {
    agoda: { count: '01 / 03', title: 'Agoda', sector: 'Travel / Careers platform', src: 'assets/agoda-site.webp', alt: 'Agoda Careers website preview', width: 1215, height: 924 },
    sisb: { count: '02 / 03', title: 'SISB', sector: 'Education / School website', src: 'assets/sisb-site.webp', alt: 'SISB website preview', width: 2400, height: 1500 },
    gaysorn: { count: '03 / 03', title: 'Gaysorn Village', sector: 'Retail / Destination website', src: 'assets/gaysorn-site-c.webp', alt: 'Gaysorn Village website preview', width: 2560, height: 1600 }
  };
  const workMenu = menus.get('work');
  const workPreview = workMenu.querySelector('.mega-preview-work');
  const workImage = workMenu.querySelector('[data-work-image]');
  const workLinks = [...workMenu.querySelectorAll('[data-work-preview]')];
  let workSwitchTimer;

  function showWorkPreview(key) {
    const item = workData[key];
    if (!item) return;
    window.clearTimeout(workSwitchTimer);
    workPreview.classList.add('is-switching');
    workImage.src = item.src;
    workImage.alt = item.alt;
    workImage.width = item.width;
    workImage.height = item.height;
    workMenu.querySelector('[data-work-count]').textContent = item.count;
    workMenu.querySelector('[data-work-sector]').textContent = item.sector;
    workMenu.querySelector('[data-work-title]').textContent = item.title;
    workLinks.forEach(link => link.classList.toggle('is-preview-active', link.dataset.workPreview === key));
    workSwitchTimer = window.setTimeout(() => workPreview.classList.remove('is-switching'), 130);
  }

  workLinks.forEach(link => {
    link.addEventListener('pointerenter', () => showWorkPreview(link.dataset.workPreview));
    link.addEventListener('focusin', () => showWorkPreview(link.dataset.workPreview));
  });

  const stage = document.querySelector('.project-stage');
  const slides = [...stage.querySelectorAll('.project-slide')];
  const pagination = [...document.querySelectorAll('.project-dots button')];
  const announcement = document.getElementById('project-announcement');
  let projectIndex = 0;

  function showProject(index, { announce = true, animate = true, focusStep = null } = {}) {
    projectIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const visible = i === projectIndex;
      slide.hidden = !visible;
      slide.inert = !visible;
      slide.classList.remove('is-entering');
    });
    const selected = slides[projectIndex];
    if (animate) {
      void selected.offsetWidth;
      selected.classList.add('is-entering');
    }
    pagination.forEach((button, i) => {
      if (i === projectIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    if (announce) announcement.textContent = `Project ${projectIndex + 1} of ${slides.length}: ${selected.querySelector('h3').textContent}`;
    if (focusStep !== null) selected.querySelector(`[data-step="${focusStep}"]`).focus({ preventScroll: true });
  }

  document.documentElement.classList.add('js');
  showProject(0, { announce: false, animate: false });

  stage.addEventListener('click', event => {
    const control = event.target.closest('button[data-step]');
    if (!control) return;
    const step = Number(control.dataset.step);
    showProject(projectIndex + step, { focusStep: step });
  });
  stage.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const focusedControl = event.target.closest('button[data-step]');
    showProject(projectIndex + step, { focusStep: focusedControl ? Number(focusedControl.dataset.step) : null });
  });
  pagination.forEach(button => button.addEventListener('click', () => showProject(Number(button.dataset.projectIndex))));

  const navigation = [...document.querySelectorAll('.main-nav .nav-link')];
  const sections = navigation.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let ticking = false;

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    const line = header.getBoundingClientRect().height + 120;
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= line) current = section;
    });
    navigation.forEach(link => {
      const active = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
  window.addEventListener('resize', updateHeader);
  window.addEventListener('hashchange', updateHeader);
  updateHeader();
})();
