/* Анімації та мікровзаємодії вітрини. Поважає «зменшити рух» у налаштуваннях системи. */
(function () {
  'use strict';
  const FL = window.FL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = FL.esc;

  /* ---------- поява блоків під час прокрутки ---------- */
  function initReveal() {
    const els = $$('[data-reveal], .season, .cat-tile');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => { e.classList.add('will-reveal'); io.observe(e); });
  }

  /* ---------- банер: паралакс від миші та прокрутки ---------- */
  function initHero() {
    const hero = $('#hero');
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add('is-ready'));
    if (reduce) return;
    let mx = 0, my = 0, sy = 0, raf = 0;
    const apply = () => { raf = 0; hero.style.setProperty('--mx', mx.toFixed(2)); hero.style.setProperty('--my', (my + sy).toFixed(2)); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * -24;
      my = ((e.clientY - r.top) / r.height - 0.5) * -10;
      queue();
    });
    hero.addEventListener('pointerleave', () => { mx = 0; my = 0; queue(); });
    window.addEventListener('scroll', () => { sy = Math.min(window.scrollY, 600) * 0.06; queue(); }, { passive: true });
  }


  /* ---------- нічне небо: мерехтливі зірки, падаючі зорі, іскри від вогнища ---------- */
  function initSky() {
    const hero = $('#hero');
    const starsC = $('.hero__stars'), sparksC = $('.hero__sparks'), fire = $('#fire');
    if (!hero || !starsC || !sparksC) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sc = starsC.getContext('2d'), pc = sparksC.getContext('2d');
    let W = 0, H = 0, stars = [], sparks = [], shoot = null, running = true;
    const rand = (a, b) => a + Math.random() * (b - a);
    function size() {
      const r = hero.getBoundingClientRect();
      W = r.width; H = r.height;
      [starsC, sparksC].forEach((c) => { c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; });
      sc.setTransform(dpr, 0, 0, dpr, 0, 0); pc.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(W * H / 2600);
      stars = Array.from({ length: n }, () => ({ x: rand(0, W), y: rand(0, H * 0.62), r: Math.random() < 0.08 ? rand(1.2, 1.8) : rand(0.4, 1.1), p: rand(0, Math.PI * 2), s: rand(0.6, 2) }));
    }
    function firePos() {
      if (!fire) return { x: W * 0.8, y: H * 0.9 };
      const f = fire.getBoundingClientRect(), h = hero.getBoundingClientRect();
      return { x: f.left - h.left + f.width / 2, y: f.top - h.top + f.height * 0.2 };
    }
    function drawStars(t) {
      sc.clearRect(0, 0, W, H);
      for (const st of stars) {
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * st.s + st.p));
        sc.globalAlpha = a * (1 - st.y / (H * 0.75));
        sc.fillStyle = '#fdf6e3';
        sc.beginPath(); sc.arc(st.x, st.y, st.r, 0, Math.PI * 2); sc.fill();
      }
      if (!shoot && Math.random() < 0.004) shoot = { x: rand(W * 0.2, W * 0.9), y: rand(10, H * 0.25), vx: rand(-9, -6), vy: rand(2.5, 4), life: 1 };
      if (shoot) {
        const g = sc.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 10, shoot.y - shoot.vy * 10);
        g.addColorStop(0, 'rgba(255,250,235,' + shoot.life + ')'); g.addColorStop(1, 'rgba(255,250,235,0)');
        sc.globalAlpha = 1; sc.strokeStyle = g; sc.lineWidth = 1.6;
        sc.beginPath(); sc.moveTo(shoot.x, shoot.y); sc.lineTo(shoot.x - shoot.vx * 10, shoot.y - shoot.vy * 10); sc.stroke();
        shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life -= 0.018;
        if (shoot.life <= 0) shoot = null;
      }
      sc.globalAlpha = 1;
    }
    function drawSparks() {
      pc.clearRect(0, 0, W, H);
      const f = firePos();
      if (sparks.length < 70 && Math.random() < 0.55) sparks.push({ x: f.x + rand(-8, 8), y: f.y, vx: rand(-0.35, 0.35), vy: rand(-1.6, -0.7), life: 1, d: rand(0.006, 0.014), r: rand(0.8, 2.2), w: rand(0, Math.PI * 2) });
      pc.globalCompositeOperation = 'lighter';
      sparks = sparks.filter((p) => {
        p.w += 0.08; p.x += p.vx + Math.sin(p.w) * 0.35; p.y += p.vy; p.vy *= 0.995; p.life -= p.d;
        if (p.life <= 0) return false;
        const g = pc.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,214,140,${p.life})`); g.addColorStop(0.4, `rgba(255,120,40,${p.life * 0.6})`); g.addColorStop(1, 'rgba(255,90,20,0)');
        pc.fillStyle = g; pc.beginPath(); pc.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); pc.fill();
        return true;
      });
      pc.globalCompositeOperation = 'source-over';
    }
    size();
    window.addEventListener('resize', size);
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(loop); }).observe(hero);
    function loop(t) {
      if (!running) return;
      drawStars(t);
      if (!reduce) drawSparks();
      if (!reduce) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- підсвітка під курсором на картках і плитках ---------- */
  function initSpotlight() {
    if (reduce) return;
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target.closest('.card, .promo, .cat-tile, .brand, .panel');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- таймер акції ---------- */
  function initCountdown() {
    const els = $$('.countdown');
    if (!els.length) return;
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => els.forEach((el) => {
      let s = Math.max(0, Math.floor((Number(el.dataset.until) - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      const m = Math.floor(s / 60); s %= 60;
      el.innerHTML = [[d, 'дн'], [pad(h), 'год'], [pad(m), 'хв'], [pad(s), 'с']].map(([v, l]) => `<span><b>${v}</b><small>${l}</small></span>`).join('');
    });
    tick(); setInterval(tick, 1000);
  }

  /* ---------- шапка з тінню, кнопка «вгору» ---------- */
  function initChrome() {
    const header = $('.header');
    const top = document.createElement('button');
    top.className = 'totop'; top.type = 'button'; top.setAttribute('aria-label', 'Повернутися нагору');
    top.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    document.body.appendChild(top);
    const onScroll = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 8);
      top.classList.toggle('is-shown', window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- міні-кошик ---------- */
  let drawer;
  function buildDrawer() {
    drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.innerHTML = `<div class="drawer__scrim" data-close></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabindex="-1">
        <div class="drawer__head"><h2 id="drawer-title">Додано в кошик</h2><button class="iconbtn" data-close aria-label="Закрити">✕</button></div>
        <div class="drawer__body"></div>
        <div class="drawer__foot"></div>
      </aside>`;
    document.body.appendChild(drawer);
    drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDrawer(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(); });
  }
  let lastFocus;
  function openDrawer(justAdded) {
    if (!drawer) buildDrawer();
    const lines = FL.cart.lines(), total = FL.cart.total(), FREE = 3000;
    $('.drawer__body', drawer).innerHTML = lines.map((l) => `
      <div class="dline ${justAdded && l.p.id === justAdded.p.id && (l.size || null) === (justAdded.size || null) ? 'is-new' : ''}">
        <a class="dline__img" href="product.html?id=${l.p.id}">${FL.art(l.p)}</a>
        <div><a class="dline__name" href="product.html?id=${l.p.id}">${esc(l.p.name)}</a>
          <div class="citem__meta">${l.size ? `Розмір ${esc(l.size)} · ` : ''}${l.qty} шт.</div></div>
        <span class="price" style="font-size:16px">${FL.price(l.p.price * l.qty)}</span>
      </div>`).join('');
    const left = FREE - total;
    $('.drawer__foot', drawer).innerHTML = `
      <div class="freebar"><div class="freebar__fill" style="width:${Math.min(100, total / FREE * 100)}%"></div></div>
      <p class="hint" style="margin:0">${left > 0 ? `До безкоштовної доставки бракує ${FL.price(left)}` : 'Доставка буде безкоштовною'}</p>
      <div class="summary__row summary__total"><span>Разом</span><span>${FL.price(total)}</span></div>
      <a class="btn" href="cart.html#checkout">Оформити замовлення</a>
      <button class="btn btn--ghost" data-close>Продовжити покупки</button>`;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');
    setTimeout(() => $('.drawer__panel', drawer).focus(), 50);
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.documentElement.classList.remove('no-scroll');
    lastFocus?.focus?.();
  }

  /* ---------- політ товару в кошик ---------- */
  function flyToCart(fromEl, done) {
    const target = $('.cart-link svg');
    if (reduce || !fromEl || !target || !fromEl.animate) { done(); return; }
    const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    const ghost = fromEl.cloneNode(true);
    ghost.classList.add('fly');
    Object.assign(ghost.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 80}px) scale(.55)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0.2 },
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.25,1)' }).onfinish = () => { ghost.remove(); done(); };
  }
  function bumpCart() {
    const c = $('#cart-count');
    if (!c) return;
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }

  FL.onAdded = (p, size, fromEl) => {
    flyToCart(fromEl, () => { bumpCart(); openDrawer({ p, size }); });
  };

  /* ---------- галерея товару: зум під курсором і плавна зміна фото ---------- */
  function initGallery() {
    const g = $('#gmain');
    if (!g || reduce) return;
    g.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      g.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      g.classList.add('is-zoom');
    });
    g.addEventListener('pointerleave', () => g.classList.remove('is-zoom'));
  }

  /* ---------- липка панель покупки на телефоні ---------- */
  function initStickyBuy() {
    const add = $('#add');
    if (!add || !('IntersectionObserver' in window)) return;
    const price = $('.buy__price .price')?.textContent || '';
    const name = $('.buy h1')?.textContent || '';
    const bar = document.createElement('div');
    bar.className = 'stickybuy';
    bar.innerHTML = `<div><span class="stickybuy__name">${esc(name)}</span><span class="price" style="font-size:17px">${esc(price)}</span></div><button class="btn btn--sm" type="button">${esc(add.textContent)}</button>`;
    document.body.appendChild(bar);
    $('button', bar).addEventListener('click', () => { add.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); add.click(); });
    new IntersectionObserver(([en]) => bar.classList.toggle('is-shown', !en.isIntersecting && en.boundingClientRect.top < 0)).observe(add);
  }

  /* ---------- лічильники в адмінці ---------- */
  function countUp(root = document) {
    if (reduce) return;
    $$('.sup__stats b', root).forEach((b) => {
      const to = Number(b.textContent); if (!to) return;
      const t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 700); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // app.js рендерить сторінку на DOMContentLoaded раніше — запускаємося після нього
    setTimeout(() => {
      initChrome(); initHero(); initSky(); initSpotlight(); initCountdown(); initGallery(); initStickyBuy(); initReveal();
      if (document.body.dataset.page === 'admin') countUp();
    }, 0);
  });
})();
