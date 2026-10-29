// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries({ bg: '#f6f9fc', panel: '#ffffff', fg: '#172a50', muted: '#5b6b8c', line: '#dce4ef' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#0068f5');
      root.dataset.theme = 'soft-map';
      document.body.classList.remove('map-has-header-note', 'map-long-note', 'map-has-banner', 'map-has-top-end');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      const legacyPlacement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const legacyWantFooter = tall && (legacyPlacement === 'footer' || legacyPlacement === 'link' || rng.bool(0.3));
      let placement = ctx.finish ? null : rng.fork('chrome/end-placement').pick(['header', 'header', 'header', 'header', 'header', 'header', 'footer', 'link', 'icon']);
      const wantFooter = !ctx.finish && tall && (placement === 'footer' || placement === 'link' || legacyWantFooter);
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = false;
      const navDraw = W >= 1180 && rng.bool(0.5); // preserve the cloned shell's seeded draw
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      else if (Array.isArray(content.END_LABELS) && content.END_LABELS.includes('Done') && rng.fork('chrome/preferred-label').bool(0.52)) label = 'Done';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide: sampledCollide, cr } = S.frameCollide(_c, label);
      const collide = ctx.finish ? null : sampledCollide;
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      rng.pick(TITLES);
      local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const n = util.el('nav', 'ref-nav', header);
      const icons = {
        Map: '<path d="M12 22s7-7.1 7-13a7 7 0 0 0-14 0c0 5.9 7 13 7 13Z" fill="currentColor"/><circle cx="12" cy="9" r="2.2" fill="#fff"/>',
        Places: '<path d="M8 5h12M8 12h12M8 19h12"/><circle cx="3.5" cy="5" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="19" r="1" fill="currentColor"/>',
        Routes: '<circle cx="5" cy="19" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><path d="m6.5 17.5 4-4m3-3 4-4"/>',
        Layers: '<path d="m12 2 10 7-10 7L2 9l10-7Zm-9 12 9 6 9-6M3 18l9 5 9-5"/>',
        Saved: '<path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1L12 2Z"/>',
        Settings: '<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.7 2.5 2 .8 2.3-1.2 2.8 2.8-1.2 2.3.8 2L24 12l-2.6.8-.8 2 1.2 2.3-2.8 2.8-2.3-1.2-2 .8L14 22h-4l-.7-2.5-2-.8L5 19.9l-2.8-2.8 1.2-2.3-.8-2L0 12l2.6-.8.8-2-1.2-2.3L5 4.1l2.3 1.2 2-.8L10 2Z"/>'
      };
      for (const item of Object.keys(icons)) {
        const a = util.el('a', 'ref-navlink', n);
        a.href = '#'; a.dataset.role = 'nav';
        a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[item]}</svg><span>${item}</span>`;
        if (item === 'Map') a.classList.add('is-active');
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      Object.assign(_c, { brand: null, header });
    },
    'frame.instruction': (base) => function (_c) {},
    'frame.tools': (base, S) => function (_c) {
      const { brand, collide, ctx, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      document.body.classList.toggle('map-has-top-end', headerTools.children.length > 0);
      if (display === 'header') {
        const note = util.el('div', 'map-header-note', document.body);
        util.el('span', 'map-info-icon', note, 'ⓘ');
        util.el('span', '', note, ctx.instruction);
        note.dataset.role = 'instruction';
        document.body.classList.add('map-has-header-note');
        document.body.classList.toggle('map-long-note', ctx.instruction.length > 115);
        note.style.paddingRight = `${Math.max(245, headerTools.offsetWidth + 28)}px`;
        document.body.style.setProperty('--map-header-h', `${Math.max(53, note.getBoundingClientRect().height)}px`);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    overlay: (base) => function (ctx) {
      const out = base(ctx);
      const { el, dismiss } = out;
      if (ctx.kind === 'chat') {
        const title = ctx.util.el('div', 'map-chat-title', el, '◉  Need help?');
        el.insertBefore(title, el.firstChild);
        const text = el.querySelector('.ref-ov-text');
        if (text) text.textContent = "Ask a question and we'll get you an answer.";
        const entry = ctx.util.el('div', 'map-chat-entry', el);
        const input = ctx.util.el('input', 'map-chat-input', entry);
        input.type = 'text'; input.placeholder = 'Type a message...';
        const send = ctx.util.el('button', 'map-chat-send', entry, '➤');
        send.type = 'button'; send.setAttribute('aria-label', 'Send');
        send.addEventListener('click', () => env.log('overlay-click', { label: 'Send' }));
      } else if (ctx.kind === 'promo') {
        const box = el.querySelector('.ref-ov-box') || el;
        const title = ctx.util.el('div', 'map-promo-title', box, 'Get more from Maps');
        box.insertBefore(title, box.firstChild);
        const text = box.querySelector('.ref-ov-text');
        if (text) text.textContent = 'Subscribe to our newsletter for tips, new features and great places near you.';
        const input = ctx.util.el('input', 'map-promo-input', box);
        input.type = 'email'; input.placeholder = 'Your email address';
        const row = box.querySelector('.ref-ov-row');
        const primary = row?.querySelector('.ref-ov-primary');
        if (primary) primary.textContent = 'Subscribe';
        if (row) box.appendChild(row);
        const x = ctx.util.el('button', 'map-promo-close', box, '×');
        x.type = 'button'; x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
      } else if (ctx.kind === 'cookie') {
        const text = el.querySelector('.ref-ov-text');
        if (text) text.textContent = 'We use cookies to improve your experience, personalize content and analyze traffic. You can manage your preferences at any time.';
        const x = ctx.util.el('button', 'map-cookie-close', el, '×');
        x.type = 'button'; x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
      } else if (ctx.kind === 'banner') {
        document.body.classList.add('map-has-banner');
        if (dismiss) dismiss.addEventListener('click', () => document.body.classList.remove('map-has-banner'));
      }
      return out;
    },
  };

  env.site({
    name: 'design-pan-map-marker-05',
    template: 'site/base',
    design: { parts },
  });
})();
