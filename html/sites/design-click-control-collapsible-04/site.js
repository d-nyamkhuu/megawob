(function () {
  'use strict';
  const cfg = {
    title: 'Project Guide',
    tabs: ['Home', 'Tasks', 'Files', 'Help'],
    tools: ['Sections', 'Bookmarks', 'History', 'Settings'],
  };
  const END_FALLBACK = [
    'Submit',
    'Done',
    'Finish',
    'Continue',
    'Save',
    'OK',
    'Confirm',
    'Apply',
    'Complete',
    "I'm done",
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const ICO = {
    app: '<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="4" fill="#6146ad"/><rect x="6" y="5" width="12" height="15" rx="1" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M10 6v13M12 9h4M12 12h4M12 15h4M7 9h1M7 12h1M7 15h1" stroke="#fff" stroke-width="1.4"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg>',
    max: '<svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>',
    close: '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h12M3 18h18"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>',
    info: '<svg viewBox="0 0 48 48"><defs><linearGradient id="info-green"><stop stop-color="#4a895f"/><stop offset="1" stop-color="#529c6b"/></linearGradient></defs><circle cx="24" cy="24" r="24" fill="url(#info-green)"/><circle cx="24" cy="14" r="3.3" fill="#fff"/><path d="M24 23v10" stroke="#fff" stroke-width="6.2" stroke-linecap="round"/></svg>',
    folder:
      '<svg viewBox="0 0 24 24"><path d="M2.5 6.5a1.5 1.5 0 0 1 1.5-1.5h5l2 2.5h9a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5z"/></svg>',
    list: '<svg viewBox="0 0 24 24"><circle cx="4.5" cy="6" r="1.4"/><circle cx="4.5" cy="12" r="1.4"/><circle cx="4.5" cy="18" r="1.4"/><path d="M9 6h12M9 12h12M9 18h12"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
    history: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="m10 2-.6 2.8-2 .9-2.4-1.4-2 3.4 2.1 1.9-.2 2.4-2.5 1.4 1.4 3.7 2.8-.4 1.7 1.6.1 2.9 3.9.7 1.1-2.6 2.3-.5 2.3 1.6 2.5-3-1.8-2.2.6-2.2 2.6-1-.7-3.9-2.9-.2-1.5-1.7.4-2.8-3.7-1.4-1.4 2.5-2.4.1Z"/></svg>',
    chev: '<svg viewBox="0 0 16 16"><path d="m3.5 6 4.5 4.5L12.5 6"/></svg>',
  };
  env.site({
    name: 'design-click-control-collapsible-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref pastel';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'titlebar', head);
      u.el('span', 'app-ico', tb).innerHTML = ICO.app;
      u.el('span', 'title', tb, cfg.title);
      const wc = u.el('span', 'window-controls', tb);
      wc.innerHTML = '<i>' + ICO.min + '</i><i>' + ICO.max + '</i><i>' + ICO.close + '</i>';
      const nav = u.el('div', 'navrow', head);
      u.el('span', 'hamb', nav).innerHTML = ICO.menu;
      const tabs = u.el('div', 'tools', nav);
      cfg.tabs.forEach((t, i) => u.el('span', i === 0 ? 'active' : '', tabs, t));
      const sr = u.el('div', 'search', nav);
      u.el('span', 's-ico', sr).innerHTML = ICO.search;
      u.el('span', 's-txt', sr, 'Search this project...');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center display-' + ctx.display, work);
      const banner = u.el('div', 'banner mode-' + ctx.display, center);
      u.el('span', 'b-ico', banner).innerHTML = ICO.info;
      const bt = u.el('div', 'b-txt', banner);
      const note = u.el('div', 'instruction', bt, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      u.el('p', 'b-sub', bt, 'Each section contains helpful information related to this project.');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'tool', 'link', 'tool']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (pool.length) collide = labelOf(collideRng.pick(pool));
      }
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoyButton = (parent, text) => {
        const b = u.el('button', 'dock-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const proj = u.el('div', 'proj', foot);
      u.el('span', 'p-ico', proj).innerHTML = ICO.folder;
      const pl = u.el('span', 'p-lbl', proj);
      pl.innerHTML = 'Project: <b>Atlas</b>';
      u.el('span', 'p-chev', proj).innerHTML = ICO.chev;
      u.el('span', 'sep', foot);
      const tl = u.el('div', 'dock-tools', foot);
      const ik = ['list', 'bookmark', 'history', 'gear'];
      cfg.tools.forEach((t, i) => {
        const b = u.el('span', 'dtool' + (i === 0 ? ' on' : ''), tl);
        u.el('span', 'd-ico', b).innerHTML = ICO[ik[i]];
        u.el('span', '', b, t);
      });
      if (collide) decoyButton(tl, collide);
      if (placement === 'tool') submit = endButton(tl, 'dtool dock-end', label);
      u.el('span', 'spacer', foot);
      u.el('span', 'reset', foot, 'Reset');
      if (!ctx.finish && placement === 'footer') submit = endButton(foot, 'submit', label);
      if (!ctx.finish && placement === 'link') submit = endButton(foot, 'dock-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
