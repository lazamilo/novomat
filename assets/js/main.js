(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');
  const hasGsap = typeof gsap !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined' && hasGsap) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -60 }); }
    }));
  }

  /* ---------- header state ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 30);
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !document.documentElement.classList.contains('menu-open') && !$('.nav__item.is-open'));
    document.documentElement.classList.toggle('hdr-hidden', hdr.classList.contains('is-hidden'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- loader ---------- */
  const loader = $('.loader');
  const intro = () => { if (hasGsap) gsap.from('.hero__h .row, .hero__under', { y: 60, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out' }); };
  if (loader && getComputedStyle(loader).display !== 'none' && hasGsap && !reduced) {
    const n = { v: 0 }, cnt = $('.loader__count');
    gsap.timeline({ onComplete: () => { loader.remove(); try { sessionStorage.setItem('nm-loaded', 1); } catch (e) {} } })
      .to('.loader__mark', { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power3.inOut' }, 0)
      .to(n, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => cnt.textContent = Math.round(n.v) }, 0)
      .to('.loader__in', { opacity: 0, y: -20, duration: .4 }, 1.2)
      .to(loader, { opacity: 0, duration: .5 }, 1.35)
      .add(intro, 1.35);
  } else { loader && loader.remove(); intro(); }

  /* ---------- hero: windshield window expands to full screen ---------- */
  const hero = $('#hero'), media = $('#hmedia'), slot = $('#slot');
  if (hero && media && slot) {
    const stick = $('.hero__stick');
    const rect = () => { // layout position, ignores the intro transforms
      let top = 0, left = 0, el = slot;
      while (el && el !== stick) { top += el.offsetTop; left += el.offsetLeft; el = el.offsetParent; }
      return { top, left, width: slot.offsetWidth, height: slot.offsetHeight };
    };
    const place = () => gsap.set(media, rect());
    if (!hasGsap || reduced) {
      const r = rect(); Object.assign(media.style, { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px' });
      $('.hero').style.height = '100vh';
    } else {
      place();
      document.fonts && document.fonts.ready.then(() => { place(); ScrollTrigger.refresh(); });
      const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true, onRefresh: self => { if (self.progress === 0) place(); } } });
      tl.fromTo(media, { top: () => rect().top, left: () => rect().left, width: () => rect().width, height: () => rect().height, clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' },
        { top: 0, left: 0, width: () => stick.clientWidth, height: () => stick.clientHeight, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'power2.inOut', duration: 1 }, 0)
        .to('.hero__media img', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        .to('.hero__text', { opacity: 0, y: -80, ease: 'power2.in', duration: .55 }, 0)
        .fromTo('.hero__crack path', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: .04, duration: .45, ease: 'power1.out' }, .85)
        .to('.hero__crack', { opacity: 0, duration: .35 }, 1.5)
        .to('.hero__shade', { opacity: 1, duration: .4 }, 1.5)
        .fromTo('.hero__over', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .45, onStart: () => $('.hero__over').classList.add('is-on') }, 1.65)
        .to({}, { duration: .4 });
    }
  }

  /* ---------- repair or replace ---------- */
  const svg = $('#rrSvg');
  if (svg) {
    const chip = $('#rrChip'), crack = $('#rrCrack'), coin = $('#rrCoin'), coinLbl = $('#rrCoinLbl'), zone = $('#rrZone');
    const size = $('#rrSize'), out = $('#rrOut'), vt = $('#rrVt'), vd = $('#rrVd');
    const K = 2.6, COIN = 25.75; // viewBox units per mm, 2 € coin diameter
    let pos = { x: 560, y: 300 };
    const arms = [[-.55, -.9, -.78, -1.05], [.82, -.5, 1, -.4], [.25, 1, .1, 1.12], [-.95, .3, -1.1, .2], [.7, .75, .85, .95], [.1, -1, .2, -1.1]];
    const ws = svg.querySelector('path');
    const inZone = () => { const b = zone.getBBox(); return pos.x > b.x && pos.x < b.x + b.width && pos.y > b.y && pos.y < b.y + b.height; };
    const draw = () => {
      const mm = +size.value, R = mm * K / 2;
      crack.innerHTML = `<circle r="${Math.max(3, R * .16)}" fill="#0d1716"/>` + arms.map(a => `<path d="M0 0 L${a[0] * R * .8} ${a[1] * R * .8} L${a[2] * R} ${a[3] * R}"/>`).join('');
      coin.setAttribute('r', COIN * K / 2);
      chip.setAttribute('transform', `translate(${pos.x} ${pos.y})`);
      coinLbl.setAttribute('x', pos.x); coinLbl.setAttribute('y', pos.y - COIN * K / 2 - 10);
      out.textContent = mm + ' mm';
      size.style.setProperty('--p', ((mm - size.min) / (size.max - size.min) * 100) + '%');
      const z = inZone(), big = mm > COIN;
      zone.setAttribute('fill-opacity', z ? .28 : .14);
      if (!z && !big) { vt.textContent = 'Popravilo'; vt.style.color = 'var(--teal)'; vd.textContent = 'Poškodba je manjša od kovanca za 2 € in zunaj vidnega polja voznika. Popravilo traja približno uro in pol, je trajno in poškodba se ne širi več.'; }
      else if (z) { vt.textContent = 'Menjava'; vt.style.color = 'var(--ink)'; vd.textContent = 'Poškodba je v vidnem polju voznika, kjer popravilo ni dovoljeno. Svetujemo menjavo po 15 točkah varne menjave.'; }
      else { vt.textContent = 'Menjava'; vt.style.color = 'var(--ink)'; vd.textContent = 'Poškodba je večja od kovanca za 2 €. Svetujemo menjavo stekla po 15 točkah varne menjave.'; }
    };
    const toSvg = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
    let drag = false;
    const move = e => {
      const p = toSvg(e);
      if (!ws.isPointInFill || ws.isPointInFill(Object.assign(svg.createSVGPoint(), { x: p.x, y: p.y }))) { pos = { x: p.x, y: p.y }; draw(); }
    };
    chip.addEventListener('pointerdown', e => { drag = true; chip.setPointerCapture(e.pointerId); });
    chip.addEventListener('pointermove', e => drag && move(e));
    chip.addEventListener('pointerup', () => drag = false);
    svg.addEventListener('click', e => { if (e.target.closest('#rrChip')) return; move(e); });
    size.addEventListener('input', draw);
    draw();
  }

  /* ---------- locations ---------- */
  const list = $('#locList');
  if (list && window.NOVOMAT_PE) {
    const pe = window.NOVOMAT_PE, img = $('#locImg'), info = $('#locInfo');
    list.innerHTML = pe.map((c, i) => `<li><button data-i="${i}" class="${i ? '' : 'on'}">${c.name}<span>${c.addr}</span></button></li>`).join('');
    img.innerHTML = pe.map((c, i) => `<img src="${c.img}" alt="Poslovalnica ${c.name}" class="${i ? '' : 'on'}" loading="lazy">`).join('');
    const show = i => {
      const c = pe[i];
      $$('button', list).forEach((b, j) => b.classList.toggle('on', j === i));
      $$('img', img).forEach((m, j) => m.classList.toggle('on', j === i));
      info.innerHTML = `<div><dt>Naslov</dt><dd>${c.addr}<br>${c.post}</dd></div>
        <div><dt>Telefon</dt><dd><a href="tel:${c.telH}">${c.tel}</a><br>GSM ${c.gsm}</dd></div>
        <div><dt>E-pošta</dt><dd><a href="mailto:${c.mail}">${c.mail}</a></dd></div>
        <div><dt>Delovni čas</dt><dd>Pon–pet 8.00–16.00<br>${c.sat}</dd></div>
        <div><dt>Pot do nas</dt><dd><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Novomat ' + c.addr + ' ' + c.post)}" target="_blank" rel="noopener">Odpri zemljevid</a></dd></div>`;
    };
    $$('button', list).forEach(b => { b.addEventListener('click', () => show(+b.dataset.i)); b.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && show(+b.dataset.i)); });
    show(0);
  }

  /* ---------- forms (demo) ---------- */
  $$('[data-form]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    f.classList.add('sent'); $('button[type=submit]', f).style.display = 'none';
  }));

  if (!hasGsap || reduced) { $$('.rv').forEach(el => el.style.opacity = 1); return; }

  /* ---------- reveals ---------- */
  ScrollTrigger.batch('.rv', { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out' }) });
  $$('.sec__head .d2, .ph .d1, .svc__body .d3').forEach(h => gsap.from(h, { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));

  /* gray to ink text fill */
  $$('[data-fill]').forEach(p => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    const ws = $$('.w', p);
    ScrollTrigger.create({ trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i < n)); } });
  });

  /* stat counter */
  const stat = $('#statNum');
  if (stat) $$('[data-to]', stat).forEach(s => { const o = { v: 0 }; gsap.to(o, { v: +s.dataset.to, duration: 1.6, ease: 'power2.out', onUpdate: () => s.textContent = Math.round(o.v), scrollTrigger: { trigger: stat, start: 'top 80%' } }); });

  /* pillar icons draw */
  $$('.pillar svg, .doc svg').forEach(svg => {
    const ps = $$('path,circle,rect', svg);
    ps.forEach(p => { const l = p.getTotalLength ? p.getTotalLength() : 200; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    gsap.to(ps, { strokeDashoffset: 0, duration: 1.4, stagger: .12, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 85%' } });
  });

  /* mini parallax inside frames */
  $$('[data-par]').forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* 15 points */
  const pl = $('#ptsList');
  if (pl) {
    const items = $$('li', pl), N = $('#ptsN'), wsP = $('#ptsWs');
    wsP.style.strokeDasharray = 1; wsP.style.strokeDashoffset = 1;
    const mobile = matchMedia('(max-width:900px)').matches;
    items.forEach((li, i) => ScrollTrigger.create({ trigger: li, start: 'top 55%', end: 'bottom 55%', onToggle: s => { if (s.isActive || s.direction === 1) { items.forEach((x, j) => x.classList.toggle('on', mobile || j <= i)); N.textContent = String(i + 1).padStart(2, '0'); } }, onLeaveBack: () => { items.forEach((x, j) => x.classList.toggle('on', mobile || j < i)); N.textContent = String(Math.max(1, i)).padStart(2, '0'); } }));
    gsap.to(wsP, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: pl, start: 'top 55%', end: 'bottom 75%', scrub: true } });
  }

  /* testimonials drift */
  $$('.q').forEach((q, i) => gsap.to(q, { y: (i % 2 ? -1 : 1) * 30, ease: 'none', scrollTrigger: { trigger: '.tst', start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* subnav active state */
  const sn = $$('.subnav a');
  if (sn.length) sn.forEach(a => { const t = document.querySelector(a.getAttribute('href')); t && ScrollTrigger.create({ trigger: t, start: 'top 40%', end: 'bottom 40%', onToggle: s => s.isActive && sn.forEach(x => x.classList.toggle('on', x === a)) }); });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
