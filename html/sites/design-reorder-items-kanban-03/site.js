(function () {
  'use strict';

  const palette = { bg: '#fff', panel: '#fff', fg: '#12306b', muted: '#5d7391', line: '#b9d3ea' };

  // Keep the notebook's reserved note strip clear of the board and its tabs.
  function fitNote(note, text, heading) {
    if (!note || !text) return;
    let fs = parseFloat(getComputedStyle(text).fontSize);
    let available = note.clientHeight - (heading ? heading.offsetHeight + 3 : 0) - 12;
    while (fs > 12 && text.scrollHeight > available) text.style.fontSize = --fs + 'px';
    if (text.scrollHeight > available && heading) {
      note.classList.add('wide-note');
      heading.hidden = true;
      text.style.fontSize = '';
      fs = parseFloat(getComputedStyle(text).fontSize);
      available = note.clientHeight - 12;
      while (fs > 12 && text.scrollHeight > available) text.style.fontSize = --fs + 'px';
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook reserves the same note strip even on compact viewports.
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
      document.body.classList.add('design', 'notebook');
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('div', 'topbar', shell);
      const tabs = u.el('nav', 'notebook-tabs', bar);
      for (const name of ['Tasks', 'Calendar', 'Notes', 'Files', 'Contacts']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Tasks' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const links = u.el('div', 'toplinks', bar);
      ['Settings', 'Help', 'Sign Out'].forEach((t) => u.el('span', '', links, t));
      const page = u.el('div', 'page', shell);
      Object.assign(_c, { shell, bar, links, page, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('div', 'instruction', note);
        // The template is the sole source of the instruction text.
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
        fitNote(note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.links;
      base(_c);
      _c.header = header;
      if (_c.headerTools.children.length) {
        _c.shell.classList.add('has-header-end');
        _c.shell.style.setProperty('--tools-width', _c.links.offsetWidth + 'px');
      }
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.page;
      base(_c);
      _c.body = body;
      const note = _c.page.querySelector('.ref-panel');
      if (note) fitNote(note, note.querySelector('.ref-panel-text'), note.querySelector('.ref-panel-title'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.page.appendChild(note);
        const heading = _c.util.el('div', 'note-heading', note, 'Task reminder');
        note.prepend(heading);
        fitNote(note, note.querySelector('.ref-note-text'), heading);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.page.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const clear = _c.util.el('button', 'clear-all', footer, 'Clear All');
      clear.type = 'button';
      footer.prepend(clear);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };

  env.site({
    name: 'design-reorder-items-kanban-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3a8a1e'],
      LOW_ACCENTS: ['#3a8a1e'],
      parts,
    },
  });
})();
