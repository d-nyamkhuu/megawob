(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-03',
    'brand': 'Word Match',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': ' |?|⚙',
    'menu': 'File|Edit|Format|Tools|Window|Help',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const current = endRng.bool(0.5);
      const placement = current ? 'footer' : endRng.pick(['header', 'link']);
      const label = current
        ? 'Submit'
        : labelOf(endRng.pick(labels.filter((x) => labelOf(x).toLowerCase() !== 'submit')) || labels[0]);
      const collideRng = ctx.rng.fork('chrome/collide');
      const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = alternatives.length && collideRng.bool(0.3) ? labelOf(collideRng.pick(alternatives)) : null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoyButton = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish && placement === 'header') submit = endButton(top, 'ds-top-submit', label);
      if (collide) decoyButton(top, collide);
      const controls = u.el('span', 'ds-window-controls', top);
      ['Minimize', 'Maximize', 'Close'].forEach((t) => {
        const icon = u.el('i', '', controls);
        icon.title = t;
      });
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        const icons = [
          `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h18l7 8v23H6z" fill="#fff" stroke="#6495be" stroke-width="2"/><path d="M24 2v8h7M10 12h12M10 17h16M10 21h16M10 25h16M10 29h16" fill="none" stroke="#70a1cb" stroke-width="2"/><path d="M9 4h12" stroke="#d7e9fa" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="helpGlass" x2="0" y2="1"><stop stop-color="#b5dcf5"/><stop offset=".45" stop-color="#478bc3"/><stop offset=".55" stop-color="#2863a4"/><stop offset="1" stop-color="#88b9dc"/></linearGradient></defs><circle cx="18" cy="18" r="16" fill="url(#helpGlass)" stroke="#8aa6c1"/><text x="18" y="28" text-anchor="middle" fill="white" font-family="Arial" font-size="29" font-weight="bold">?</text></svg>`,
          `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gearGlass" x2="0" y2="1"><stop stop-color="#e6eaef"/><stop offset="1" stop-color="#717d89"/></linearGradient></defs><path d="M14 2h7l1 5 4 2 4-2 4 6-4 4v4l4 3-4 6-5-2-4 2-1 4h-7l-1-5-4-2-4 2-3-6 4-3v-5l-3-3 4-6 5 2 3-2z" fill="url(#gearGlass)" stroke="#64707b" stroke-width="1.5"/><circle cx="18" cy="18" r="6" fill="#fafcfd" stroke="#6b7781" stroke-width="2"/></svg>`,
        ];
        C.rail.split('|').forEach((t, i) => {
          const icon = u.el('div', '', rail);
          icon.innerHTML = icons[i];
        });
      }
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      mode = mode === 'hidden' ? 'hidden' : mode === 'toast' ? 'toast' : mode === 'panel' ? 'panel' : 'left';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'panel') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'panel') b.classList.add('ds-panel-note');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish && placement === 'footer') {
        submit = endButton(foot, 'ds-submit', label);
      } else if (!ctx.finish && placement === 'link') {
        const link = u.el('a', 'ds-end-link', content, label + ' ›');
        link.href = '#';
        link.dataset.role = 'submit';
        link.setAttribute('aria-label', label);
        link.title = label;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
      }
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
