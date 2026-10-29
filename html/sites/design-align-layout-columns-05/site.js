// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const art = `<svg viewBox="0 0 320 270" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow"><stop stop-color="#7778ad"/><stop offset="1" stop-color="#1b1e38"/></radialGradient><linearGradient id="front" x2="1" y2="1"><stop stop-color="#e2dff2"/><stop offset=".5" stop-color="#a6a3c5"/><stop offset="1" stop-color="#555572"/></linearGradient><linearGradient id="side"><stop stop-color="#8585b2"/><stop offset="1" stop-color="#22243f"/></linearGradient><linearGradient id="top" x2=".8" y2="1"><stop stop-color="#d5d2e7"/><stop offset="1" stop-color="#6d6b91"/></linearGradient></defs><path fill="url(#glow)" d="M0 0h320v270H0z"/><g opacity=".55" fill="#aaa4df"><path d="M16 17h23v38H16zm27 0h17v17H43zm0 21h17v17H43z"/><text x="75" y="43" font-size="29" font-family="Arial,sans-serif" letter-spacing="4">IRIS</text></g><ellipse cx="175" cy="225" rx="105" ry="21" fill="#15172a" opacity=".45"/><path d="M79 93l87-29 82 15-58 30z" fill="url(#top)"/><path d="M190 109l58-30v121l-58 33z" fill="url(#side)"/><path d="M79 93l111 16v124L79 213z" fill="#23233f"/><path d="M82 96l45 7v116l-45-9z" fill="url(#front)"/><path d="M135 105l44 7v54l-44-7zM135 165l44 8v54l-44-8z" fill="url(#front)"/><path d="M81 94l49 8m5 1l47 7" stroke="#edeaf7" stroke-width="2"/><path d="M192 112v117" stroke="#3e3c62" stroke-width="3"/></svg>`;
  const dockArt = [
    '<path d="M13 9l25 1 8 6-27 1z" fill="#e7e5f1"/><path d="M13 10v34l26 5V16z" fill="#aaa9c1"/><path d="M39 16l7-2v29l-7 6z" fill="#555872"/><path d="M16 19l18 2v10l-18-2zm0 15l18 2v8l-18-2z" fill="#777c97"/><path d="M20 23l9 1m-9 15l9 1" stroke="#eef0f5" stroke-width="2"/>',
    '<path d="M28 5L5 40l25 12 22-13z" fill="#c0c2d7"/><path d="M28 5l2 47 22-13z" fill="#555a79"/><path d="M28 5L5 40l25 12z" fill="#a6abc3"/><path d="M28 5l2 47" stroke="#e9e8f3"/>',
    '<defs><radialGradient id="orb" cx=".3" cy=".2"><stop stop-color="#eeecff"/><stop offset=".35" stop-color="#a6a5d1"/><stop offset=".8" stop-color="#4a4b7d"/><stop offset="1" stop-color="#252946"/></radialGradient></defs><circle cx="29" cy="29" r="23" fill="url(#orb)"/>',
    '<path d="M5 7h48v43H5z" fill="#424269"/><path d="M8 10h42v35H8z" fill="#6f6d9d"/><path d="M7 30h8l7-15 10 25 8-24 7 14h6" fill="none" stroke="#e1ddff" stroke-width="1.4"/>',
    '<path d="M39 6c-10-3-20 6-16 17L6 43c-5 6 3 13 8 8l19-20c11 3 21-7 17-17l-9 10-9-7z" fill="#9b92c9"/><path d="M39 6c-10-3-20 6-16 17L6 43c-5 6 3 13 8 8l19-20c11 3 21-7 17-17" fill="none" stroke="#e1d9ff" stroke-width="2"/><circle cx="11" cy="46" r="2" fill="#292a46"/>',
  ].map((shape) => `<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><g stroke="#161c34" stroke-width="1.2" stroke-linejoin="round">${shape}</g></svg>`);

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'lc-titlebar', document.body);
      util.el('span', 'lc-appicon', titlebar, 'Ⅱ');
      util.el('strong', '', titlebar, 'Queue Manager');
      const winbuttons = util.el('div', 'lc-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
      const menubar = util.el('div', 'lc-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Queue', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const dock = util.el('nav', 'lc-dock', document.body);
      for (const [i, label] of ['Queues', 'Assets', 'Render', 'Monitor', 'Preferences'].entries()) {
        const item = util.el('div', 'lc-dock-item', dock);
        util.el('span', 'lc-dock-icon', item).innerHTML = dockArt[i];
        util.el('span', '', item, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, winbuttons });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'lc-tabs', header);
      for (const [i, item] of ['Layout', 'Elements', 'Styles', 'Preview', 'Settings'].entries()) {
        const tab = util.el('span', `lc-tab${i === 0 ? ' selected' : ''}`, tabs, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, tabs });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        body.classList.add('lc-has-panel');
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const stats = util.el('div', 'lc-stats', body);
      const mark = util.el('div', 'lc-brand-mark', stats);
      mark.innerHTML = art;
      for (const [index, [heading, details]] of [
        ['Render Queue', [['Project', 'Harbor'], ['Scene', 'dock_view'], ['Output Path', '/projects/harbor/renders/'], ['Format', 'RGBA 1280 x 720'], ['Owner', 'jchen'], ['Priority', 'Normal']]],
        ['Queue Status', [['Total Jobs', '12'], ['Pending', '6'], ['Rendering', '3'], ['Completed', '3'], ['Failed', '0']]],
      ].entries()) {
        const cell = util.el('section', `lc-stat lc-stat-${index}`, stats);
        util.el('h2', '', cell, heading);
        for (const [key, val] of details) {
          const line = util.el('div', 'lc-detail', cell);
          util.el('span', '', line, `${key}:`);
          util.el('b', '', line, val);
        }
      }
      util.el('div', 'lc-preview', stats).setAttribute('role', 'img');
      Object.assign(_c, { stats });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'center';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-align-layout-columns-05',
    template: 'site/base',
    design: { parts },
  });
})();
