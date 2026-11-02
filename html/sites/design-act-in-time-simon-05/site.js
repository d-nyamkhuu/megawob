(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-simon-05',
    brand: 'Rivermere Public Library',
    menu: 'Home|Search Catalog|Research Tools|Events|My Account|Help|Site Map',
  };
  const palette = { bg: '#e8e2d5', panel: '#f7f1e4', fg: '#52141b', muted: '#62534a', line: '#90786a' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add(parent.classList.contains('ds-menu') ? 'ds-submit-nav' : 'ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-endlink'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-xtra'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.dataset.simonbrief = _c.display;
      document.body.dataset.simonfinish = String(_c.ctx.finish);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
      document.body.dataset.simonend = _c.ctx.finish ? 'none' :
        ['header', 'icon'].includes(_c.placement) ? 'nav' : _c.placement === 'link' ? 'link' : 'footer';
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-bookmark', top, '▤');
      const mast = u.el('div', 'ds-mast', top);
      u.el('span', 'ds-brand', mast, C.brand);
      u.el('span', 'ds-tagline', mast, 'Catalog　•　Discover　•　Learn　•　Belong');
      u.el('span', 'ds-motto', top, 'Knowledge Builds\nBrighter Tomorrows');
      const menu = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => u.el('span', i > 4 ? 'ds-nav-right' : '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'ds-title', content, 'Memory Sequence');
      Object.assign(_c, { header: content, contentPane: content, menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-nav-tools');
      styleControls(_c.menu);
      if (_c.headerTools.children.length) _c.menu.classList.add('ds-menu-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      _c.body = u.el('div', 'ds-main', _c.contentPane);
      const detail = u.el('aside', 'ds-book-detail', document.body);
      u.el('div', 'ds-detail-title', detail, 'Book Details');
      const cover = u.el('div', 'ds-cover', detail);
      u.el('span', '', cover, 'The Riverside Chronicles');
      const info = u.el('div', 'ds-biblio', detail);
      u.el('strong', '', info, 'The Riverside Chronicles');
      u.el('div', '', info, 'Carter, E. L.');
      u.el('div', '', info, 'Call Number:　FIC CAR');
      u.el('div', '', info, 'Publication Date:　1992');
      u.el('div', '', info, 'Format:　Book');
      u.el('div', '', info, 'Subjects:　Rivers -- Fiction');
      u.el('p', 'ds-book-blurb', detail, 'A sweeping novel about a town, its river, and the people who call it home.');
      const actions = u.el('div', 'ds-book-actions', detail);
      ['Add to List', 'Save Record', 'View Similar'].forEach((t) => u.el('button', '', actions, t));
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Rivermere Public Library　 |　 123 Maple Avenue　 |　 Rivermere, OR 97035';
      _c.contentPane.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#651c25'],
      LOW_ACCENTS: ['#651c25'],
      parts,
    },
  });
})();
