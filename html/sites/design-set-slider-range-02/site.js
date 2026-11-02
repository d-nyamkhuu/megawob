/* RISC OS image utility: a left workbench and a right values inspector. */
(function () {
  'use strict';
  const icons = {
    File: '<path d="M12 4h19l9 9v32H12z" fill="#eee"/><path d="M31 4v10h9M17 20h17M17 25h17M17 30h17M17 35h17" fill="none"/>',
    Edit: '<path d="M9 6h34v36H9z" fill="none" stroke-dasharray="4 3"/>',
    View: '<path d="M3 25Q25 0 49 25Q25 48 3 25Z" fill="#eee"/><circle cx="26" cy="24" r="11" fill="#0675d8"/><circle cx="26" cy="24" r="6" fill="#111"/><path d="M21 17l4-2" stroke="#fff"/>',
    Image: '<path d="M3 4h46v40H3z" fill="#ddd"/><path d="M6 7h40v30H6z" fill="#7eafe6"/><path d="M6 32l12-13 9 10 8-8 11 12v4H6z" fill="#1a9655"/><circle cx="16" cy="13" r="4" fill="#ffe655"/>',
    Adjust: '<circle cx="26" cy="24" r="10" fill="#e6d641"/><path d="M26 3v8M26 37v8M5 24h8M39 24h8M11 9l6 6M36 34l6 6M11 39l6-6M36 14l6-6"/>',
    Help: '<text x="13" y="40" fill="#007cdc" stroke="#111" stroke-width="1.5" font-size="44" font-family="Arial" font-weight="bold">?</text>'
  };
  function icon(u, parent, name) {
    const svg = u.svg('svg', {viewBox:'0 0 52 50',class:'tool-icon','aria-hidden':'true'}, parent);
    svg.innerHTML = '<g stroke="#222" stroke-width="1.8" stroke-linejoin="miter">'+icons[name]+'</g>';
  }
  function section(u, parent, title, cls) {
    const s=u.el('section','inspector-box '+cls,parent);
    u.el('h3','section-heading',s,title);
    return u.el('div','section-content',s);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The inspector and instruction slot fit even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'riscos instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const app = u.el('div', 'application', document.body);
      const title = u.el('header', 'titlebar', app);
      const gadget = u.el('div', 'document-gadget', title);
      icon(u, gadget, 'File');
      u.el('div', 'window-title', title, 'Image Adjuster');
      const close = u.el('button', 'close-gadget', title, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close window');
      close.onclick = () => env.log('decoy', { label: 'Close window' });
      const toolbar = u.el('nav', 'iconbar', app);
      for (const name of ['File', 'Edit', 'View', 'Image', 'Adjust', 'Help']) {
        const b = u.el('button', 'tool ' + (name === 'Adjust' ? 'selected' : ''), toolbar);
        b.type = 'button';
        icon(u, b, name);
        u.el('span', '', b, name);
        b.onclick = () => env.log('decoy', { label: name });
      }
      const toolbarActions = u.el('div', 'toolbar-actions', toolbar);
      u.el('div', 'utility-credit', toolbar, 'RISC OS\nImage Utility\n© 1989');
      const workspace = u.el('div', 'workspace ref-body', app);
      const left = u.el('section', 'workbench bevel', workspace);
      u.el('h2', 'pane-heading', left, 'Adjust Brightness and Contrast');
      Object.assign(_c, { workspace, left, toolbarActions, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.textContent = note.textContent.replace(/([.!?])\s+(?=[A-Z])/, '$1\n');
      }
    },
    'frame.tools': (base) => (_c) => {
      const chrome = { ..._c, header: _c.toolbarActions };
      base(chrome);
      Object.assign(_c, { headerTools: chrome.headerTools, submit: chrome.submit });
    },
    'frame.body': () => (_c) => {
      const { util: u, workspace, display } = _c;
      const right = u.el('aside', 'inspector bevel', workspace);
      u.el('h2', 'pane-heading', right, 'Inspector');
      const info = section(u, right, 'Image Information', 'image-info');
      const dl = u.el('dl', 'image-metadata', info);
      for (const [label, value] of [['Name:', 'LakeView'], ['Size:', '640 × 480'], ['Mode:', '8 bpp (256 colours)']]) {
        u.el('dt', '', dl, label);
        u.el('dd', '', dl, value);
      }
      const vals = section(u, right, 'Adjustment Values', 'adjustment-values');
      u.el('div', 'inspector-range-label', vals, 'Contrast (range)');
      const range = u.el('div', 'inspector-range', vals);
      u.el('output', 'value-field lower-value', range, '0');
      u.el('span', 'range-separator', range, '–');
      u.el('output', 'value-field upper-value', range, '0');
      const brightness = u.el('div', 'brightness', vals);
      u.el('div', '', brightness, 'Brightness');
      const slider = u.el('div', 'brightness-row', brightness);
      const rail = u.el('div', 'brightness-rail', slider);
      u.el('div', 'blue-thumb brightness-thumb', rail);
      u.el('output', 'value-field', slider, '512');
      if (display !== 'panel') {
        const hints = section(u, right, 'Hints', 'hints');
        u.el('p', 'hint-copy', hints, 'Drag the handles to adjust the image. Current values appear above and in the inspector.');
      }
      const actions = u.el('footer', 'action-strip', right);
      Object.assign(_c, { body: right, right, actions });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.right.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('inspector-box', 'hints');
        panel.querySelector('.ref-panel-title').classList.add('section-heading');
        panel.querySelector('.ref-panel-text').classList.add('section-content');
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'adjustment-stage', _c.left);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        _c.actions.appendChild(foot);
        // The utility's action strip has no separate copyright/status row.
        foot.querySelector('.ref-foot-text').remove();
      } else if (_c.placement !== 'floating') {
        _c.util.el('span', 'action-status', _c.actions, 'Image adjustment');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => function (ctx) {
      const u=ctx.util;
      const box=u.el('aside','system-dialog bevel overlay-'+ctx.kind,document.body);
      box.setAttribute('role','dialog');
      const title={cookie:'Display preferences',toast:'Image utility notice',chat:'Image utility help',promo:'Image utility',banner:'System notice'}[ctx.kind];
      u.el('h2','pane-heading',box,title);
      const x=u.el('button','dialog-close',box,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','',box,'Your image is ready for adjustment.');
      const dismiss=u.el('button','bevel dialog-dismiss',box,ctx.kind==='cookie'?'Dismiss preferences':'Dismiss');dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el:box,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
    },
  };

  env.site({
    name: 'design-set-slider-range-02',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      LANGS: ['en'],
      THEMES: { riscos: { bg: '#c5c5c5', panel: '#ccc', fg: '#111', muted: '#111', line: '#747474' } },
      LOW_THEME: { bg: '#c5c5c5', panel: '#ccc', fg: '#111', muted: '#111', line: '#747474' },
      ACCENTS: ['#0064ca'],
      LOW_ACCENTS: ['#0064ca'],
      parts,
    },
  });
})();
