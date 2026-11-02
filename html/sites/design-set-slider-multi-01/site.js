/* 1994 plain HTML form page: Scene Ledger table, task instruction, sliders, detached preview, native Submit. */
(function () {
  'use strict';
  const COLS = ['#', 'Item', 'Type', 'X', 'Y', 'Z', 'Visible'];
  const ROWS = [
    [1, 'Sun', 'Light', -12, 28, 50, 'Yes'],
    [2, 'Camera', 'Camera', 0, 12, -30, 'Yes'],
    [3, 'Tree', 'Model', 18, 0, 5, 'Yes'],
    [4, 'Rock', 'Model', -7, 0, 12, 'Yes'],
    [5, 'Cabin', 'Model', 25, 0, -10, 'Yes'],
    [6, 'Lake', 'Model', 0, -2, 0, 'Yes'],
    [7, 'Fence', 'Model', -20, 0, 18, 'No'],
    [8, 'Bench', 'Model', 11, 0, -6, 'Yes'],
  ];
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Special offer',banner:'Service notice'}[ctx.kind];
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
        u.el('p','survey-intro',el,{cookie:'This page can remember your display preferences.',toast:'Your changes were noted.',promo:'Browse our other pages.',banner:'This page is best viewed at 800x600.'}[ctx.kind]);
      }
      const dismiss=u.el('button','survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  function preview(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'1251 582 385 279', class:'pv-svg', preserveAspectRatio:'none', 'aria-hidden':'true'}, parent);
    u.svg('image', {href:'sites/design-set-slider-multi-01/assets/scene-reference.webp', width:1672, height:941}, svg);
  }
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `plainform instruction-${_c.display}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const header = u.el('header', 'ledger-header', document.body);
      u.el('h1', 'page-title', header, 'Scene Ledger');
      const table = u.el('table', 'ledger', header);
      const head = u.el('tr', '', u.el('thead', '', table));
      COLS.forEach((c, i) => u.el('th', 'c' + i, head, c));
      const tb = u.el('tbody', '', table);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tb);
        r.forEach((v, i) => {
          const td = u.el('td', 'c' + i, tr, String(v));
          if ((i === 2 && v === 'Camera') || (i === 6 && v === 'No')) td.style.fontWeight = 'bold';
        });
      });
      u.el('hr', 'rule', header);
      const toolbar = u.el('div', 'ledger-toolbar', header);
      Object.assign(_c, { header, toolbar });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ledger-body', document.body);
      const panelSlot = u.el('aside', 'ledger-panel-slot', body);
      const toastSlot = u.el('aside', 'ledger-toast-slot', body);
      const pv = u.el('aside', 'preview', body);
      u.el('h2', '', pv, 'Preview');
      preview(pv);
      u.el('div', 'pv-cap', pv, 'Camera view (live preview)');
      Object.assign(_c, { body, panelSlot, toastSlot });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.body);
      stage.dataset.role = 'stage';
      if (_c.display === 'header') {
        const instruction = _c.header.querySelector('.ref-instruction');
        const top = Math.max(stage.getBoundingClientRect().top, instruction.getBoundingClientRect().bottom + 8);
        stage.style.top = top + 'px';
        stage.style.height = Math.max(0, _c.H * .91 - top) + 'px';
      }
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.toastSlot.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-multi-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-multi-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#999'],
      LOW_ACCENTS: ['#999'],
      parts,
    },
  });
})();
