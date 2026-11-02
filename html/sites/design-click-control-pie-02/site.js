(function () {
  'use strict';
  const palette = { bg: '#f3f1ec', panel: '#faf9f7', fg: '#10182d', muted: '#5c6678', line: '#e0e0e3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original shell's instruction-mode breakpoints.
      if ((_c.display === 'panel' && (_c.W - 2 < 1260 || _c.H - 2 < 700)) ||
          (_c.display === 'toast' && _c.H - 2 < 700)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'fluent');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('span', 'app-logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 28 28"><defs><linearGradient id="logo-blue"><stop stop-color="#0085f3"/><stop offset="1" stop-color="#50bdff"/></linearGradient></defs><rect width="28" height="28" rx="5" fill="url(#logo-blue)"/><path d="M14 0v28M0 14h28" stroke="#d2efff" stroke-opacity=".6"/><path d="M2 15h11v12H5q-3 0-3-3Z" fill="#008cf5"/><path d="M16 2h8v10h-8Z" fill="#b5e8ff" opacity=".4"/></svg>';
      u.el('div', 'title', head, 'Skill Builder');
      const wc = u.el('span', 'window-controls', head);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" rx="1.5"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const brief = u.el('div', 'brief', center);
      u.el('div', 'brief-step', brief, 'Task 1 of 1');
      brief.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, head, wc, work, center, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      _c.util.el('div', 'brief-sub', _c.header, 'Click the correct item in the pie menu. Do not type anything.');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('head-tools');
      _c.head.insertBefore(_c.headerTools, _c.wc);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const canvas = u.el('div', 'canvas', _c.center);
      u.el('div', 'canvas-title', canvas, 'Canvas');
      u.el('div', 'canvas-sub', canvas, 'Right-click anywhere in the canvas to open the pie menu.');
      const aside = u.el('aside', 'inspector', _c.work);
      u.el('h2', '', aside, 'Your progress');
      const prog = u.el('div', 'progress', aside);
      u.el('span', 'ring', prog);
      const pt = u.el('div', '', prog);
      u.el('b', '', pt, '0 of 1');
      u.el('span', '', pt, 'tasks completed');
      u.el('hr', '', aside);
      u.el('h2', '', aside, 'Tips');
      const tip = u.el('div', 'tip', aside);
      const bulb = u.el('span', 'bulb', tip);
      bulb.innerHTML =
        '<svg viewBox="0 0 24 32"><path d="M9 25h6M10 29h4M12 2a9 9 0 0 0-5.5 16c1.3 1.2 2 3 2 5h7c0-2 .7-3.8 2-5A9 9 0 0 0 12 2Z"/><path d="M11 6c-4 1-5 5-3 7" opacity=".4"/></svg>';
      u.el('p', '', tip, 'Right-click in the canvas to open the pie menu, then click the requested item.');
      Object.assign(_c, { canvas, aside, body: _c.work });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-panel');
        panel.querySelector('.ref-panel-title').classList.add('episode-panel-title');
        const note = panel.querySelector('.ref-panel-text');
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.canvas);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.center.insertBefore(note, _c.canvas);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.insertBefore(dock, _c.aside.querySelector('.ref-foot'));
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
  env.site({
    name: 'design-click-control-pie-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-pie-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#006bd5'],
      LOW_ACCENTS: ['#006bd5'],
      parts,
    },
  });
})();
