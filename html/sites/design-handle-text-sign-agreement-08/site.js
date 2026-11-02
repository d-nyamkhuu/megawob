(function () {
  'use strict';
  const palette = { bg: '#f2f3f5', panel: '#f2f3f5', fg: '#102344', muted: '#687795', line: '#d9dfe8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The sheet already has dedicated positions for all note modes.
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
      document.body.classList.add('ref', 'clearlooks', 'split');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.display = _c.display;
      shell.dataset.end = _c.placement === 'header' || _c.placement === 'icon' ? 'toolbar' : _c.placement || 'none';
      shell.classList.toggle('finish-mode', !!_c.ctx.finish);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'User Agreement');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML = '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      for (let i = 1; i <= 13; i++) u.el('div', i === 1 ? 'active' : '', rail, String(i).padStart(2, '0'));
      const center = u.el('section', 'center', work);
      const toolbar = u.el('div', 'sheet-toolbar', shell);
      Object.assign(_c, { shell, work, rail, center, toolbar, header: center });
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
      if (_c.placement !== 'header' && _c.placement !== 'icon') _c.toolbar.classList.add('sheet-actions');
      const note = header.querySelector('.ref-instruction');
      if (note && _c.headerTools.children.length) {
        const width = _c.headerTools.getBoundingClientRect().width;
        if (_c.submit) note.style.paddingLeft = `calc(8.7% + ${width + 20}px)`;
        else note.style.paddingRight = `calc(4% + ${width + 20}px)`;
      }
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'footer', _c.shell);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
      // Reserve the complete note and toolbar before task anchors are measured.
      const note = _c.center.querySelector('.instruction');
      const nr = note && note.getBoundingClientRect();
      const sr = _c.shell.getBoundingClientRect();
      const tools = _c.headerTools.getBoundingClientRect();
      let top = _c.display === 'hidden' ? 0 : _c.display === 'header' ? window.innerHeight * .1 : window.innerHeight * (window.innerWidth <= 1100 ? .15 : .19);
      if (nr && nr.width > sr.width * .8) top = Math.max(top, nr.bottom - sr.top);
      if (_c.headerTools.children.length) top = Math.max(top, tools.bottom - sr.top + 8);
      _c.stage.style.top = top + 'px';
      _c.rail.style.top = top + 'px';
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
    name: 'design-handle-text-sign-agreement-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#174ff0'], LOW_ACCENTS: ['#174ff0'], parts },
  });
})();
