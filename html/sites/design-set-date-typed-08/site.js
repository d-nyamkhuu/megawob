(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#222', line: '#999' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (!document.body._fragGuard) {
        document.body._fragGuard = true;
        document.body.addEventListener('click', e => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
        });
      }
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', '', nav, 'Project Task');
      const shell = u.el('div', 'ds-body', document.body);
      const contentArea = u.el('div', 'ds-content', shell);
      const header = u.el('aside', 'ds-header-note', contentArea);
      header.hidden = _c.display !== 'header';
      const toolbar = u.el('div', 'ds-toolbar', contentArea);
      Object.assign(_c, { contentArea, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentArea);
      if (_c.display === 'panel') _c.body.classList.add('ds-panel-layout');
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
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentArea.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'ds-footer', _c.contentArea);
      const links = u.el('span', 'ds-links', footer);
      ['Home', 'Contact Us', 'Privacy Policy'].forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('a', '', links, t).href = '#';
      });
      u.el('span', 'ds-copy', footer, '© 1995 Campus Services');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        footer.appendChild(foot);
        const link = foot.querySelector('.ref-endlink');
        if (link) links.appendChild(link);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);
      el.dataset.role = 'overlay';
      const texts = {cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss = u.el('button','',el,ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click',() => ctx.dismiss('close'));
      return {el,dismiss,ttlSteps:ctx.kind === 'toast' ? 4 : 0};
    },
  };
  env.site({
    name: 'design-set-date-typed-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f3a93'],
      LOW_ACCENTS: ['#1f3a93'],
      parts,
    },
  });
})();
