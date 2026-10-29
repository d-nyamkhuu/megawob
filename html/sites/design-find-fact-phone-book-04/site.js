(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-04',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Task',
  };
  C.rail = '';
  C.instruction = 'left';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'title']);
      const label = referenceEnd ? 'Submit' : er.pick(labels.filter((t) => t !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(labels.filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase()))
        : null;
      function decoyBtn(parent, text, collides) {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', 'mn', wb);
      u.el('i', 'mx', wb);
      u.el('i', 'cl', wb);
      let nav = null;
      if (C.menu) {
        nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'right'
              : natural;
      function briefing(parent, cls) {
        const b = u.el(ctx.display === 'header' ? 'header' : 'aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main ds-mode-' + mode, content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      if (mode === 'left' || mode === 'right') u.el('div', 'ds-sep', main);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const ico =
        '<svg viewBox="0 0 40 40" stroke="#384356" stroke-width="2"><path d="M11 18C2 1 29-2 26 16l-5 8H13z" fill="#536378"/><ellipse cx="18" cy="14" rx="8" ry="11" fill="#7c8c9f"/><path d="M4 35c0-8 6-12 14-12s13 4 13 12z" fill="#6b9dc6"/></svg>';
      ['New Contact', 'Edit Contact', 'Delete Contact'].forEach((t, i) => {
        const fb = u.el('button', 'ds-fbtn', foot);
        fb.type = 'button';
        fb.tabIndex = -1;
        fb.innerHTML =
          [
            ico
              .replace('</svg>', '<path d="M30 21v18M21 30h18" stroke="#427d2d" stroke-width="5"/></svg>')
              .replace(/#5a4636/, '#3d6fa8'),
            '<svg viewBox="0 0 40 40" stroke="#3c424e" stroke-width="2" stroke-linejoin="round"><path d="M5 36l4-12L29 3l7 7-21 21z" fill="#f4c84d"/><path d="M26 6l3-3 7 7-4 4z" fill="#e47b52"/><path d="M5 36l4-12 6 7z" fill="#f3dfb2"/><path d="M5 36l2-5 3 3z" fill="#454d57"/><path d="M13 25L30 8" stroke="#fff3c5"/></svg>',
            '<svg viewBox="0 0 40 40" fill="#d9d4cc" stroke="#5a4636" stroke-width="2.4"><path d="M10 12h20l-2 24H12z" fill="#b4a58e"/><path d="M16 16v16M21 16v16M25 16v16M8 8h24v4H8zM16 8V5h8v3"/></svg>',
          ][i] +
          '<span style="display:inline">' +
          t +
          '</span>';
        fb.dataset.role = 'xtra';
        fb.addEventListener('click', () => env.log('decoy', { label: t }));
        if (i === 2 && !ctx.finish) u.el('div', 'ds-fgap', foot);
      });
      u.el('div', 'ds-fsp', foot);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? foot : placement === 'toolbar' ? nav || top : top;
        submit = u.el('button', 'ds-submit ds-end-' + placement, parent, placement === 'title' ? '✓' : label);
        if (placement === 'title') top.insertBefore(submit, wb);
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) decoyBtn(nav || top, collide, true);
      const cb = u.el('button', 'ds-fbtn', foot);
      cb.type = 'button';
      cb.tabIndex = -1;
      cb.innerHTML =
        '<svg viewBox="0 0 40 40" fill="#d94e35" stroke="#493d3c" stroke-width="2"><path d="M7 12l6-6 8 8 8-8 6 6-8 8 8 8-6 6-8-8-8 8-6-6 8-8z"/></svg><span style="display:inline">Cancel</span>';
      cb.dataset.role = 'xtra';
      cb.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
