// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
    dark: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
    warm: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#29271f', muted: '#746d5e', line: '#d9cfbb' },
  };

  const ACCENTS = ['#a67d35', '#8d7347', '#9b875f', '#7e7653', '#a8874d', '#8c7b56'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner') document.querySelector('.dispatch-subtitle').after(el);
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instruction = display;
      document.body.classList.toggle('win-finish', !!ctx.finish);
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = true;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const identity = util.el('div', 'dispatch-identity', header);
      const mark = util.el('span', 'dispatch-mark', identity);
      mark.innerHTML = '<svg viewBox="0 0 48 30" width="34" height="27" fill="white" stroke="navy" stroke-width="1.5"><path d="M2 5h29v18H2zM31 11h9l6 8v4H31z"/><path d="M33 12h6l4 6H33z" fill="navy"/><circle cx="10" cy="24" r="4"/><circle cx="37" cy="24" r="4"/></svg>';
      util.el('strong', 'dispatch-company', identity, 'Fleet Dispatch');
      util.el('span', 'dispatch-title', identity, 'Dispatch Plan');
      util.el('span', 'dispatch-date', identity, 'Thu, Apr 24, 2025');
      const search = util.el('div', 'dispatch-search', header);
      util.el('span', '', search, '⌕');
      util.el('span', 'dispatch-search-label', search, 'Search jobs, drivers, addresses…');
      util.el('span', 'dispatch-bell', header, '♧');
      util.el('span', 'dispatch-profile', header, 'LM  ⌄');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, identity, mark, search });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const controls = (parent) => {
        const group = util.el('div', 'win-window-controls', parent);
        for (const symbol of ['_', '□', '×']) util.el('span', '', group, symbol);
        group.setAttribute('aria-hidden', 'true');
      };
      controls(header);
      Object.assign(_c, { controls, headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, controls, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const subtitle = util.el('div', 'dispatch-subtitle', body);
      util.el('strong', '', subtitle, 'Daily Deliveries');
      const headerNote = header.querySelector('.ref-instruction');
      if (headerNote) subtitle.appendChild(headerNote);
      controls(subtitle);
      const panels = util.el('aside', 'dispatch-sidepanels', body);
      util.el('div', 'dispatch-side-spacer', panels);
      const detail = util.el('section', 'dispatch-panel dispatch-detail-panel', panels);
      util.el('div', 'dispatch-panel-head', detail, 'Delivery Details');
      util.el('div', 'dispatch-detail-copy', detail, 'Select a delivery from the list to see details here.');
      const help = util.el('section', 'dispatch-panel dispatch-help-panel', panels);
      const panelNote = body.querySelector('.ref-panel');
      if (panelNote) panels.insertBefore(panelNote, help);
      util.el('div', 'dispatch-panel-head', help, 'Legend / Help');
      const helpCopy = util.el('div', 'dispatch-help-copy', help);
      util.el('p', '', helpCopy, 'Drag a delivery to a driver to assign it. Order stops by dragging within a driver’s list.');
      util.el('p', '', helpCopy, 'Keep total weight within the truck capacity and deliver within each driver’s work window.');
      const legend = util.el('div', 'dispatch-legend', help);
      for (const [label, color] of [['Hospital / Medical','#f26767'],['Electronics','#ffd83d'],['Food / Grocery','#46aef0'],['Furniture','#79d968'],['Appliances','#ff9c51'],['Books','#ad7aef'],['Hardware','#39c8d8'],['General Supplies','#d5ae4e']]) {
        const row = util.el('div', 'dispatch-legend-row', legend);
        util.el('span', 'dispatch-swatch', row).style.background = color;
        util.el('span', '', row, label);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { detail, headerNote, help, helpCopy, legend, panelNote, panels, stage, subtitle });
    },
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, header, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        header.after(note);
      }
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const dockNav = util.el('nav', 'dispatch-dock-nav', foot);
        for (const item of ['Dispatch', 'Jobs', 'Drivers', 'Vehicles', 'Reports', 'Settings', 'Help']) {
          util.el('span', item === 'Dispatch' ? 'active' : '', dockNav, item);
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
    'frame.footer': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-board-03',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
