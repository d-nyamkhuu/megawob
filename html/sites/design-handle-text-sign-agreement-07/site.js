(function () {
  'use strict';
  const palette = { bg: '#9eb5cc', panel: '#fff', fg: '#25282d', muted: '#666b72', line: '#c9cbd0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original keeps every note mode in its separate task palette.
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
      document.body.className = 'ref yosemite split';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Software License Agreement');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML = '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menus = u.el('div', 'tools', head);
      menus.innerHTML = '<span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>';
      const overview = u.el('section', 'overview', shell);
      const file = u.el('div', 'license-file-icon', overview);
      file.innerHTML = '<svg viewBox="0 0 100 125"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e5e5e3"/></linearGradient></defs><path d="M8 3h58l26 27v89q0 3-3 3H11q-3 0-3-3Z" fill="url(#paper)" stroke="#999" stroke-width="2"/><path d="M66 3v28h26" fill="#ddd" stroke="#999" stroke-width="2"/><path d="M23 24h27M23 34h27M23 44h53M23 54h53M23 64h53M23 74h53M23 84h53M23 94h45" stroke="#b5b6b6" stroke-width="4" stroke-linecap="round"/></svg>';
      const details = u.el('div', 'license-details', overview);
      u.el('h2', '', details, 'PhotoCraft');
      const table = u.el('div', 'license-facts', details);
      ['Version:|2.4.1', 'Publisher:|PhotoCraft, Inc.', 'Type:|Desktop Application', 'Size:|18.6 MB', 'Modified:|Mar 3, 2009'].forEach((text) => {
        const values = text.split('|');
        u.el('span', '', table, values[0]);
        u.el('span', '', table, values[1]);
      });
      u.el('p', 'license-description', overview, 'End User License Agreement');
      const taskPalette = u.el('aside', 'footer', shell);
      taskPalette.dataset.display = _c.display;
      taskPalette.classList.toggle('finish-mode', !!_c.ctx.finish);
      taskPalette.classList.add('end-' + _c.placement);
      const paletteTitle = u.el('div', 'palette-title', taskPalette, 'Task');
      const lights = u.el('span', 'palette-lights', paletteTitle);
      for (let i = 0; i < 3; i++) u.el('i', '', lights);
      const noteSlot = u.el('div', 'palette-note', taskPalette);
      Object.assign(_c, { shell, taskPalette, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.taskPalette;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('palette-toolbar');
      _c.taskPalette.insertBefore(_c.headerTools, header);
    },
    'frame.body': () => (_c) => {
      const work = _c.util.el('div', 'work', _c.shell);
      const center = _c.util.el('section', 'center', work);
      Object.assign(_c, { body: work, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('palette-end-tools');
      _c.taskPalette.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      if (_c.display === 'hidden' && _c.ctx.finish && !_c.taskPalette.querySelector('button,a')) {
        _c.taskPalette.hidden = true;
      }
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
    name: 'design-handle-text-sign-agreement-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-sign-agreement-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1684ff'],
      LOW_ACCENTS: ['#1684ff'],
      parts,
    },
  });
})();
