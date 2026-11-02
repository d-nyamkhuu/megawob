(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#999' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This page has its own panel and inline notification at every size.
      _c.display = _c.ctx.display || 'header';
    },
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
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      u.el('a', 'ds-rail-title', rail, 'Lab Tasks');
      ['Home', 'Task', 'Results', 'Help', 'About'].forEach((t, i) => {
        const a = u.el('a', i === 1 ? 'current' : '', rail, t);
        a.href = '#';
      });
      const content = u.el('div', 'ds-content', shell);
      const title = u.el('h1', 'ds-title', content);
      u.el('span', 'ds-title-text', title, 'Pointer Tracking Task');
      u.el('div', 'ds-rule', content);
      Object.assign(_c, { shell, content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      if (_c.display === 'header') {
        const header = _c.header;
        _c.header = _c.util.el('section', 'ds-header-note', _c.content);
        base(_c);
        _c.header.querySelector('.ref-instruction').classList.add('ds-instruction');
        _c.header = header;
      } else base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-episode-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-panel-title');
        panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
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
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('ds-footer');
      footer.querySelector('.ref-foot-text').remove();
      _c.content.appendChild(footer);
      const bottom = _c.util.el('div', 'ds-bottom', _c.content);
      _c.util.el('a', '', bottom, 'Contact');
      _c.util.el('a', '', bottom, 'Terms');
      Object.assign(_c, { footer, bottom });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-chase-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0645d8'], LOW_ACCENTS: ['#0645d8'], parts },
  });
})();
