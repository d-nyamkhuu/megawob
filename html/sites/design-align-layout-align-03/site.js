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
      if (kind === 'banner') el.style.top = (document.querySelector('.ref-task').getBoundingClientRect().bottom + 5) + 'px';
      if (kind === 'promo') {
        const icon = util.el('div', 'kde-news-icon', box);
        icon.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="7" y="19" width="50" height="34" rx="3"/><path d="m9 22 23 18 23-18M9 51l17-15M55 51 38 36M32 9V2M17 12l-5-6M47 12l5-6"/></svg>';
        util.el('h2', 'kde-news-title', box, 'Stay in the know');
        const close = util.el('button', 'kde-news-close', box, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'kde-news-email', box);
        email.type = 'email';
        email.placeholder = 'Your email address';
        email.setAttribute('aria-label', 'Your email address');
      }
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const noteIcon = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><path d="M7 3h12l7 7v19H7zM19 3v8h7M11 16h11M11 21h11M11 26h7"/></svg>';
      const addNoteIcon = (parent) => {
        const icon = util.el('span', 'kde-note-icon', parent);
        icon.innerHTML = noteIcon;
        icon.setAttribute('aria-hidden', 'true');
      };
      header.classList.add('mac-titlebar');
      const appIcon = util.el('span', 'mac-title-icon', header);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 18 2-12h3l2 12M12 5h3l3 13M9 9v9"/></svg>';
      util.el('span', 'mac-app-name', header, 'Layout Canvas');
      const winControls = util.el('div', 'mac-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
      const menu = util.el('nav', 'mac-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Arrange', 'Window', 'Help']) {
        const entry = util.el('span', '', menu, item);
        entry.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'mac-toolbar', document.body);
      for (const [icon, label] of [['▯', 'New'], ['📂', 'Open'], ['✂', 'Cut'], ['▧', 'Copy'], ['▣', 'Paste'], ['T', 'Text'], ['□', 'Box'], ['▧', 'Image'], ['↔', 'Align'], ['⇆', 'Distribute']]) {
        const tool = util.el('div', 'mac-tool', toolbar);
        util.el('span', 'mac-tool-icon', tool, icon);
        util.el('span', 'mac-tool-label', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { addNoteIcon, appIcon, header, menu, noteIcon, toolbar, winControls });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { addNoteIcon, ctx, display, header, util } = _c;
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', header);
        addNoteIcon(note);
        util.el('span', 'kde-instruction-text', note, ctx.instruction);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter, winControls } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      header.appendChild(winControls);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const assets = util.el('aside', 'mac-assets', body);
      const tabs = util.el('div', 'mac-tabs', assets);
      util.el('b', '', tabs, 'Assets');
      util.el('span', '', tabs, 'Styles');
      util.el('span', '', tabs, 'Layers');
      util.el('div', 'mac-select', assets, 'All Assets　 ▾');
      for (const [i, label] of ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'].entries()) {
        const row = util.el('div', `mac-asset${i === 0 ? ' selected' : ''}`, assets);
        util.el('span', `mac-thumb thumb-${i + 1}`, row);
        util.el('span', '', row, label);
      }
      util.el('div', 'mac-divider', assets);
      for (const [shape, label] of [['▰', 'Rectangle'], ['⬭', 'Oval'], ['★', 'Star'], ['―', 'Line']]) {
        const row = util.el('div', 'mac-shape', assets);
        util.el('span', '', row, shape);
        util.el('span', '', row, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { assets, body, tabs });
    },
    'frame.panel': (base, S) => function (_c) {
      const { addNoteIcon, body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        addNoteIcon(panel);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const stageWindow = util.el('div', 'mac-stage-window', stage);
      util.el('div', 'mac-stage-head', stageWindow, '▤　Untitled Layout');
      util.el('div', 'mac-canvas-host', stageWindow);
      const tips = util.el('aside', 'mac-tips mac-stats', body);
      util.el('h2', '', tips, 'Items');
      for (const [label, color] of [['Project Brief', 'blue'], ['Design Assets', 'green'], ['Team', 'yellow'], ['Schedule', 'red']]) {
        const row = util.el('section', 'mac-stat-row', tips);
        util.el('span', `mac-stat-swatch ${color}`, row);
        util.el('span', 'mac-stat-label', row, label);
        util.el('span', 'mac-stat-count', row, '1');
      }
      const total = util.el('div', 'mac-stat-total-row', tips);
      util.el('span', 'mac-stat-total-label', total, 'Total');
      util.el('span', 'mac-stat-total', total, '4');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, stageWindow, tips, total });
    },
    'frame.toast': (base, S) => function (_c) {
      const { addNoteIcon, closeLabel, ctx, display, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        addNoteIcon(note);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
    },
  };

  env.site({
    name: 'design-align-layout-align-03',
    template: 'site/base',
    design: { parts },
  });
})();
