(function () {
  'use strict';
  const palette = { bg: '#fffef0', panel: '#fffef0', fg: '#09234f', muted: '#26476e', line: '#09234f' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This sheet already has compact panel and toast layouts at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Pointer Challenge');
      const tabs = u.el('nav', 'ds-tabs', top);
      ['Task', 'Results', 'Help'].forEach((t, i) => u.el('span', i === 0 ? 'active' : '', tabs, t));
      const product = u.el('span', 'ds-product', top, 'Mouse Skills Test');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['1.  Task', '2.  Tips', '3.  FAQ', '4.  Rules', '5.  About'].forEach((t, i) => u.el('div', i === 0 ? 'active' : '', rail, t));
      const content = u.el('div', 'ds-content', body);
      content.dataset.instruction = { header: 'top', panel: 'left', toast: 'toast', hidden: 'hidden' }[_c.display];
      const header = _c.display === 'header' ? u.el('aside', 'ds-brief', content) : content;
      Object.assign(_c, { top, product, content, header, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      if (_c.headerTools.children.length) {
        _c.product.hidden = true;
        _c.top.classList.add('ds-has-tools');
      }
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.main });
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        const text = panel.querySelector('.ref-panel-text');
        text.classList.add('ds-instruction');
        panel.querySelector('.ref-panel-title').textContent = '1. Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.content.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-chase-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#10bdc5'], LOW_ACCENTS: ['#10bdc5'], parts },
  });
})();
