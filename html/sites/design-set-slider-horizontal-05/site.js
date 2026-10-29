/* ImageLab (NeXTSTEP-style): inspector window with seeded task instruction, detached preview, dismissible overlays. */
(function () {
  'use strict';
  const ITEMS = ['Overview','Exposure','Contrast','Brightness','White Balance','Sharpness','Color','Rotate / Crop','Metadata'];
  function folder(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 24 20', class:'folder', 'aria-hidden':'true'}, parent);
    u.svg('path', {d:'M2 4h7l2 2h11v12H2Z', fill:'#aaa', stroke:'#111', 'stroke-width':1.4}, svg);
    u.svg('path', {d:'M3 7h18v10H3Z', fill:'#c7c7c7', stroke:'#111', 'stroke-width':1}, svg);
    u.svg('path', {d:'M4 8h16M4 8v8M3 4h6', stroke:'#eee', 'stroke-width':1}, svg);
    return svg;
  }
  function deskIcon(parent, label, kind) {
    const u = env.util;
    const d = u.el('div', 'desk-icon ' + kind, parent);
    const box = u.el('div', 'desk-box', d);
    const svg = u.svg('svg', {viewBox:'0 0 48 48', 'aria-hidden':'true'}, box);
    if (kind === 'doc') {
      u.svg('path', {d:'M11 6h21l9 9v29H11Z', fill:'#d4d4d4', stroke:'#111', 'stroke-width':1.5}, svg);
      u.svg('path', {d:'M32 6v9h9M13 8v34', fill:'none', stroke:'#fff'}, svg);
      for (const [y,w] of [[12,11],[19,21],[24,18],[29,22],[34,15],[39,21]]) u.svg('path', {d:`M15 ${y}h${w}`, stroke:'#333', 'stroke-width':1}, svg);
    } else if (kind === 'cab') {
      u.svg('path', {d:'M7 17l5-9h26l5 9v25H7Z', fill:'#aaa', stroke:'#111', 'stroke-width':1.3}, svg);
      u.svg('path', {d:'M8 17h34M8 29h34M8 18v10h34M8 30v11h34M13 9h24', fill:'none', stroke:'#eee', 'stroke-width':1}, svg);
      u.svg('path', {d:'M7 29h36', stroke:'#111'}, svg);
      for (const y of [21,34]) u.svg('rect', {x:20,y,width:9,height:3,fill:'#d6d6d6',stroke:'#333'}, svg);
    } else {
      u.svg('path', {d:'M6 12h12l3 4h20v25H6Z', fill:'#999', stroke:'#111', 'stroke-width':1.2}, svg);
      u.svg('path', {d:'M6 18h36v24H6Z', fill:'#bdbdbd', stroke:'#111', 'stroke-width':1.2}, svg);
      u.svg('path', {d:'M7 19h34M7 20v21M7 13h10', fill:'none', stroke:'#eee'}, svg);
    }
    u.el('div', 'desk-label', d, label);
  }
  function trash(parent) {
    const u = env.util;
    const d = u.el('div', 'trash', parent);
    const svg = u.svg('svg', {viewBox:'0 0 40 48', 'aria-hidden':'true'}, d);
    u.svg('path', {d:'M8 14h24l-3 30H11Z', fill:'#bdbdbd', stroke:'#222', 'stroke-width':1.6}, svg);
    u.svg('ellipse', {cx:20, cy:12, rx:14, ry:4, fill:'#e0e0e0', stroke:'#222', 'stroke-width':1.6}, svg);
    for (const x of [15, 20, 25]) u.svg('path', {d:`M${x} 17v24`, stroke:'#555'}, svg);
    u.el('div', 'desk-label', d, 'Trash');
  }
  function landscape(parent) {
    const u = env.util;
    const photo = u.el('img', 'preview-photo', parent);
    photo.src = 'sites/design-set-slider-horizontal-05/assets/preview-source.webp';
    photo.alt = 'Grayscale mountain, lake and evergreen forest';
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Notice', promo:'ImageLab', banner:'Service notice'}[ctx.kind];
    const bar = u.el('div', 'dlg-bar', el);
    const x = u.el('button', 'survey-x', bar, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('span', '', bar, title);
    const body = u.el('div', 'dlg-body', el);
    if (ctx.kind === 'chat') {
      u.el('p', 'survey-intro', body, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', body, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', body, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', body);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding tools', 'Image quality', 'Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', body, {cookie:'ImageLab can remember your display preferences.', toast:'The image is ready for editing.', promo:'Discover more adjustment tools.', banner:'Adjustments are available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, ctx.kind === 'chat' ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  // Route the template's controls into the inspector's existing chrome.
  function placeTools(container, c, endClass) {
    for (const node of [...container.children]) {
      if (node.dataset.role === 'submit') {
        node.className = endClass;
        (endClass === 'end-toolbar' ? c.bar : c.actions).append(node);
      } else {
        node.className = 'nx-utility';
        c.utilityTools.append(node);
      }
    }
    container.remove();
  }

  const gray = { bg: '#bdbdbd', panel: '#c6c6c6', fg: '#111', muted: '#444', line: '#888' };
  env.site({
    name: 'design-set-slider-horizontal-05',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { light: gray, dark: gray, warm: gray },
      LOW_THEME: gray,
      ACCENTS: ['#383838'],
      LOW_ACCENTS: ['#383838'],
      parts: {
        'frame.theme': (base) => (c) => {
          base(c);
          document.body.className = `nx instruction-${c.ctx.display}`;
        },
        'frame.header': () => (c) => {
          const u = c.util;
          const menu = u.el('header', 'menubar', document.body);
          const logo = u.svg('svg', {viewBox:'0 0 24 24', class:'logo', 'aria-hidden':'true'}, menu);
          u.svg('path', {d:'M12 1L21 6L22 18L12 23L3 18L2 7Z', fill:'#171717',stroke:'#111'}, logo);
          u.svg('path', {d:'M12 1L13 12L22 18M13 12L3 18M3 7L13 12L21 6M6 7l5-3 5 3-5 3ZM6 11l1 5 3 2-1-6M16 11l3-2 1 7-3 2M10 4l1 3 4-1M5 8l3 1', stroke:'#aaa', 'stroke-width':.8,fill:'none'}, logo);
          u.el('b', 'app', menu, 'ImageLab');
          for (const m of ['File', 'Edit', 'Image', 'View', 'Window', 'Help']) u.el('span', 'mi', menu, m);
          u.el('span', 'clock', menu, 'Mon Apr 12   10:24 AM');

          const win = u.el('section', 'win', document.body);
          const bar = u.el('div', 'titlebar', win);
          u.el('span', 'closebox', bar, '✕');
          u.el('span', '', bar, 'Image Adjustments — workshop_01.tif');
          const body = u.el('div', 'win-body', win);
          const side = u.el('nav', 'side', body);
          const sh = u.el('div', 'side-head', side);
          u.el('span', 'tri', sh, '▼');
          u.el('span', '', sh, 'Adjustments');
          ITEMS.forEach(label => {
            const row = u.el('div', 'side-item' + (label === 'Contrast' ? ' sel' : ''), side);
            folder(row);
            u.el('span', '', row, label);
          });
          const utilityTools = u.el('div', 'nx-utilities', side);
          const pane = u.el('div', 'pane', body);
          const actions = u.el('div', 'actions', pane);
          const reset = u.el('button', 'reset', actions, 'Reset');
          reset.type = 'button';
          reset.dataset.action = 'reset';
          Object.assign(c, { bar, body: pane, header: pane, actions, utilityTools });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (c) => {
          base(c);
          const instruction = c.header.querySelector('.ref-instruction');
          if (instruction) instruction.className = 'instruction';
        },
        'frame.tools': (base) => (c) => {
          base(c);
          placeTools(c.headerTools, c, 'end-toolbar');
        },
        // The inspector body and its fixed sidebar were built with the title bar.
        'frame.body': () => () => {},
        'frame.panel': (base) => (c) => {
          base(c);
          const panel = c.body.querySelector('.ref-panel');
          if (panel) panel.className = 'instruction nx-panel';
        },
        'frame.stage': () => (c) => {
          const u = c.util;
          const stage = u.el('main', 'record-stage', c.body);
          stage.dataset.role = 'stage';
          const desc = u.el('div', 'desc', c.body);
          u.el('div', 'adjustment-description', desc, 'Drag the handle to adjust the image.');
          u.el('div', 'adjustment-help', desc, 'Current values are shown beside each slider.');

          const icons = u.el('div', 'desk-icons', document.body);
          deskIcon(icons, 'Workspace', 'folder');
          deskIcon(icons, 'Images', 'cab');
          deskIcon(icons, 'Preferences', 'doc');
          trash(document.body);
          const preview = u.el('section', 'preview', document.body);
          const bar = u.el('div', 'titlebar small', preview);
          u.el('span', 'closebox', bar, '✕');
          u.el('span', '', bar, 'Preview');
          landscape(u.el('div', 'pv-body', preview));
          c.stage = stage;
        },
        'frame.toast': (base) => (c) => {
          base(c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.className = 'instruction';
            note.querySelector('button').className = 'instruction-close';
            c.body.append(note);
          }
        },
        'frame.footer': (base) => (c) => {
          base(c);
          const footer = document.querySelector('.ref-foot');
          if (footer) {
            placeTools(footer.querySelector('.ref-tools'), c, c.placement === 'link' ? 'end-link' : 'primary');
            footer.remove();
          }
        },
        'frame.floating': (base) => (c) => {
          base(c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) placeTools(dock, c, 'primary');
        },
        // This overlay is drawn in the same square, grayscale window style.
        overlay: () => drawOverlay,
      },
    },
  });
})();
