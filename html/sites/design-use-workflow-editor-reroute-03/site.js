// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'banner' || kind === 'promo') {
        const heading = document.querySelector('.relay-editor-head');
        if (heading) el.style.top = heading.getBoundingClientRect().bottom + 4 + 'px';
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 760;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, navDraw, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('relay-header');
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Relayboard');
        brand.dataset.role = 'brand';
        const desktopControls = util.el('div', 'gem-desktop-controls', brand);
        for (const glyph of ['−','□','×']) util.el('span', '', desktopControls, glyph);
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Workflows', 'Library', 'Connections', 'Logs', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n);
          const glyphs = {
            Workflows: '<path d="M16 7v9M7 25v-9h18v9"/><rect x="12" y="2" width="8" height="7"/><rect x="3" y="24" width="8" height="7"/><rect x="21" y="24" width="8" height="7"/>',
            Library: '<path d="M16 5Q11 1 3 3v25q8-2 13 2 5-4 13-2V3q-8-2-13 2v25M7 8h5M7 13h5M7 18h5M21 8h4M21 13h4M21 18h4"/>',
            Connections: '<path d="m12 21-3 3a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 0m4 1 3-3a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7 0m-5-1 11-11"/>',
            Logs: '<path d="M4 2h24v28H4zM8 8h16M8 14h16M8 20h16M8 25h16"/>',
            Settings: '<path d="m13 2 6 0 1 5 4 2 4-1 3 5-4 3v4l3 3-3 5-5-1-3 2-1 4h-6l-1-4-4-2-4 1-3-5 4-3v-4l-4-3 3-5 5 1 3-2z" fill="#111"/><circle cx="16" cy="17" r="5" fill="#eee"/>',
          };
          const icon = util.el('span', 'gem-nav-icon', a);
          icon.innerHTML = '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.4">' + glyphs[item] + '</svg>';
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'relay-search', header, '⌕　Search workflows...');
      util.el('div', 'relay-bell', header, '♟');
      util.el('div', 'relay-avatar', header, 'JD');
      Object.assign(_c, { search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body relay-layout', document.body);
      // The GEM desktop design keeps the editor floating over a quiet application
      // desktop, with its own compact help window at the right.
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, header, util } = _c;
      const editor = util.el('section', 'relay-editor', body);
      const edhead = util.el('div', 'relay-editor-head', editor);
      util.el('span', 'relay-app-icon', edhead, '⌘');
      const edtitle = util.el('div', 'relay-title', edhead);
      util.el('b', '', edtitle, 'Workflow Editor — Request Processing');
      util.el('span', '', edtitle, 'Last updated today at 10:24 AM');
      const windowTools = util.el('div', 'relay-controls', edhead);
      util.el('span', 'gem-window-button', windowTools, '−');
      util.el('span', 'gem-window-button', windowTools, '×');
      if (display === 'header') {
        const note = header.querySelector('.ref-instruction');
        if (note) { edhead.appendChild(note); edhead.classList.add('gem-has-instruction'); }
      }
      const toolrow = util.el('div', 'relay-toolrow', editor, 'Workflows　　Runs');
      const stage = util.el('main', 'ref-stage', editor);
      const canvasTools = util.el('div', 'relay-canvas-tools', editor);
      util.el('strong', '', canvasTools, 'Canvas Controls');
      const toolGroup = util.el('div', 'relay-canvas-buttons', canvasTools);
      const toolPaths = [
        '<path d="M6 3v25l6-7 6 10 5-3-6-10 10-1z" fill="currentColor" stroke="none"/>',
        '<path d="M10 17V8a2 2 0 0 1 4 0v9V5a2 2 0 0 1 4 0v12V7a2 2 0 0 1 4 0v11V11a2 2 0 0 1 4 0v12l-6 8H11L4 20a2 2 0 0 1 3-3l3 3"/>',
        '<circle cx="13" cy="13" r="9"/><path d="m20 20 11 11M8 13h10"/>',
        '<circle cx="13" cy="13" r="9"/><path d="m20 20 11 11M8 13h10M13 8v10"/>',
      ];
      for (const [i, path] of toolPaths.entries()) {
        const b = util.el('button', 'canvas-tool-button', toolGroup); b.type = 'button';
        b.title = ['Pointer', 'Hand tool', 'Zoom out', 'Zoom in'][i];
        b.innerHTML = '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">' + path + '</svg>';
      }
      util.el('span', 'canvas-tool-separator', toolGroup, '');
      util.el('span', 'canvas-tool-label', toolGroup, 'Arrange:');
      const alignPaths = ['M5 4v26M9 8h14v6H9zM9 20h20v6H9z','M17 3v28M10 8h14v6H10zM6 20h22v6H6z','M29 4v26M10 8h15v6H10zM5 20h20v6H5z','M4 5h26M8 9h6v20H8zM21 9h6v14h-6z','M4 17h26M8 7h6v19H8zM21 11h6v11h-6z','M4 29h26M8 16h6v9H8zM21 6h6v19h-6z'];
      for (const [i, path] of alignPaths.entries()) {
        const b = util.el('button', 'canvas-tool-button canvas-align', toolGroup); b.type = 'button';
        b.title = ['Align left','Align center','Align right','Align top','Align middle','Align bottom'][i];
        b.innerHTML = '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.2"><path d="' + path + '"/></svg>';
      }
      for (const label of ['Grid:', 'Snap:']) {
        const check = util.el('label', 'canvas-check', toolGroup, label);
        util.el('span', 'gem-checkbox', check, '✓');
      }
      const stats = util.el('aside', 'relay-stats', body);
      if (display === 'panel') {
        const note = body.querySelector('.ref-panel');
        if (note) {
          const sideColumn = util.el('div', 'gem-help-column', body);
          sideColumn.appendChild(note); sideColumn.appendChild(stats);
        }
        body.classList.remove('ref-panel-right');
      }
      util.el('strong', 'help-window-title', stats, 'Help & Tips');
      util.el('p', 'help-copy', stats, 'Build workflows by adding steps from the palette and connecting their ports.');
      util.el('b', 'help-subhead', stats, 'Tips:');
      const tips = ['Drag from an output port to an input port to create a connection.', 'Use the Arrange buttons to tidy your workflow.', 'Enable Snap to keep connections aligned.', 'You can pan with the hand tool and use the mouse wheel to zoom.'];
      for (const tip of tips) util.el('div', 'help-tip', stats, tip);
      util.el('b', 'help-subhead help-legend-title', stats, 'Legend:');
      for (const [symbol, label] of [['step','Step'],['connection','Connection'],['output','Output port'],['input','Input port']]) {
        const row = util.el('div', 'help-legend', stats); util.el('span', 'gem-legend-'+symbol, row); util.el('span', '', row, label);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { alignPaths, canvasTools, edhead, editor, edtitle, stage, stats, tips, toolGroup, toolPaths, toolrow, windowTools });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-workflow-editor-reroute-03',
    template: 'site/base',
    design: { parts },
  });
})();
