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
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'cookie' || kind === 'chat' || kind === 'promo') {
        const titles = { cookie: 'We use cookies', chat: 'Need help?', promo: 'Get the latest updates' };
        util.el('strong', 'fleet-overlay-title', box, titles[kind]);
      }
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
      if (kind === 'chat') {
        const compose = util.el('div', 'fleet-chat-compose', el);
        const input = util.el('input', '', compose);
        input.type = 'text'; input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Message support');
        const send = util.el('button', '', compose, '➤');
        send.type = 'button'; send.setAttribute('aria-label', 'Send message');
        send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
      }
      if (kind === 'promo') {
        const email = util.el('input', 'fleet-overlay-email', box);
        email.type = 'text'; email.placeholder = 'Your email address'; email.setAttribute('aria-label', 'Email address');
        box.insertBefore(email, row);
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
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
      util.el('span', 'dispatch-mark', identity, '▣');
      util.el('strong', 'dispatch-company', identity, 'Fleet Dispatch Console');
      util.el('span', 'dispatch-title', identity, '');
      util.el('span', 'dispatch-date', identity, '');
      const search = util.el('div', 'dispatch-search', header);
      util.el('span', '', search, '⌕');
      util.el('span', 'dispatch-search-label', search, 'Search jobs, drivers, addresses…');
      util.el('span', 'dispatch-bell', header, '♧');
      util.el('span', 'dispatch-profile', header, 'LM  ⌄');
      util.el('div', 'dispatch-window-controls', header, '−　□　×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, identity, search });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const menu = util.el('nav', 'dispatch-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Dispatch', 'Tools', 'Reports', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'dispatch-toolbar', document.body);
      const actions = [
        ['file', 'New Plan'], ['folder', 'Open'], ['refresh', 'Refresh'], ['truck', 'Auto Assign'], ['clear', 'Clear Assignments'],
        ['zoom-in', 'Zoom In'], ['zoom-out', 'Zoom Out'], ['print', 'Print'],
      ];
      const iconPaths = {
        file: ['M5 2h11l4 4v16H5zM16 2v5h4', '#f8fcff', '#4681a6'],
        folder: ['M2 6h8l2 3h10l-4 12H2zM2 9V5h8l2 3', '#e5c47c', '#90713b'],
        refresh: ['M20 9a8 8 0 0 0-14-4L3 9m0-6v6h6M4 15a8 8 0 0 0 14 4l3-4m0 6v-6h-6', 'none', '#417dab'],
        truck: ['M2 5h13v12H2zM15 9h5l3 5v3h-8M5 17a2 2 0 1 0 4 0m8 0a2 2 0 1 0 4 0', '#84b2d5', '#426783'],
        clear: ['m5 4 7 7 7-7 2 2-7 7 7 7-2 2-7-7-7 7-2-2 7-7-7-7z', '#dc6959', '#9b4b3f'],
        'zoom-in': ['M17 16l6 6M19 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0M7 10h8m-4-4v8', '#e3f0f3', '#48738c'],
        'zoom-out': ['M17 16l6 6M19 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0', '#e3f0f3', '#48738c'],
        print: ['M6 2h12v6H6zM3 9h18v10H3zM6 15h12v7H6zM6 11h2', '#afc5d3', '#55748b'],
      };
      const actionGroup = util.el('div', 'dispatch-actions', toolbar);
      for (const [icon, label] of actions) {
        const b = util.el('button', 'dispatch-action', actionGroup);
        b.type = 'button';
        const mark = util.el('span', 'dispatch-action-icon', b);
        const svg = util.svg('svg', { viewBox: '0 0 26 26', width: 25, height: 25, 'aria-hidden': 'true' }, mark);
        const [d, fill, stroke] = iconPaths[icon];
        util.svg('path', { d, fill, stroke, 'stroke-width': icon === 'clear' ? 1 : 1.7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
        util.el('span', '', b, label);
      }
      const metadata = util.el('div', 'dispatch-metadata', toolbar);
      util.el('span', '', metadata, 'Dispatch Ref:');
      util.el('strong', '', metadata, 'DSP-2024-04-18-A');
      util.el('span', '', metadata, 'Date:');
      util.el('strong', '', metadata, 'Thu 18 Apr 2024');
      Object.assign(_c, { actionGroup, actions, iconPaths, menu, metadata, toolbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      toolbar.appendChild(headerTools);
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) toolbar.after(instruction);
      Object.assign(_c, { headerTools, instruction, submit });
    },
    'frame.toast': (base, S) => function (_c) {
      const { body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      const summary = util.el('section', 'dispatch-summary', body);
      util.el('h2', '', summary, 'Dispatch Summary');
      const metrics = util.el('div', 'dispatch-metrics', summary);
      for (const [label, value] of [['Total Deliveries', '8'], ['Assigned', '0'], ['Unassigned', '8'], ['Total Weight', '4,400 kg'], ['Total Volume', '30 m³']]) {
        const item = util.el('div', '', metrics); util.el('span', '', item, label); util.el('strong', '', item, value);
      }
      const sidePanel = util.el('aside', 'dispatch-sidebar', body);
      const panel = (title, cls) => {
        const box = util.el('section', `dispatch-panel ${cls}`, sidePanel);
        util.el('h2', '', box, title);
        return box;
      };
      const overview = panel('Dispatch Overview', 'dispatch-overview');
      const overviewRows = [['Dispatch Ref:', 'DSP-2024-04-18-A'], ['Date:', 'Thu 18 Apr 2024'], ['Drivers:', '3'],
        ['Deliveries:', '8'], ['Assigned:', '0'], ['Unassigned:', '8'], ['Total Weight:', '4,400 kg'], ['Total Volume:', '30 m³']];
      const ovTable = util.el('div', 'dispatch-overview-rows', overview);
      for (const [k, v] of overviewRows) { const row = util.el('div', '', ovTable); util.el('span', '', row, k); util.el('strong', '', row, v); }
      const drivers = panel('Drivers', 'dispatch-drivers');
      const dtable = util.el('table', '', drivers);
      const dhead = util.el('tr', '', util.el('thead', '', dtable));
      for (const c of ['Name', 'Vehicle', 'Capacity (kg / m³)', 'Work Window']) util.el('th', '', dhead, c);
      const db = util.el('tbody', '', dtable);
      const deliveries = panel('Deliveries (8)', 'dispatch-deliveries');
      const ttable = util.el('table', '', deliveries);
      const thead = util.el('tr', '', util.el('thead', '', ttable));
      for (const c of ['ID', 'Customer', 'Address', 'Weight (kg)', 'Volume (m³)', 'Window']) util.el('th', '', thead, c);
      const tbody = util.el('tbody', '', ttable);
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', sidePanel);
        sidePanel.prepend(note);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
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
      Object.assign(_c, { db, deliveries, dhead, drivers, dtable, metrics, ovTable, overview, overviewRows, panel, sidePanel, submit, summary, tbody, thead, ttable });
    },
    'frame.footer': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-board-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
