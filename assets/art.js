/* Ілюстрації товарів і банера. Векторні, вбудовані в код — завжди завантажуються.
   У робочому магазині тут будуть фото з фідів постачальників. */
(function () {
  'use strict';
  const FL = window.FL;

  // Затемнення (amt < 0) або освітлення (amt > 0) кольору
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  const shadow = (rx = 86) => `<ellipse cx="120" cy="158" rx="${rx}" ry="9" fill="#000" opacity=".12"/>`;
  const STEEL = '#a7b0b5', DARK = '#2b2f33', GLOW = '#ffe58a';

  const D = {
    tent: (c) => `${shadow(96)}
      <path d="M22 156 L66 98 M218 156 L174 98" stroke="#8a8f8b" stroke-width="1.5"/>
      <path d="M48 154 L120 36 L192 154 Z" fill="${c}"/>
      <path d="M120 36 L192 154 L152 154 Z" fill="${shade(c, -0.22)}"/>
      <path d="M90 154 L120 84 L150 154 Z" fill="${shade(c, -0.5)}"/>
      <path d="M120 84 L120 154" stroke="${shade(c, -0.25)}" stroke-width="2" stroke-dasharray="4 4"/>
      <path d="M118 42 L66 146" stroke="${shade(c, 0.35)}" stroke-width="3" opacity=".55" stroke-linecap="round"/>
      <circle cx="120" cy="35" r="4" fill="${DARK}"/>
      <path d="M44 154 h10 M186 154 h10" stroke="${DARK}" stroke-width="3" stroke-linecap="round"/>`,

    sleeping: (c) => `${shadow(70)}
      <path d="M120 18 C162 18 174 48 172 82 C170 122 152 152 120 158 C88 152 70 122 68 82 C66 48 78 18 120 18 Z" fill="${c}"/>
      <ellipse cx="120" cy="50" rx="27" ry="19" fill="${shade(c, -0.5)}"/>
      <ellipse cx="120" cy="53" rx="15" ry="10" fill="${shade(c, -0.7)}"/>
      ${[78, 98, 118, 138].map((y) => `<path d="M${76 + (y - 78) / 6} ${y} Q120 ${y + 9} ${164 - (y - 78) / 6} ${y}" stroke="${shade(c, -0.22)}" stroke-width="2.5" fill="none"/>`).join('')}
      <path d="M146 62 Q156 104 146 148" stroke="${shade(c, 0.45)}" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
      <rect x="176" y="112" width="34" height="44" rx="12" fill="${shade(c, -0.3)}"/>
      <path d="M180 120 h26" stroke="${shade(c, 0.3)}" stroke-width="2"/>`,

    backpack: (c) => `${shadow(70)}
      <rect x="68" y="134" width="104" height="24" rx="12" fill="#e3b21c"/>
      <path d="M78 140 h84" stroke="#b88d10" stroke-width="2"/>
      <rect x="56" y="88" width="20" height="48" rx="7" fill="#9cc6dc"/><rect x="59" y="82" width="14" height="9" rx="3" fill="${DARK}"/>
      <rect x="72" y="36" width="96" height="114" rx="24" fill="${c}"/>
      <rect x="76" y="24" width="88" height="44" rx="20" fill="${shade(c, -0.18)}"/>
      <path d="M112 24 Q120 12 128 24" stroke="${DARK}" stroke-width="4" fill="none"/>
      <rect x="88" y="84" width="64" height="52" rx="14" fill="${shade(c, -0.22)}"/>
      <path d="M96 94 h48" stroke="${shade(c, 0.3)}" stroke-width="2"/>
      <path d="M72 76 h96 M72 118 h96" stroke="${DARK}" stroke-width="4" opacity=".7"/>
      <rect x="114" y="70" width="12" height="12" rx="2" fill="${DARK}"/><rect x="114" y="112" width="12" height="12" rx="2" fill="${DARK}"/>`,

    headlamp: (c) => `${shadow(80)}
      <ellipse cx="120" cy="96" rx="84" ry="44" fill="none" stroke="${c}" stroke-width="14"/>
      <ellipse cx="120" cy="96" rx="84" ry="44" fill="none" stroke="${shade(c, -0.3)}" stroke-width="2" stroke-dasharray="6 6"/>
      <circle cx="120" cy="94" r="44" fill="${GLOW}" opacity=".35"/>
      <rect x="86" y="68" width="68" height="54" rx="16" fill="${DARK}"/>
      <circle cx="120" cy="95" r="18" fill="#fff6cf" stroke="#c9cfd2" stroke-width="4"/>
      <circle cx="120" cy="95" r="7" fill="#ffffff"/>
      <rect x="140" y="64" width="12" height="8" rx="3" fill="${c}"/>`,

    flashlight: (c) => `${shadow(90)}
      <path d="M160 74 L236 30 L236 140 L160 112 Z" fill="${GLOW}" opacity=".4"/>
      <rect x="34" y="80" width="98" height="28" rx="9" fill="${c}"/>
      ${[50, 62, 74, 86, 98].map((x) => `<path d="M${x} 82 v24" stroke="${shade(c, 0.25)}" stroke-width="2.5"/>`).join('')}
      <circle cx="116" cy="94" r="6" fill="#c8322b"/>
      <path d="M130 76 L160 64 L160 124 L130 112 Z" fill="${shade(c, 0.18)}"/>
      <ellipse cx="160" cy="94" rx="7" ry="30" fill="#fff6cf" stroke="#c9cfd2" stroke-width="3"/>`,

    lantern: (c) => `${shadow(56)}
      <path d="M96 38 Q120 8 144 38" stroke="${DARK}" stroke-width="5" fill="none"/>
      <circle cx="120" cy="100" r="58" fill="${GLOW}" opacity=".3"/>
      <rect x="88" y="36" width="64" height="18" rx="7" fill="${c}"/>
      <rect x="94" y="54" width="52" height="78" rx="10" fill="#fff6cf" stroke="#d5d9d4" stroke-width="3"/>
      <rect x="112" y="72" width="16" height="40" rx="8" fill="#ffffff"/>
      ${[106, 120, 134].map((x) => `<path d="M${x} 54 v78" stroke="${shade(c, -0.2)}" stroke-width="2.5" opacity=".7"/>`).join('')}
      <rect x="84" y="130" width="72" height="24" rx="8" fill="${c}"/>
      <circle cx="120" cy="142" r="5" fill="${shade(c, 0.5)}"/>`,

    thermos: (c) => `${shadow(54)}
      <rect x="90" y="44" width="60" height="112" rx="18" fill="${c}"/>
      <rect x="99" y="56" width="9" height="90" rx="4.5" fill="#fff" opacity=".22"/>
      <rect x="90" y="62" width="60" height="7" fill="${shade(c, -0.25)}"/>
      <rect x="94" y="20" width="52" height="30" rx="9" fill="${shade(c, -0.45)}"/>
      <rect x="94" y="26" width="52" height="3" fill="${shade(c, -0.2)}"/>
      <path d="M116 96 h8 M112 104 h16" stroke="${shade(c, 0.4)}" stroke-width="2.5" stroke-linecap="round"/>`,

    pot: (c) => `${shadow(76)}
      <path d="M96 42 q6 -10 0 -20 M120 40 q6 -12 0 -24 M144 42 q6 -10 0 -20" stroke="#c9d2cc" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M58 92 q-18 2 -18 18 M182 92 q18 2 18 18" stroke="${DARK}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="58" y="70" width="124" height="80" rx="20" fill="${c}"/>
      <rect x="66" y="84" width="10" height="56" rx="5" fill="#fff" opacity=".3"/>
      <ellipse cx="120" cy="70" rx="64" ry="11" fill="${shade(c, 0.25)}"/>
      <rect x="110" y="54" width="20" height="10" rx="4" fill="${DARK}"/>`,

    jacket: (c) => `${shadow(78)}
      <path d="M86 34 L106 26 Q120 38 134 26 L154 34 L192 64 L178 106 L160 98 L160 156 L80 156 L80 98 L62 106 L48 64 Z" fill="${c}"/>
      <path d="M100 30 Q120 0 140 30 Q120 42 100 30 Z" fill="${shade(c, -0.18)}"/>
      <path d="M120 34 V156" stroke="${shade(c, -0.45)}" stroke-width="3"/>
      <path d="M90 112 l18 8 M150 112 l-18 8" stroke="${shade(c, -0.3)}" stroke-width="3" stroke-linecap="round"/>
      <path d="M62 106 L48 64 L58 60" stroke="${shade(c, 0.25)}" stroke-width="2" fill="none" opacity=".7"/>
      <rect x="80" y="148" width="80" height="8" fill="${shade(c, -0.25)}"/>`,

    down: (c) => `${shadow(78)}
      <path d="M86 32 L106 24 Q120 34 134 24 L154 32 L192 64 L180 106 L160 100 L160 156 L80 156 L80 100 L60 106 L48 64 Z" fill="${c}"/>
      ${[52, 72, 92, 112, 132].map((y) => `<path d="M80 ${y} H160" stroke="${shade(c, 0.22)}" stroke-width="2.5"/>`).join('')}
      <path d="M58 72 L86 66 M56 88 L82 82 M182 72 L154 66 M184 88 L158 82" stroke="${shade(c, 0.22)}" stroke-width="2.5"/>
      <path d="M120 30 V156" stroke="${shade(c, 0.45)}" stroke-width="3"/>
      <path d="M106 24 Q120 34 134 24" stroke="${shade(c, 0.35)}" stroke-width="5" fill="none"/>`,

    boot: (c) => `${shadow(84)}
      <path d="M62 52 Q90 40 118 46 L126 100 L176 112 Q198 118 198 140 L198 146 L56 146 Z" fill="${c}"/>
      <path d="M150 112 L176 112 Q198 118 198 140 L198 146 L150 146 Z" fill="${shade(c, -0.25)}"/>
      <path d="M62 52 Q90 40 118 46" stroke="${shade(c, 0.3)}" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${98 + i * 3} ${60 + i * 11} l18 2" stroke="#e3b21c" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <rect x="50" y="142" width="154" height="16" rx="7" fill="${DARK}"/>
      ${[66, 90, 114, 138, 162, 186].map((x) => `<path d="M${x} 158 v5" stroke="${DARK}" stroke-width="7"/>`).join('')}`,

    mat: (c) => `${shadow(86)}
      <rect x="62" y="62" width="120" height="80" fill="${c}"/>
      <ellipse cx="182" cy="102" rx="22" ry="40" fill="${shade(c, 0.12)}"/>
      <ellipse cx="62" cy="102" rx="22" ry="40" fill="${shade(c, -0.2)}"/>
      ${[32, 24, 16, 8].map((r) => `<ellipse cx="62" cy="102" rx="${r * 0.55}" ry="${r}" fill="none" stroke="${shade(c, 0.25)}" stroke-width="2"/>`).join('')}
      <path d="M100 62 v80 M146 62 v80" stroke="${DARK}" stroke-width="6" opacity=".75"/>`,

    dumbbell: (c) => `${shadow(90)}
      <g opacity=".55" transform="translate(16 -26)">
        <rect x="64" y="94" width="112" height="10" rx="5" fill="${STEEL}"/>
        <rect x="52" y="70" width="18" height="58" rx="5" fill="${c}"/><rect x="170" y="70" width="18" height="58" rx="5" fill="${c}"/>
      </g>
      <rect x="60" y="112" width="120" height="12" rx="6" fill="${STEEL}"/>
      <rect x="44" y="82" width="20" height="72" rx="5" fill="${c}"/><rect x="64" y="90" width="14" height="56" rx="4" fill="${shade(c, 0.15)}"/>
      <rect x="176" y="82" width="20" height="72" rx="5" fill="${c}"/><rect x="162" y="90" width="14" height="56" rx="4" fill="${shade(c, 0.15)}"/>`,

    powerbank: (c) => `${shadow(60)}
      <path d="M120 30 Q120 8 150 10 Q186 12 190 46" stroke="#e9ecee" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="78" y="30" width="84" height="126" rx="18" fill="${c}"/>
      <rect x="86" y="40" width="68" height="70" rx="8" fill="${shade(c, 0.12)}"/>
      ${[0, 1, 2].map((i) => `<path d="M86 ${52 + i * 20} H154" stroke="${shade(c, 0.28)}" stroke-width="1.5"/>`).join('')}
      ${[0, 1, 2, 3].map((i) => `<circle cx="${102 + i * 12}" cy="128" r="4" fill="${i < 3 ? '#6fd08c' : shade(c, 0.3)}"/>`).join('')}
      <rect x="110" y="26" width="20" height="6" rx="2" fill="${DARK}"/>`,

    axe: (c) => `${shadow(80)}
      <path d="M78 156 L150 40" stroke="#9b6a3c" stroke-width="13" stroke-linecap="round"/>
      <path d="M78 156 L98 124" stroke="${c}" stroke-width="15" stroke-linecap="round"/>
      <path d="M134 34 L180 22 Q202 50 182 80 L142 70 Z" fill="${STEEL}"/>
      <path d="M180 22 Q202 50 182 80" stroke="#e8edf0" stroke-width="3" fill="none"/>
      <rect x="134" y="38" width="22" height="30" rx="4" fill="${c}" transform="rotate(-14 145 53)"/>`,

    pruner: (c) => `${shadow(70)}
      <path d="M118 84 Q96 120 70 156" stroke="${c}" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M126 84 Q150 120 178 152" stroke="${shade(c, -0.25)}" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M112 86 Q100 40 136 20 Q130 56 128 86 Z" fill="${STEEL}"/>
      <path d="M130 86 Q150 52 168 40 Q156 72 136 92 Z" fill="${shade(STEEL, -0.2)}"/>
      <circle cx="123" cy="86" r="7" fill="${DARK}"/>
      <path d="M104 112 q20 10 40 0" stroke="#e3b21c" stroke-width="3" fill="none"/>`,
  };

  /* view: 0 — товар цілком, 1 — дзеркально з іншого боку, 2 — ближче до деталей */
  FL.art = (p, view = 0) => {
    const kind = p.art || 'tent';
    const draw = D[kind] || D.tent;
    const tf = view === 1 ? 'translate(240 0) scale(-1 1)' : view === 2 ? 'translate(-60 -36) scale(1.5)' : '';
    return `<svg viewBox="0 0 240 180" role="img" aria-label="${p.name.replace(/"/g, '')}" preserveAspectRatio="xMidYMid meet"><g transform="${tf}">${draw(p.color || '#4f7a3a')}</g></svg>`;
  };

  FL.catArt = (cat) => {
    const sample = FL.products.find((p) => p.cat === cat.id) || { art: cat.art, color: '#4f7a3a', name: cat.name };
    return FL.art(sample);
  };

  /* Банер головної: ніч у Карпатах. Небо, сяйво й частинки малюються окремими шарами,
     гори — SVG з прозорим небом. Шари рухаються з різною глибиною (паралакс). */
  FL.heroArt = () => {
    const trees = (n, y0, step, hMin, hVar, fill, seed) => Array.from({ length: n }, (_, i) => {
      const x = -60 + i * step + ((i * seed) % 13), h = hMin + ((i * 37 + seed) % hVar), y = y0 - ((i * 13 + seed) % 18);
      return `<path d="M${x} ${y} l${h * 0.32} -${h} l${h * 0.32} ${h} Z" fill="${fill}"/>`;
    }).join('');
    return `
    <div class="hero__sky"></div>
    <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
    <canvas class="hero__stars" aria-hidden="true"></canvas>
    <svg class="hero__svg" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="moonglow"><stop offset="0" stop-color="#f3ead2" stop-opacity=".35"/><stop offset="1" stop-color="#f3ead2" stop-opacity="0"/></radialGradient>
        <radialGradient id="fireglow"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".75"/><stop offset=".45" stop-color="#ff6a1f" stop-opacity=".22"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3d35"/><stop offset="1" stop-color="#16241e"/></linearGradient>
        <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2b23"/><stop offset="1" stop-color="#101b16"/></linearGradient>
        <linearGradient id="tentg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb066"/><stop offset="1" stop-color="#d9541a"/></linearGradient>
      </defs>
      <g class="hl" style="--d:.12"><circle cx="880" cy="80" r="110" fill="url(#moonglow)"/><circle cx="880" cy="80" r="24" fill="#f3ead2"/><circle cx="890" cy="74" r="22" fill="#0d1713" opacity=".22"/></g>
      <g class="hl" style="--d:.35"><g class="h-rise" style="--delay:.1s">
        <path d="M-80 300 L120 200 L210 255 L330 160 L460 245 L560 185 L690 265 L820 175 L960 245 L1080 195 L1280 235 V500 H-80 Z" fill="url(#far)"/>
        <path d="M330 160 L360 182 L345 180 L330 194 L316 178 L300 184 Z M820 175 L846 195 L832 192 L820 204 L806 190 L794 196 Z M1080 195 L1100 210 L1088 208 L1080 216 L1070 207 L1062 211 Z" fill="#c9d6cc" opacity=".35"/></g></g>
      <g class="hl" style="--d:.6"><g class="h-rise" style="--delay:.25s"><path d="M-80 345 L150 255 L260 305 L400 225 L540 315 L680 245 L800 315 L930 255 L1060 325 L1280 275 V500 H-80 Z" fill="url(#mid)"/>${trees(32, 362, 44, 26, 22, '#132119', 7)}</g></g>
      <g class="hl" style="--d:1"><g class="h-rise" style="--delay:.4s">
        <circle cx="790" cy="430" r="190" fill="url(#fireglow)" class="h-glow"/>
        <path d="M-80 398 Q300 340 600 388 T1280 366 V500 H-80 Z" fill="#0c1511"/>${trees(30, 404, 46, 42, 32, '#08100c', 3)}
        <g><path d="M640 446 L682 384 L724 446 Z" fill="url(#tentg)"/><path d="M682 384 L724 446 L704 446 Z" fill="#a8400f" opacity=".7"/><path d="M672 446 L682 416 L692 446 Z" fill="#ffe2a8" class="h-door"/></g>
        <g id="fire" transform="translate(790 444)">
          <path d="M-22 4 L22 -4 M-22 -4 L22 4" stroke="#5a3a22" stroke-width="7" stroke-linecap="round"/>
          <path class="flame f1" d="M0 -2 C-14 -12 -10 -30 0 -46 C10 -30 14 -12 0 -2 Z" fill="#ff7a1f"/>
          <path class="flame f2" d="M0 -2 C-9 -10 -6 -22 0 -32 C6 -22 9 -10 0 -2 Z" fill="#ffc04a"/>
          <path class="flame f3" d="M0 -2 C-4 -7 -3 -13 0 -18 C3 -13 4 -7 0 -2 Z" fill="#fff1b8"/>
        </g></g></g>
      <g class="hl" style="--d:1.3"><path d="M-80 474 Q260 424 520 450 T1280 436 V520 H-80 Z" fill="#070d0a"/></g>
    </svg>
    <canvas class="hero__sparks" aria-hidden="true"></canvas>`;
  };
})();
