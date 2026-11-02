(function () {
  'use strict';
  const TOOLS = [
    ['New', '<path d="M7 3h9l5 5v13H7z"/><path d="M14 12v7M10.5 15.5h7"/>'],
    ['Copy', '<rect x="3" y="7" width="12" height="14"/><path d="M8 7V3h13v14h-6"/>'],
    ['Cut', '<circle cx="7" cy="19" r="2.6"/><circle cx="17" cy="19" r="2.6"/><path d="M8.5 16.5L17 3M15.5 16.5L7 3"/>'],
    ['Delete', '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v8M14 10v8"/>'],
    ['|'],
    ['Rename', '<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M13 7l4 4"/>'],
    ['Properties', '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1.5"/>'],
  ];
  const palette = { bg: '#fdfcf8', panel: '#fdfcf8', fg: '#111', muted: '#444', line: '#ccc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated brief pane fits all note modes even at the smallest viewport.
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
      document.body.classList.add('ref', 'modernist');
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const brief = u.el('aside', 'brief', work);
      const briefHead = u.el('div', 'brief-head', brief);
      u.el('div', 'brief-k', briefHead, 'TASK');
      const header = u.el('div', 'brief-note', brief);
      u.el('hr', '', brief);
      [['FILE', 'Project Plan.docx'], ['LOCATION', 'Documents']].forEach((p) => {
        const r = u.el('div', 'meta', brief);
        u.el('span', 'mk', r, p[0]);
        u.el('span', 'mv', r, p[1]);
      });
      const foot = u.el('footer', 'footer', shell);
      const tb = u.el('div', 'tools', foot);
      TOOLS.forEach((t) => {
        if (t[0] === '|') {
          u.el('span', 'tsep', tb);
          return;
        }
        const b = u.el('span', 'tool', tb);
        const i = u.el('i', '', b);
        i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' + t[1] + '</svg>';
        u.el('span', '', b, t[0]);
      });
      const toolbar = u.el('div', 'end-tools', foot);
      Object.assign(_c, { shell, work, brief, briefHead, header, foot, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('section', 'center', _c.work);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        _c.brief.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.briefHead.appendChild(dock);
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
    name: 'design-click-control-dialog-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-dialog-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b5ff20'],
      LOW_ACCENTS: ['#b5ff20'],
      parts,
    },
  });
})();
