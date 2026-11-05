/* Shared header, mega menu, mobile menu and footer. Rendered from JS so every page stays in sync and works from file:// */
(function () {
  const WS = 'M30 12 Q100 2 170 12 L194 106 Q100 118 6 106 Z';
  const ILL = {
    menjava: `<svg class="draw" viewBox="0 0 200 124"><path d="${WS}"/><path d="M16 96 Q100 106 184 96" opacity=".35"/><circle cx="58" cy="54" r="13"/><circle cx="142" cy="54" r="13"/><line x1="58" y1="67" x2="58" y2="84"/><line x1="142" y1="67" x2="142" y2="84"/></svg>`,
    popravilo: `<svg class="draw" viewBox="0 0 200 124"><path d="${WS}" opacity=".35"/><circle cx="100" cy="62" r="26"/><path d="M100 62 l-10 -12 M100 62 l13 -9 M100 62 l3 15 M100 62 l-14 6 M100 62 l9 12"/><circle cx="100" cy="62" r="3"/></svg>`,
    prodaja: `<svg class="draw" viewBox="0 0 200 124"><g transform="translate(-14 14)" opacity=".3"><path d="${WS}" transform="scale(.86) translate(16 4)"/></g><g transform="translate(-6 6)" opacity=".6"><path d="${WS}" transform="scale(.86) translate(16 4)"/></g><g transform="translate(4 -2)"><path d="${WS}" transform="scale(.86) translate(16 4)"/></g></svg>`,
    mobilni: `<svg class="draw" viewBox="0 0 200 124"><path d="M14 92 V40 Q14 30 24 30 H122 L150 52 H178 Q186 52 186 60 V92 Z"/><path d="M124 34 V56 H150" opacity=".5"/><circle cx="52" cy="94" r="12"/><circle cx="152" cy="94" r="12"/><path d="M30 46 H104" opacity=".5"/></svg>`,
    zavarovalnice: `<svg class="draw" viewBox="0 0 200 124"><path d="M100 10 L146 26 V60 Q146 94 100 114 Q54 94 54 60 V26 Z"/><path d="M80 62 L95 77 L122 48"/></svg>`
  };
  window.NOVOMAT_ILL = ILL;
  window.NOVOMAT_WS = WS;

  const page = document.body.dataset.page || '';
  const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8h11M9 3.5 13.5 8 9 12.5"/></svg>';
  const chev = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4.5 6 8.5l4-4"/></svg>';
  const phone = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4.5 2.5h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 3 4.1 1.5 1.5 0 0 1 4.5 2.5Z"/></svg>';

  const services = [
    ['menjava', 'Menjava stekel', '15 varnostnih točk', 'storitve.html#menjava', 'assets/img/menjava-ekipa.jpg'],
    ['popravilo', 'Popravilo stekel', 'V približno uri in pol', 'storitve.html#popravilo'],
    ['prodaja', 'Prodaja avto stekel', 'Več tisoč stekel na zalogi', 'storitve.html#prodaja'],
    ['mobilni', 'Mobilni servis', 'Po vsej Sloveniji', 'storitve.html#mobilni-servis'],
    ['zavarovalnice', 'Zavarovalnice', 'Uradne cenitve škod', 'storitve.html#zavarovalnice']
  ];
  const cities = window.NOVOMAT_PE = [
    { id: 'ljubljana', name: 'Ljubljana', area: 'Črnuče', addr: 'Pot k sejmišču 28', post: '1231 Ljubljana-Črnuče', tel: '01 530 94 70', telH: '+38615309470', gsm: '031 719 111', mail: 'info.lj@novomat.si', sat: 'Sobota 8.00–12.00', img: 'assets/img/pe-ljubljana.jpg' },
    { id: 'maribor', name: 'Maribor', area: 'Sedež podjetja', addr: 'Valvasorjeva 85', post: '2000 Maribor', tel: '02 421 28 20', telH: '+38624212820', gsm: '031 316 339', mail: 'info.mb@novomat.si', sat: 'Sobota 8.00–12.00', img: 'assets/img/pe-maribor.jpg' },
    { id: 'celje', name: 'Celje', area: 'Ipavčeva 21', addr: 'Ipavčeva 21', post: '3000 Celje', tel: '03 428 62 91', telH: '+38634286291', gsm: '041 343 152', mail: 'info.ce@novomat.si', sat: 'Sobota po dogovoru', img: 'assets/img/pe-celje.jpg' },
    { id: 'koper', name: 'Koper', area: 'Sermin 72a', addr: 'Sermin 72a', post: '6000 Koper', tel: '05 62 62 888', telH: '+38656262888', gsm: '031 637 888', mail: 'info.kp@novomat.si', sat: 'Sobota po dogovoru', img: 'assets/img/pe-koper.jpg' },
    { id: 'murska-sobota', name: 'Murska Sobota', area: 'Lendavska ulica 63b', addr: 'Lendavska ulica 63b', post: '9000 Murska Sobota', tel: '02 22 93 090', telH: '+38622293090', gsm: '051 367 747', mail: 'info.ms@novomat.si', sat: 'Sobota po dogovoru', img: 'assets/img/pe-murska-sobota.jpg' }
  ];

  const megaSvc = services.map(([k, t, s, href, img]) => `
    <a class="mega__card" href="${href}">
      <div class="mega__img">${img ? `<img src="${img}" alt="">` : ILL[k].replace('class="draw"', 'class="draw" style="color:var(--teal)"')}</div>
      <div class="mega__t">${t}</div><div class="mega__s">${s}</div>
    </a>`).join('');
  const megaPe = cities.map(c => `
    <div class="mega__city"><b>${c.name}</b><span>${c.addr}, ${c.post}</span><a href="tel:${c.telH}">${c.tel}</a></div>`).join('');

  const hdr = `
  <header class="hdr" id="hdr">
    <a class="hdr__logo" href="index.html" aria-label="Novomat Avto steklo center, domov"><img src="assets/logo/novomat-logo.png" alt="Novomat Avto steklo center"></a>
    <nav class="nav" aria-label="Glavna navigacija">
      <div class="nav__item"><button aria-haspopup="true">Storitve ${chev}</button>
        <div class="mega"><div class="mega__grid">${megaSvc}</div></div></div>
      <div class="nav__item"><a href="poslovalnice.html">Poslovalnice ${chev}</a>
        <div class="mega mega--list"><div class="mega__grid">${megaPe}</div></div></div>
      <div class="nav__item"><a href="vprasanja.html">Vprašanja</a></div>
      <div class="nav__item"><a href="poslovalnice.html#podjetje">Podjetje</a></div>
    </nav>
    <div class="hdr__right">
      <a class="hdr__tel" href="tel:+38615309470">${phone}01 530 94 70</a>
      <a class="btn" href="termin.html">Rezervirajte termin ${arrow}</a>
      <button class="burger" aria-label="Meni" aria-expanded="false"><span></span><span></span></button>
    </div>
  </header>
  <div class="mnav" id="mnav">
    <a href="storitve.html">Storitve</a>
    ${services.map(s => `<a class="mnav__sub" href="${s[3]}">${s[1]}</a>`).join('')}
    <a href="poslovalnice.html">Poslovalnice</a>
    <a href="vprasanja.html">Vprašanja</a>
    <a href="poslovalnice.html#podjetje">Podjetje</a>
    <a class="btn" href="termin.html">Rezervirajte termin ${arrow}</a>
  </div>`;

  const ftr = `
  <footer class="ftr">
    <div class="ftr__top">
      <div><img src="assets/logo/novomat-logo.png" alt="Novomat Avto steklo center"></div>
      ${cities.map(c => `<div class="ftr__city"><b>${c.name}</b>${c.addr}<br>${c.post}<br><a href="tel:${c.telH}">${c.tel}</a></div>`).join('')}
    </div>
    <div class="ftr__big" aria-hidden="true">Avto steklo center</div>
    <div class="ftr__bot">
      <span>© ${new Date().getFullYear()} Novomat d.o.o.</span>
      <nav><a href="storitve.html">Storitve</a><a href="poslovalnice.html">Poslovalnice</a><a href="vprasanja.html">Vprašanja</a><a href="https://www.facebook.com/avtosteklocenter" target="_blank" rel="noopener">Facebook</a><a href="#">Piškotki</a></nav>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', hdr);
  document.body.insertAdjacentHTML('beforeend', ftr);

  // fill [data-ill] placeholders
  document.querySelectorAll('[data-ill]').forEach(el => { el.outerHTML = ILL[el.dataset.ill].replace('class="draw"', `class="draw ${el.className}"`); });

  const burger = document.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = document.documentElement.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav__item > button').forEach(b => b.addEventListener('click', () => b.parentElement.classList.toggle('is-open')));
  document.addEventListener('click', e => { if (!e.target.closest('.nav__item')) document.querySelectorAll('.nav__item.is-open').forEach(n => n.classList.remove('is-open')); });

  window.NOVOMAT_ICONS = { arrow, phone };
})();
