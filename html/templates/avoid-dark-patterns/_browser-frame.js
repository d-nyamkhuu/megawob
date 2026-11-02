/* avoid-dark-patterns/_browser-frame: installs replaceable frame parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    const { CSS } = env.templateLib('avoid-dark-patterns/_browser-assets');
    BASE.hits = (el, x, y) => {
      const e = document.elementFromPoint(x, y);
      return !!e && (e === el || el.contains(e));
    };

    BASE.pointOf = (el) => {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return null;
      for (const fy of [0.5, 0.3, 0.7]) {
        for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) {
          const p = [r.left + r.width * fx, r.top + r.height * fy];
          if (S.P.hits(el, p[0], p[1])) return p;
        }
      }
      return [r.left + r.width / 2, r.top + r.height / 2];
    };

    BASE.style = (ctx) => {
      const css = CSS
        .replace('13.5px/1.38 system-ui, -apple-system, \'Segoe UI\', sans-serif', () => S.D.font)
        .replace('border-radius: 10px; box-shadow:', () => `border-radius: ${S.D.windowRadius}; box-shadow:`)
        .replace('0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.13)', () => S.D.windowShadow)
        .replace('rgba(12, 16, 24, .5)', () => S.D.dimColor);
      ctx.css('safe-dark-classic', css);
    };

    BASE.fit = (ctx) => {
      const { width: W, height: H } = ctx.size;
      const g = S.D.geometry;
      const M = g.margin;
      const fullW = Math.max(g.minWidth, W - 2 * M);
      const fullH = Math.max(g.minHeight, H - 2 * M);
      const winW = Math.round(fullW < g.widthBreakpoint ? fullW : Math.max(g.widthMin, Math.min(g.widthMax, fullW * S.rng.float(...g.widthScale))));
      const winH = Math.round(fullH < g.heightBreakpoint ? fullH : Math.max(g.heightMin, Math.min(g.heightMax, fullH * S.rng.float(...g.heightScale))));
      const ax = S.rng.pick(S.D.alignments);
      return { M, fullW, fullH, winW, winH, ax };
    };

    BASE.frame = (ctx) => {
      const { M, fullW, fullH, winW, winH, ax } = S.geo;
      const win = S.el('div', `sd-win sd-${S.app.kind}`, ctx.stage);
      win.style.width = `${winW}px`;
      win.style.height = `${winH}px`;
      win.style.left = `${M + (ax === 'left' ? 0 : ax === 'right' ? fullW - winW : Math.round((fullW - winW) / 2))}px`;
      win.style.top = `${M + Math.round((fullH - winH) / 2)}px`;
      win.style.setProperty('--hue', String(S.app.hue));
      for (const [key, value] of Object.entries(S.D.colors)) win.style.setProperty(key, value);
      return win;
    };

    BASE.appearance = (ctx) => {
      const narrow = S.geo.winW < S.D.geometry.sideBreakpoint;
      S.sideW = narrow ? S.D.geometry.sideNarrow : S.rng.int(...S.D.geometry.sideRange);
      S.look = {
        radius: S.rng.pick(S.D.radii),
        swRight: S.rng.bool(0.4),
        logoRound: S.rng.bool(0.4),
        sideLeft: S.rng.bool(0.15),
        cardMain: S.rng.bool(0.5),
        adMark: S.rng.pick(S.D.adMarks),
        search: S.rng.bool(0.6),
        links: S.rng.pick(S.D.headLinks[S.app.kind] || S.D.headLinks.shop),
        byline: `${S.rng.pick(S.D.bylines)} · ${S.rng.int(2, 9)} min read`,
      };
      S.win.style.setProperty('--r', `${S.look.radius}px`);
    };

    BASE.tabs = (ctx) => {
      const tabs = S.el('div', 'sd-tabs', S.win);
      const dots = S.el('div', 'sd-dots', tabs);
      S.el('i', '', dots); S.el('i', '', dots); S.el('i', '', dots);
      const tab = S.el('div', 'sd-tab', tabs);
      S.el('span', 'sd-fav', tab, S.app.name[0]);
      S.tabTitle = S.el('span', '', tab, S.app.name);
      if (S.rng.bool(0.55)) {
        const t2 = S.el('div', 'sd-tab off', tabs);
        S.el('span', 'sd-fav', t2, '·').style.background = '#7a7f8a';
        S.el('span', '', t2, S.rng.pick(S.D.extraTabs));
      }
    };

    BASE.addressBar = (ctx) => {
      S.bar = S.el('div', 'sd-bar', S.win);
      S.el('span', 'sd-nav', S.bar, '‹'); S.el('span', 'sd-nav', S.bar, '›'); S.el('span', 'sd-nav', S.bar, '↻');
      const omni = S.el('div', 'sd-omni', S.bar);
      omni.innerHTML = S.D.icons.lock;
      S.hostEl = S.el('span', 'host', omni);
      S.pathEl = S.el('span', 'path', omni);
      S.el('span', 'sd-ext', S.bar);
    };

    BASE.page = (ctx) => {
      return S.el('div', 'sd-page', S.win);
    };
  }

  env.template('avoid-dark-patterns/_browser-frame', () => ({ install }), { uses: ['avoid-dark-patterns/_browser-assets'] });
})();
