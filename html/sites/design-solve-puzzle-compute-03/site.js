(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-compute-03', template: 'site/base', styles: ['site.css'],
    design: { parts: {
    'frame.header': (base, S) => function (_c) {
      const { ctx } = _c;
      const u = ctx.util;
      document.body.classList.add('lisa', 'mode-' + _c.display, 'end-' + _c.placement);
      const app = u.el('main','app',document.body);
      const bar = u.el('header','titlebar',app);
      const glyph = u.svg('svg',{viewBox:'0 0 30 34',width:30,height:34,class:'title-glyph'},bar);
      u.svg('path',{d:'M4 2h15l7 7v23H4z M19 2v8h7',fill:'none',stroke:'currentColor','stroke-width':2},glyph);
      const title = u.el('div','caption',bar,'Workbook');
      const wc = u.el('div','window-controls',bar);
      for (const symbol of ['−','□','×']) u.el('span','window-control',wc,symbol);
      const menu = u.el('nav','menu',app);
      for (const item of ['File','Edit','View','Insert','Format','Tools','Window','Help']) u.el('span','menu-item',menu,item);
      const toolbar = u.el('div','toolbar',app);
      const icons = [
        '<path d="M8 2h20l8 8v31H8z M28 2v9h8"/>','<path d="M3 13h13l4-4h19v25H3z M3 16h36l-4 21H7z"/>',
        '<path d="M9 4h24v10H9z M5 15h32v18H5z M10 26h22v14H10z M14 30h14"/>',
        '<path d="M12 3l18 36 M30 3L12 39"/><circle cx="10" cy="38" r="4"/><circle cx="32" cy="38" r="4"/>',
        '<path d="M6 3h22l7 7v29H6z M13 8h19v25H13z M28 3v8h7"/>',
        '<path d="M5 8h32v33H5z M12 4h18v6H12z M10 14h22v21H10z M14 19h14 M14 24h14 M14 29h14"/>',
        '<path d="M4 39L19 4h4l15 35 M10 28h22"/>','<path d="M4 7h34 M4 16h24 M4 25h34 M4 34h24"/>',
        '<path d="M3 4h37v35H3z M3 14h37 M3 24h37 M14 4v35 M27 4v35"/>'
      ];
      icons.forEach((html,i) => { const box=u.el('span','tool tool-'+i,toolbar); const svg=u.svg('svg',{viewBox:'0 0 44 44',width:42,height:42},box); u.svg('g',{fill:'none',stroke:'currentColor','stroke-width':2},svg).innerHTML=html; });
      const actions = u.el('div','toolbar-actions',toolbar);
      Object.assign(_c, { app, header: title, actions });
    },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('header-note');
    },
    'frame.tools': (base, S) => function (_c) {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': (base, S) => function (_c) {
      _c.body = _c.util.el('div', 'workspace', _c.app);
    },
    'frame.panel': (base, S) => function (_c) {
      const u = _c.util, body = _c.body;
      const side = u.el('aside', 'help-pane', body);
      _c.body = side;
      base(_c);
      _c.body = body;
      _c.side = side;
      u.el('div','help-heading',side,'Help'); u.el('div','tips-heading',side,'Tips');
      const list=u.el('ul','tips',side);
      const tips = ['Review the information in the workbook.','Use the controls to enter a response.','Use the keyboard in text boxes.'];
      for (const tip of tips) u.el('li','',list,tip);
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      _c.stage.classList.add('stage');
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.body.querySelector(':scope > .ref-note');
      if (note) _c.side.prepend(note);
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.body.querySelector(':scope > .ref-foot');
      if (foot) {
        foot.classList.add('footer');
        _c.app.append(foot);
      }
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const dock = document.body.querySelector(':scope > .ref-float-dock');
      if (dock) _c.app.append(dock);
    },
    overlay: (base, S) => function overlay(ctx) {
      const u=ctx.util,el=u.el('div','overlay overlay-'+ctx.kind,document.body);
      const text={cookie:'This application stores preferences on your device.',toast:'Your workbook has been updated.',chat:'Need help with this workbook?',promo:'Explore more workbook exercises.',banner:'An updated workbook is available.'};
      u.el('span','overlay-text',el,text[ctx.kind]||'Notice');
      const dismiss=u.el('button','overlay-dismiss',el,ctx.kind==='cookie'?'Accept':'×');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
    } }
  });
})();
