/* Lisa-era stationery workstation, drawn on the shared site frame. */
(function () {
  'use strict';
  function apple(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 24 28', class:'apple', 'aria-hidden':'true'}, parent);
    u.svg('path', {d:'M12 8c-2-1.6-7-1.6-8.2 3.2C2.6 16 5.6 24 8.4 24c1.4 0 2-.8 3.6-.8s2.2.8 3.6.8c2 0 4.6-4.4 4.8-6.4-3-1.2-3.4-5.4-.6-7C18.600 7.800 14 6.800 12 8z', fill:'#000'}, svg);
    u.svg('path', {d:'M12.400 7C12 4.800 13.800 2.600 16 2c.4 2.400-1.200 5-3.600 5z', fill:'#000'}, svg);
  }
  function docIcon(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 32 56', class:'doc-icon', 'aria-hidden':'true'}, parent);
    u.svg('path', {d:'M1.500 1.500h29v53h-29z', fill:'#f6f2e6', stroke:'#000', 'stroke-width':2}, svg);
    u.svg('rect', {x:6, y:6, width:6, height:5, fill:'#000'}, svg);
    for (let y = 14; y < 46; y += 5) u.svg('path', {d:`M6 ${y}h20`, stroke:'#000', 'stroke-width':1.500}, svg);
  }
  function landscape(parent) {
    const u = env.util;
    const img = u.el('img', 'scene', parent);
    img.src = 'sites/design-set-slider-multi-06/assets/lake-engraving.webp';
    img.alt = 'Stippled engraving of a mountain lake';
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'Message',cookie:'Preferences',toast:'Notice',promo:'Stationery offer',banner:'System notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'A colleague left a note on your desk.',cookie:'This workstation can remember your display preferences.',toast:'The document is ready for editing.',promo:'Order fresh letterhead for your office.',banner:'The print spooler is idle.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'OK');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const palette = {bg:'#f3f1e6', panel:'#f3f1e6', fg:'#000000', muted:'#555555', line:'#000000'};
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('lisa', `instruction-${_c.display}`);
      const bar = u.el('header','menubar',document.body);
      apple(bar);
      for (const m of ['File','Edit','View','Special','Help']) u.el('span','menu',bar,m);
      u.el('span','clock',bar,'Mon Mar 12   10:24 AM');
      const win = u.el('div','window',document.body);
      const tb = u.el('div','titlebar',win);
      u.el('span','tb-box',tb);
      u.el('span','tb-lines',tb);
      u.el('span','tb-title',tb,'Image Adjuster');
      u.el('span','tb-lines',tb);
      u.el('span','tb-box zoom',tb);
      const panes = u.el('div','panes',win);
      const left = u.el('section','pane-left',panes);
      u.el('div','divider',panes);
      const right = u.el('section','pane-right',panes);
      const row = u.el('div','instr-row',left);
      docIcon(row);
      u.el('div','pv-head',right,'Preview');
      landscape(u.el('div','pv-frame',right));
      Object.assign(_c, {win, left, row, header:tb});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.row;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.left; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.row;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','record-stage',_c.left);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.row.appendChild(note);
        note.querySelector('.ref-note-x').textContent = _c.closeLabel;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('shelf');
      _c.win.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('shelf-name');
      text.textContent = 'Image Adjuster';
      const actions = foot.querySelector('.ref-tools');
      actions.classList.add('shelf-actions');
      const link = actions.querySelector('.ref-endlink');
      if (link) { text.textContent = ''; text.appendChild(link); }
      Object.assign(_c, {foot, actions});
      _c.util.el('div','dither',document.body);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-multi-06',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{
      THEMES:{'design-set-slider-multi-06':palette},
      LOW_THEME:palette,
      ACCENTS:['#000000'],
      LOW_ACCENTS:['#000000'],
      parts,
    },
  });
})();
