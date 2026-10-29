(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-04',
    'menu': 'Desk|File|Edit|Window|Options',
    'title': 'Staff Information Lookup',
  };
  const ICONS = [
    '<svg viewBox="0 0 40 48"><path d="M4 2h23l10 11v33H4z" fill="#fff" stroke="#000" stroke-width="3"/><path d="M27 2v12h10M10 20h20M10 26h20M10 32h20M10 38h20" fill="none" stroke="#000" stroke-width="2.5"/></svg>',
    '<svg viewBox="0 0 40 40"><circle cx="16" cy="16" r="13" fill="#fff" stroke="#000" stroke-width="3"/><path d="M25 25l13 13" stroke="#000" stroke-width="4"/></svg>',
    '<svg viewBox="0 0 40 40"><rect x="3" y="5" width="34" height="30" fill="#fff" stroke="#000" stroke-width="3"/><path d="M3 11h34M3 19h34M3 27h34M14 11v24M26 11v24" stroke="#000" stroke-width="1.8"/></svg>',
    '<svg viewBox="0 0 40 40"><path d="M11 16V2h15l6 6v8z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M25 2v7h7M16 6v7" fill="none" stroke="#000" stroke-width="2"/><path d="M6 15h29l3 5v13H2V20z" fill="#fff" stroke="#000" stroke-width="3"/><rect x="8" y="26" width="24" height="12" fill="#fff" stroke="#000" stroke-width="3"/><path d="M11 21h4M29 21h3M12 31h16" stroke="#000" stroke-width="2"/></svg>',
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bar = u.el('header', 'ga-menu', document.body);
      const logo = u.el('span', 'ga-logo', bar);
      logo.innerHTML =
        '<svg viewBox="0 0 36 36"><path d="M17 2v29M12 2v15q0 12-10 12M22 2v15q0 12 10 12" fill="none" stroke="#000" stroke-width="4"/><path d="M0 35h36" stroke="#000" stroke-width="2"/></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ga-mi', bar, t));
      u.el('span', 'ga-sp', bar);
      u.el('span', 'ga-clock', bar, 'Mon 27 Jan 2025');
      u.el('span', 'ga-clock ga-time', bar, '10:14');
      const desk = u.el('div', 'ga-desk', document.body);
      const hidden = ctx.display === 'hidden';
      if (!hidden) {
        const note = u.el('aside', 'ga-note ga-note--' + ctx.display, desk);
        if (ctx.display === 'panel' || ctx.display === 'toast')
          u.el('div', 'ga-note-title', note, ctx.display === 'panel' ? 'Task note' : 'Desk message');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const trash = u.el('div', 'ga-trash', desk);
      trash.innerHTML =
        '<svg viewBox="0 0 48 64"><path d="M8 15v40q16 10 32 0V15" fill="#fff" stroke="#000" stroke-width="3"/><ellipse cx="24" cy="13" rx="22" ry="6" fill="#fff" stroke="#000" stroke-width="3"/><path d="M14 13V6l10-4 10 4v7M18 7h12M15 23v30M23 23v34M32 23v30" fill="none" stroke="#000" stroke-width="3"/><path d="M5 8v10M43 8v10" stroke="#000" stroke-width="3"/></svg>';
      u.el('span', '', trash, 'TRASH');
      const win = u.el('section', 'ga-win', desk);
      const tb = u.el('div', 'ga-title', win);
      u.el('i', 'ga-gadget', tb).innerHTML = '<b></b>';
      u.el('span', 'ga-ttext', tb, C.title);
      u.el('i', 'ga-gadget ga-g2', tb).innerHTML =
        '<svg viewBox="0 0 32 32"><rect x="5" y="4" width="22" height="24" fill="white" stroke="black" stroke-width="2"/><path d="M8 9h16M8 14h16M8 19h16M8 24h16M16 9v15" stroke="black" stroke-width="2"/></svg>';
      u.el('i', 'ga-gadget ga-g3', tb).innerHTML =
        '<svg viewBox="0 0 32 32"><rect x="5" y="8" width="22" height="19" fill="black"/><path d="M11 20v-6h9v8h-9z" fill="white"/><path d="M15 17h5v5h-5z" fill="black"/></svg>';
      const wb = u.el('div', 'ga-wbody', win);
      const stage = u.el('main', 'ds-stage ga-stage', wb);
      const tools = u.el('div', 'ga-tools', wb);
      ICONS.forEach((s) => {
        u.el('div', 'ga-tool', tools).innerHTML = s;
      });
      const hatch = u.el('div', 'ga-hatch', win);
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const standard = endR.bool(0.5);
      const placement = standard ? 'form' : endR.pick(['header', 'link']);
      const label = standard ? labels.find((x) => x === 'Submit') || labels[0] : endR.pick(labels);
      const menuTools = u.el('div', 'ga-menu-tools', bar);
      bar.insertBefore(menuTools, bar.querySelector('.ga-clock'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'form' ? stage.parentNode : placement === 'header' ? menuTools : hatch;
        submit = u.el(
          'button',
          'ds-submit ' +
            (placement === 'form' ? 'ga-submit' : placement === 'header' ? 'ga-menu-button' : 'ga-endlink'),
          parent,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'link') hatch.classList.add('ga-hatch--end');
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = collideR.pick(options);
          const decoy = u.el('button', 'ga-menu-button', menuTools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
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
