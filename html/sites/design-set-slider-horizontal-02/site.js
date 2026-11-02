/* Photo Manager - Adjust Image: Windows XP Luna dialog with seeded task instruction. */
(function () {
  'use strict';
  function scene(parent, cls) {
    const u = env.util;
    const photo=u.el('div',cls+' landscape-photo',parent);
    photo.setAttribute('role','img');
    photo.setAttribute('aria-label','Mountain lake with evergreen trees reflected in the water');
  }
  env.xpScene = scene;
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Photo Manager',promo:'Photo Manager',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
        const choices=u.el('div','survey-choices',el);
        ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label)=>{
          const row=u.el('label','',choices);const radio=u.el('input','',row);radio.type='radio';radio.name='ease';radio.value=label;u.el('span','',row,label);
        });
        u.el('div','survey-question second',el,'2. What could we improve?');
        const dropdown=u.el('div','survey-dropdown',el);
        const toggle=u.el('button','survey-select',dropdown,'Select an option…');toggle.type='button';toggle.setAttribute('aria-expanded','false');
        const options=u.el('div','survey-options',dropdown);options.hidden=true;
        for(const label of ['Finding records','Image quality','Help and guidance']){const b=u.el('button','',options,label);b.type='button';b.onclick=()=>{toggle.textContent=label;options.hidden=true;toggle.setAttribute('aria-expanded','false');};}
        toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));};
      }else{
        u.el('p','survey-intro',el,{cookie:'This application can remember your display preferences.',toast:'The image is ready for editing.',promo:'Discover more photo tools.',banner:'Photo Manager is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const palette = { bg: '#0a4fd0', panel: '#f5f3e8', fg: '#080914', muted: '#34476d', line: '#87abed' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('xp');
      const win = u.el('div', 'xp-window', document.body);
      const title = u.el('header', 'xp-title', win);
      const ico = u.svg('svg', { viewBox: '0 0 24 24', class: 'xp-icon', 'aria-hidden': 'true' }, title);
      u.svg('rect', { x: 3, y: 2, width: 19, height: 17, rx: 1, fill: '#e8efff', stroke: '#7a8a9a' }, ico);
      u.svg('rect', { x: 2, y: 4, width: 20, height: 16, rx: 1, fill: '#fff', stroke: '#7a8a9a' }, ico);
      const iconPhoto = u.svg('svg', { x: 4, y: 6, width: 16, height: 12, viewBox: '38 469 412 300', preserveAspectRatio: 'none' }, ico);
      u.svg('image', { href: 'sites/design-set-slider-horizontal-02/assets/lakeside-source.webp', width: 1672, height: 941 }, iconPhoto);
      u.el('span', 'xp-title-text', title, 'Photo Manager - Adjust Image');
      const caps = u.el('div', 'xp-caps', title);
      for (const c of ['min', 'max', 'close']) {
        const b = u.el('span', 'xp-cap ' + c, caps);
        const s = u.svg('svg', { viewBox: '0 0 16 16' }, b);
        if (c === 'min') u.svg('rect', { x: 3, y: 11, width: 7, height: 3, fill: '#fff' }, s);
        else if (c === 'max') u.svg('rect', { x: 3, y: 3, width: 10, height: 10, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, s);
        else u.svg('path', { d: 'M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5', stroke: '#fff', 'stroke-width': 2.4 }, s);
      }
      const body = u.el('div', 'xp-body', win);
      const info = u.el('section', 'file-info', body);
      scene(u.el('div', 'thumb-box', info), 'thumb');
      const dl = u.el('dl', 'file-meta', info);
      for (const [k, v] of [['File:', 'Lakeside.jpg'], ['Size:', '1024 × 768 pixels'], ['Type:', 'JPEG Image']]) {
        u.el('dt', '', dl, k); u.el('dd', '', dl, v);
      }
      const fileTools = u.el('div', 'file-tools', info);
      const noteSlot = u.el('div', 'note-slot', body);
      Object.assign(_c, { body, fileTools, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.fileTools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.noteSlot.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'xp-footer', _c.body);
      const help = u.el('span', 'xp-btn help', footer);
      u.el('span', 'help-q', help, '?'); u.el('span', '', help, 'Help');
      const actions = u.el('div', 'footer-actions', footer);
      const reset = u.el('button', 'xp-btn reset', actions, 'Reset');
      reset.type = 'button'; reset.dataset.action = 'reset';
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      actions.appendChild(foot);
      u.el('span', 'xp-btn cancel', actions, 'Cancel');
      Object.assign(_c, { footer, actions });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.classList.add('has-floating');
        _c.footer.appendChild(dock);
      }
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-horizontal-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-horizontal-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2166e0'],
      LOW_ACCENTS: ['#2166e0'],
      parts,
    },
  });
})();
