(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#080808', muted: '#222', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original note switches to a side card only in a wide window.
      const roomy = (_c.W * 0.966 - 18) >= 1100;
      _c.display = _c.ctx.display === 'panel' && !roomy ? 'header' : (_c.ctx.display || 'header');
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
      const menu = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', menu, '●');
      ['File', 'Edit', 'Task', 'Options', 'Window', 'Help'].forEach(t => u.el('span', '', menu, t));
      u.el('span', 'ds-time', menu, '10:27 AM');
      const content = u.el('div', 'ds-content', document.body);
      const title = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-boxmark', title, '−');
      u.el('strong', '', title, 'Timed Task');
      u.el('span', 'ds-boxmark', title, '−');
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', content) : content;
      Object.assign(_c, { content, title, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-main', _c.content);
      if (_c.display === 'panel') body.classList.add('ds-panel-layout');
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
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
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-delay-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-delay-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
