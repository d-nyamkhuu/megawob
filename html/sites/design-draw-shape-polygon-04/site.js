(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-polygon-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'geo-app';
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#eef1f8',
        panel: '#fff',
        fg: '#172033',
        muted: '#647086',
        line: '#d8dfeb',
        accent: '#1474ee',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', 'Arial, "Segoe UI", sans-serif');
      const shell = u.el('div', 'window-shell', body),
        titlebar = u.el('header', 'window-titlebar', shell);
      titlebar.innerHTML =
        '<span class="brand-pin">●</span><span class="brand">GeoPlanner</span><div class="window-controls"><button type="button">−</button><button type="button">□</button><button type="button">×</button></div>';
      titlebar
        .querySelectorAll('button')
        .forEach((b) => (b.onclick = () => env.log('window-control', { label: b.textContent })));
      const nav = u.el('nav', 'app-tabs', shell);
      for (const [i, t] of ['Map', 'Layers', 'Places', 'Measurements', 'Draw', 'Imagery', 'Settings'].entries()) {
        const b = u.el('button', 'app-tab' + (i === 0 ? ' active' : ''), nav, t);
        b.type = 'button';
        b.onclick = () => {
          nav.querySelectorAll('.app-tab').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
        };
      }
      let display = ctx.display;
      const content = u.el('div', 'workspace', shell),
        aside = u.el('aside', 'inspector', content),
        main = u.el('main', 'map-pane', content);
      main.dataset.role = 'stage';
      const card = (title, icon) => {
        const c = u.el('section', 'inspector-card', aside);
        const h = u.el('h2', 'card-heading', c);
        h.innerHTML = '<span>' + icon + '</span>' + title;
        return c;
      };
      const project = card('Project Area', '◇');
      const summary = [
        ['▦', 'All Features', '24'],
        ['📍', 'Pins', '4'],
        ['⬟', 'Areas', '0'],
        ['⌁', 'Lines', '3'],
        ['☆', 'Points of Interest', '12'],
      ];
      summary.forEach(([ic, label, count]) => {
        const row = u.el('div', 'summary-row', project);
        u.el('span', 'summary-icon', row, ic);
        u.el('span', 'summary-label', row, label);
        u.el('span', 'summary-count', row, count);
      });
      const layers = card('Layers', '◇');
      [
        ['Streets', '14', '#d9dde0', true],
        ['Buildings', '6', '#dfe3e6', true],
        ['Parks', '3', '#b9dda7', true],
        ['Water', '1', '#addcf5', true],
        ['Terrain', '0', '#d8d2c7', false],
      ].forEach(([name, count, color, on]) => {
        const row = u.el('div', 'layer-row', layers);
        const c = u.el('input', '', row);
        c.type = 'checkbox';
        c.checked = on;
        c.tabIndex = -1;
        const sw = u.el('span', 'layer-swatch', row);
        sw.style.background = color;
        u.el('span', 'layer-label', row, name);
        u.el('span', 'layer-count', row, count);
        u.el('span', 'layer-menu', row, '•••');
      });
      const note = u.el('div', 'task-note', main);
      note.dataset.role = 'instruction';
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      else if (display === 'panel') {
        note.classList.add('panel-note');
        aside.prepend(note);
      } else if (display === 'toast') {
        note.classList.add('toast-note');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.onclick = () => note.remove();
      } else note.classList.add('header-note');
      const footer = u.el('footer', 'app-footer', shell),
        status = u.el('span', 'footer-status', footer, 'Map data · Riverton district');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content?.END_LABELS || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ],
          labelOf = (x) => (typeof x === 'string' ? x : x?.label || x?.text || String(x));
        let label = 'Continue',
          place = 'footer';
        if (!er.bool(0.5)) {
          label = labelOf(er.pick(labels));
          place = er.pick(['footer', 'toolbar', 'link']);
        }
        const make = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (place === 'toolbar') {
          submit = make(nav, 'button', 'end-control', label);
        } else if (place === 'link') {
          submit = make(footer, 'a', 'end-link', label + ' ›');
        } else submit = make(footer, 'button', 'end-control', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const other = cr.pick(pool),
              d = u.el('button', 'xtra-control', footer, other);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: other, collide: true });
          }
        }
      }
      return { stage: main, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        k = ctx.kind,
        el = u.el('section', 'obstruction obstruction-' + k, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Privacy preferences',
          toast: 'Map updated',
          chat: 'GeoPlanner support',
          promo: 'Explore GeoPlanner Plus',
          banner: 'Map service notice',
        }[k] || 'GeoPlanner';
      u.el('strong', '', box, title);
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional cookies help improve GeoPlanner.',
          toast: 'Your map workspace is ready.',
          chat: 'How can we help with your map?',
          promo: 'Discover more ways to explore your area.',
          banner: 'Map data refreshed today.',
        }[k] || '',
      );
      const close = u.el('button', 'dismiss', box, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close');
      close.onclick = () => ctx.dismiss('close');
      return { el, dismiss: close, ttlSteps: k === 'toast' ? 5 : 0 };
    },
  });
})();
