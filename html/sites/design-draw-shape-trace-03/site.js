(function () {
  'use strict';
  const C = { title: 'Trace the Path', brand: 'Path Practice', accent: '#d62430', bg: '#fbf6ee', font: "'Helvetica Neue', Arial, sans-serif" };
  const palette = { bg: C.bg, panel: C.bg, fg: '#16161a', muted: '#444', line: '#16161a' };

  // Format only the instruction node supplied by the shared frame.
  function dressNote(_c, note, text) {
    if (!note || !text) return;
    const u = _c.util;
    note.classList.add('bh-note');
    text.classList.add('instruction');
    const txt = text.textContent;
    note.classList.toggle('bh-long', txt.length > 68);
    const m = txt.match(/^(.*?)(\s*(?:the arrow tip|(?:the )?arrowhead)\.?)$/i);
    if (m) {
      text.textContent = m[1] + ' ';
      u.el('span', 'bh-red', text, m[2].trim());
    }
    const kicker = u.el('div', 'bh-kicker', null, 'TASK');
    note.insertBefore(kicker, note.firstChild);
    if (_c.display !== 'toast') {
      u.el('hr', 'bh-rule', note);
      u.el('p', 'bh-copy', note, 'Click and hold to draw along the dashed path. Keep your mouse on the path from the start dot to the arrow tip.');
      u.el('p', 'bh-copy', note, 'Release to finish. Try to stay as close to the path as possible.');
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its dedicated left pane in every viewport and mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design bauhaus' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      _c.root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'bh-shell', document.body);
      const left = u.el('aside', 'bh-left', shell);
      const brand = u.el('div', 'bh-brand', left);
      u.el('span', 'bh-dot', brand);
      u.el('span', 'bh-name', brand, C.brand);
      const noteSlot = u.el('div', 'bh-note-slot', left);
      const info = u.el('div', 'bh-goal', left);
      u.el('div', 'bh-kicker', info, 'WORKSPACE');
      u.el('p', '', info, 'Mouse drawing practice.');
      const right = u.el('section', 'bh-right', shell);
      const head = u.el('header', 'bh-head', right);
      u.el('h1', '', head, C.title);
      const tools = u.el('div', 'bh-head-tools', head);
      const reset = u.el('button', 'bh-reset', tools);
      reset.type = 'button';
      const ic = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, reset);
      u.svg('path', { d: 'M20 12A8 8 0 1 1 16.5 5.4M20 3V8H15' }, ic);
      u.el('span', '', reset, 'Reset');
      reset.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { shell, left, right, tools, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.noteSlot.querySelector('.ref-instruction');
      if (text) {
        const note = _c.util.el('section', 'bh-header-note', _c.noteSlot);
        note.appendChild(text);
        dressNote(_c, note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.right; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.noteSlot });
      const note = _c.noteSlot.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction-panel');
        dressNote(_c, note, note.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.right);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.noteSlot.appendChild(note);
        dressNote(_c, note, note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bh-foot');
      _c.right.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
      const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
      const label=kind==='cookie'?'Reject optional':'Close';
      u.el('h3','',box,title);u.el('p','',box,text);
      const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-draw-shape-trace-03', template: 'site/base', langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'bauhaus.css', 'site.css'],
    design: { THEMES: { 'design-draw-shape-trace-03': palette }, LOW_THEME: palette, ACCENTS: [C.accent], LOW_ACCENTS: [C.accent], parts },
  });
})();
