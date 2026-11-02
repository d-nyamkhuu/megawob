(function () {
  'use strict';
  const IC = {
    mail: '<svg viewBox="0 0 48 48"><path d="M6 11h36v26H6z" fill="#fff"/><path d="m6 12 18 14 18-14M6 37l13-13m23 13L29 24" fill="none" stroke="#f9585f" stroke-width="2.6"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg>',
    max: '<svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg>',
    close: '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5l1.6 2.6 3-.7.6 3 3 .9-.8 3 2 2.3-2.2 2.1.5 3-3 .6-1.3 2.8-2.8-1.3-2.8 1.3-1.3-2.8-3-.6.5-3-2.2-2.1 2-2.3-.8-3 3-.9.6-3 3 .7z"/></svg>',
    chev: '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>',
    b: '<svg viewBox="0 0 24 24"><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/></svg>',
    i: '<svg viewBox="0 0 24 24"><path d="M10 5h8M6 19h8M14 5l-4 14"/></svg>',
    u: '<svg viewBox="0 0 24 24"><path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/></svg>',
    ul: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 8H7a4 4 0 0 0 0 8h3M14 8h3a4 4 0 0 1 0 8h-3M8 12h8"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M16 7v9a4 4 0 0 1-8 0V6a2.5 2.5 0 0 1 5 0v10a1 1 0 0 1-2 0V8"/></svg>',
    smile:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5v1M15 9.5v1"/></svg>',
    img: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="m5 17 5-5 3 3 2-2 4 4M9 9.5h.1"/></svg>',
  };
  const palette = { bg: '#211b2d', panel: '#2b2338', fg: '#f1edf5', muted: '#bfb7ce', line: '#453b52' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('r9');
      const shell = u.el('main', 'r9-shell', document.body);
      const head = u.el('header', 'r9-head', shell);
      u.el('span', 'r9-logo', head).innerHTML = IC.mail;
      const wc = u.el('span', 'r9-wc', head);
      wc.innerHTML = '<i>' + IC.min + '</i><i>' + IC.max + '</i><i>' + IC.close + '</i>';
      Object.assign(_c, { shell, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'r9-instr');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      // The toolbar is attached to the composer when the body is drawn.
      const toolbar = _c.util.el('div', 'r9-tb');
      const font = _c.util.el('span', 'r9-font', toolbar);
      _c.util.el('span', '', font, 'Sans Serif');
      _c.util.el('i', '', font).innerHTML = IC.chev;
      [['b'], ['i'], ['u'], ['|'], ['ul'], ['ul'], ['|'], ['link'], ['clip'], ['smile'], ['img']].forEach(([k]) => {
        if (k === '|') _c.util.el('span', 'r9-sep', toolbar);
        else _c.util.el('i', 'r9-ic r9-ic-' + k, toolbar).innerHTML = IC[k];
      });
      const header = _c.header;
      _c.header = toolbar;
      base(_c);
      _c.header = header;
      header.appendChild(_c.headerTools);
      _c.headerTools.classList.add('r9-toptools');
      _c.toolbar = toolbar;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const mid = u.el('section', 'r9-mid', _c.shell);
      u.el('h2', 'r9-title', mid, 'New Message');
      const to = u.el('div', 'r9-row r9-to', mid);
      u.el('label', '', to, 'To');
      const tof = u.el('div', 'r9-field', to);
      const chip = u.el('span', 'r9-chip', tof);
      u.el('span', '', chip, 'team@greenfieldco.com');
      u.el('i', '', chip).innerHTML = IC.close;
      const cc = u.el('span', 'r9-cc', to);
      u.el('span', '', cc, 'Cc');
      u.el('span', '', cc, 'Bcc');
      const sj = u.el('div', 'r9-row r9-sj', mid);
      u.el('label', '', sj, 'Subject');
      u.el('div', 'r9-field', sj, 'Project update');
      const comp = u.el('div', 'r9-compose', mid);
      const body = u.el('div', 'r9-body', comp);
      const msg = u.el('div', 'r9-msg', body);
      ['Hi team,', '', 'Here’s a quick update on the project. Let me know if you have any questions.', '', 'Best,', 'Alex']
        .forEach((t) => u.el('div', '', msg, t || ' '));
      Object.assign(_c, { body, comp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'r9-instr');
        panel.dataset.display = _c.display;
        _c.header.insertBefore(panel, _c.headerTools);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage r9-stage', _c.comp);
      _c.comp.appendChild(_c.toolbar);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'r9-instr', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('r9-foot');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const set = _c.util.el('span', 'r9-settings');
      const reset = _c.util.el('button', 'reset-task r9-reset', set);
      reset.type = 'button';
      reset.title = 'Settings';
      reset.setAttribute('aria-label', 'Settings');
      reset.innerHTML = IC.gear;
      _c.util.el('span', '', set, 'Settings');
      foot.prepend(set);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support',
        promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.',
        chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-button-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'r9.css'],
    design: {
      THEMES: { 'design-click-control-button-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f9585f'],
      LOW_ACCENTS: ['#f9585f'],
      parts,
    },
  });
})();
