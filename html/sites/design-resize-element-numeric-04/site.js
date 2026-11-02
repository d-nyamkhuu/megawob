(function () {
  'use strict';
  const palette = { bg: '#eeeeee', panel: '#e4e4e4', fg: '#111111', muted: '#555555', line: '#111111' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'brut');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'PANEL RESIZER');
      u.el('div', 'tagline', head, 'IMPLEMENTS EXACT SIZES');
      const content = u.el('div', 'content', shell);
      const left = u.el('div', 'left', content);
      const note = u.el('section', 'task-note', left);
      note.hidden = _c.display === 'hidden' || _c.display === 'panel';
      const aside = u.el('aside', 'aside', content);
      u.el('h3', '', aside, 'PANEL INSPECTOR');
      const panelSlot = u.el('div', 'panel-slot', aside);
      panelSlot.hidden = _c.display !== 'panel';
      Object.assign(_c, { shell, head, left, aside, content, panelSlot, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        _c.util.el('div', 'resize-help', _c.header, 'Drag a resize handle to adjust the panel. The inspector shows the selected panel’s dimensions.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('head-tools');
      if (!_c.headerTools.childElementCount) _c.headerTools.remove();
    },
    'frame.body': () => (_c) => {
      const u = _c.util, aside = _c.aside;
      const tg = u.el('section', 'card target', aside);
      tg.hidden = _c.display === 'panel';
      u.el('h4', '', tg, 'Panel Dimensions');
      const inner = u.el('div', 'inner', tg);
      for (const k of ['Width:', 'Height:']) {
        const row = u.el('div', '', inner);
        u.el('span', 'k', row, k);
        u.el('b', '', row, '— px');
      }
      const cur = u.el('section', 'card cur', aside);
      u.el('h4', '', cur, 'Current Size (selected panel)');
      for (const k of ['Width:', 'Height:']) {
        const row = u.el('div', '', cur);
        u.el('span', 'k', row, k);
        u.el('b', '', row, '—');
      }
      const sel = u.el('section', 'card selp', aside);
      u.el('h4', '', sel, 'Selected Panel');
      for (const [k, v] of [['Name:', '—'], ['Resizable:', 'Yes'], ['Min Size:', '—'], ['Max Size:', '—']]) {
        const row = u.el('div', '', sel);
        u.el('span', 'k', row, k);
        u.el('span', 'selected-value', row, v);
      }
      const reset = u.el('button', 'clear', aside, 'Reset Panel');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      _c.footSlot = u.el('div', 'footer', aside);
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
      const text = _c.panelSlot.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.left);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.header.classList.add('instruction-toast');
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footSlot.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footSlot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
      const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
      u.el('h3','',box,title);u.el('p','',box,text);
      const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const a=u.el('button','dismiss',box,'Accept optional');a.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-resize-element-numeric-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-resize-element-numeric-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffe63d'],
      LOW_ACCENTS: ['#ffe63d'],
      parts,
    },
  });
})();
