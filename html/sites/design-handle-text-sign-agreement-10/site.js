(() => {
  'use strict';
  const ICONS = {
    Help: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M5 15q13-5 26 1 14-6 28-1v38q-14-5-28 0-13-5-26 0z" fill="#a97630" stroke="#071f25" stroke-width="3"/><path d="M9 10q12-3 22 3v34q-10-5-22-2zM55 10q-12-3-22 3v34q10-5 22-2z" fill="#f9ebc5" stroke="#563d22" stroke-width="1.5"/><path d="M14 15v24m4-24v25m4-24v25m19-25v25m4-26v25m4-26v25" stroke="#c8b995" stroke-width=".8"/><path d="M32 13v37" stroke="#352d20" stroke-width="2"/></svg>',
    Contents: '<img src="sites/design-handle-text-sign-agreement-10/assets/globe-detail.webp" alt=""/>',
    Search: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 36L9 58" stroke="#06171e" stroke-width="10"/><path d="M24 36L8 56" stroke="#cbb990" stroke-width="6"/><circle cx="36" cy="24" r="19" fill="#051f28" stroke="#e8d7ae" stroke-width="2"/><circle cx="36" cy="24" r="14" fill="#4096a1" stroke="#122e36" stroke-width="2"/><path d="M26 23q1-9 10-10" fill="none" stroke="#c5eeeb" stroke-width="3"/><path d="M42 14q6 5 5 11" fill="none" stroke="#78b0ad" stroke-width="2"/></svg>',
    Tips: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="jewel"><stop stop-color="#228f9d"/><stop offset="1" stop-color="#023540"/></radialGradient></defs><circle cx="32" cy="32" r="27" fill="url(#jewel)" stroke="#001d24" stroke-width="3"/><text x="32" y="48" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="52" fill="#f1c459" stroke="#493512" stroke-width=".7">?</text></svg>',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The paper margin has room for every instruction display at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'clearlooks', 'agreement');
      const shell = u.el('main', 'shell', document.body);
      u.el('div', 'margin-art', shell);
      u.el('div', 'brand', shell);
      const title = u.el('header', 'agreement-top', shell);
      u.el('div', 'agreement-title', title, 'User Agreement');
      u.el('div', 'agreement-tagline', title, 'A Wider World Awaits');
      const tabs = u.el('nav', 'tabs', shell);
      ['Overview', 'User Agreement', 'Privacy', 'Support'].forEach((x, i) =>
        u.el('div', i === 1 ? 'selected' : '', tabs, x));
      const work = u.el('div', 'work', shell);
      const toolbar = u.el('div', 'margin-tools', shell);
      Object.assign(_c, { shell, work, toolbar, header: work });
    },
    'frame.nav': () => (_c) => {
      const rail = _c.util.el('nav', 'rail', _c.shell);
      ['Help', 'Contents', 'Search', 'Tips'].forEach((label) => {
        const item = _c.util.el('div', 'tool', rail);
        const icon = _c.util.el('span', 'tool-icon', item);
        icon.innerHTML = ICONS[label];
        _c.util.el('span', 'tool-label', item, label);
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  const palette = { bg: '#071d70', panel: '#f7f0df', fg: '#101010', muted: '#514b40', line: '#9e8b60' };
  env.site({
    name: 'design-handle-text-sign-agreement-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-sign-agreement-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#086b75'],
      LOW_ACCENTS: ['#086b75'],
      parts,
    },
  });
})();
