(function () {
  'use strict';
  const palette = { bg: '#f8f7ed', panel: '#e3edf5', fg: '#092655', muted: '#465267', line: '#17366b' };
  const styleControls = (parent) => {
    parent.querySelectorAll('.ref-submit, .ref-float').forEach(b => b.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach(b => b.classList.add('ds-endlink'));
    parent.querySelectorAll('.ref-xtra').forEach(b => b.classList.add('ds-xtra'));
  };
  const parts = {
    'frame.layout': base => _c => {
      base(_c);
      // All four note modes occupy the original workspace card.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': base => _c => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => _c => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-book', brand, '▤');
      u.el('span', '', brand, 'Library System');
      u.el('div', 'ds-time', top, 'Tue Apr 12, 2005　 10:24 AM');
      const tabs = u.el('div', 'ds-tabs', document.body);
      u.el('div', 'ds-tab', tabs, 'Log In');
      u.el('div', 'ds-tab', tabs, 'Announcements');
      const workspace = u.el('div', 'ds-workspace');
      Object.assign(_c, { top, workspace, header: workspace });
    },
    'frame.nav': () => () => {},
    'frame.instruction': base => _c => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction', 'ds-instruction-header');
    },
    'frame.tools': base => _c => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-head-tools');
      styleControls(_c.headerTools);
      _c.headerTools.querySelectorAll('.ref-submit').forEach(b => b.classList.add('ds-submit-head'));
    },
    'frame.body': () => _c => {
      document.body.appendChild(_c.workspace);
      _c.body = _c.workspace;
      const u = _c.util;
      const news = u.el('aside', 'ds-news', _c.body);
      u.el('h2', '', news, '▤　Library News');
      const newsRows = [['Spring Reading Program', 'Apr 06, 2005'], ['New Books Arriving Soon', 'Apr 04, 2005'], ['Library Hours Update', 'Mar 28, 2005']];
      newsRows.forEach(([title, date]) => {
        const row = u.el('div', 'ds-news-row', news);
        u.el('span', 'ds-news-title', row, '▪　' + title);
        u.el('span', 'ds-news-date', row, date);
      });
    },
    'frame.panel': base => _c => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-instruction', 'ds-instruction-panel');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('ds-instruction-title');
        title.textContent = 'Task Note';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction-copy');
      }
    },
    'frame.stage': () => _c => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': base => _c => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        _c.workspace.appendChild(note);
      }
    },
    'frame.footer': base => _c => {
      base(_c);
      const shelf = document.body.querySelector('.ref-foot');
      shelf.classList.add('ds-footer');
      const place = shelf.querySelector('.ref-foot-text');
      place.classList.add('ds-footer-place');
      place.textContent = 'Riverton Public Library';
      const links = _c.util.el('nav', 'ds-footer-links');
      ['Help', 'Contact', 'Privacy'].forEach((x, i) => {
        if (i) _c.util.el('span', 'ds-sep', links, '|');
        _c.util.el('span', '', links, x);
      });
      shelf.insertBefore(links, shelf.querySelector('.ref-tools'));
      shelf.querySelector('.ref-tools').classList.add('ds-controls');
      styleControls(shelf);
      const endlink = shelf.querySelector('.ref-endlink');
      if (endlink) {
        shelf.classList.add('ds-footer-link');
        shelf.insertBefore(endlink, links);
      }
      _c.shelf = shelf;
    },
    'frame.floating': base => _c => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shelf.classList.add('ds-footer-floating');
        _c.shelf.insertBefore(dock, _c.shelf.querySelector('.ds-footer-links'));
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-act-in-time-popup-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#087d91'], LOW_ACCENTS: ['#087d91'], parts
    }
  });
})();
