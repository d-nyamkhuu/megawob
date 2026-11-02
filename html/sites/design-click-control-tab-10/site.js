(function () {
  'use strict';
  const TOOLS = [
    ['Print', '<path d="M6 8V1h12v7h-1.5V2.5h-9V8ZM2 8h20a1 1 0 0 1 1 1v10H18v4H6v-4H1V9a1 1 0 0 1 1-1Zm5.5 10v3.5h9V18Z" fill="currentColor" stroke="none"/>'],
    ['Download', '<path d="M12 2v11m-4-4 4 4 4-4M3 15v6h18v-6" stroke-width="3"/>'],
    ['Share', '<circle cx="5" cy="12" r="4" fill="currentColor" stroke="none"/><circle cx="19" cy="4" r="4" fill="currentColor" stroke="none"/><circle cx="19" cy="20" r="4" fill="currentColor" stroke="none"/><path d="m7 11 9-5M7 13l9 5"/>'],
  ];
  const palette = { bg: '#fdfefe', panel: '#f4f5f7', fg: '#14213a', muted: '#596579', line: '#c9ced6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note modes fit in this design's permanent left pane.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      document.body.className = 'ref t10';
      const shell = _c.util.el('main', 't10-shell', document.body);
      const left = _c.util.el('section', 't10-left', shell);
      Object.assign(_c, { shell, left, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.left.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('t10-primary-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('section', 't10-doc', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction-panel');
        panel.querySelector('.ref-panel-text').dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.body);
      const tools = u.el('aside', 't10-tools', _c.body);
      TOOLS.forEach((t) => {
        const b = u.el('div', 't10-tool', tools);
        const i = u.el('span', '', b);
        i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + t[1] + '</svg>';
        u.el('em', '', b, t[0]);
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.left.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.left.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.body.querySelector('.t10-tools').appendChild(dock);
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
    name: 'design-click-control-tab-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 't10.css'],
    design: {
      THEMES: { 'design-click-control-tab-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4086dd'],
      LOW_ACCENTS: ['#4086dd'],
      parts,
    },
  });
})();
