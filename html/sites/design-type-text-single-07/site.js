(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#071632', muted: '#55627a', line: '#c8d4e4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.display = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg width="62" height="62" viewBox="0 0 62 62" fill="none" stroke="#5088c1" stroke-width="1.8"><circle cx="31" cy="31" r="29"/><ellipse cx="31" cy="31" rx="20" ry="29"/><ellipse cx="31" cy="31" rx="10" ry="29"/><ellipse cx="31" cy="31" rx="29" ry="10"/><path d="M6 16Q31 26 56 16M6 46Q31 36 56 46M2 31h58M31 2v58"/></svg>';
      const bt = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bt, 'NorthBridge Supply');
      u.el('span', 'ds-sub', bt, 'EXTRANET');
      const wel = u.el('span', 'ds-welcome', top);
      wel.innerHTML = 'Welcome, Jamie Carter <i>|</i> March 12, 1999 <i>|</i> <u>Help</u> <i>|</i> <u>Log Out</u>';
      const menu = u.el('nav', 'ds-menu', document.body);
      'Home|Orders|Inventory|Reports|Account|Support'.split('|').forEach((t) => u.el('span', '', menu, t));
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { menu, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-nav-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (!panel) return;
      panel.classList.add('ds-brief');
      panel.querySelector('.ref-panel-title').textContent = 'Task';
      const u = _c.util;
      u.el('h2', 'ds-h2b', panel, 'Actions');
      const ol = u.el('ol', 'ds-steps', panel);
      ol.innerHTML = '<li>Click in the text box.</li><li>Type the code exactly as shown.</li>' +
        (_c.ctx.finish ? '' : '<li>Review your entry.</li>');
      u.el('h2', 'ds-h2c', panel, 'Notes');
      const ul = u.el('ul', 'ds-note-list', panel);
      ul.innerHTML = '<li>The code is case sensitive.</li><li>Enter only the characters shown.</li><li>Use the <b>Clear</b> button to remove your entry if needed.</li>';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast', 'ds-brief');
        const title = _c.util.el('h2', '', null, 'Task');
        note.insertBefore(title, note.firstChild);
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-type-text-single-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0c2a5a'],
      LOW_ACCENTS: ['#0c2a5a'],
      parts,
    },
  });
})();
