// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#1e252a', panel: '#dce1e5', fg: '#101c2a', muted: '#5c6670', line: '#adb8c1' },
    dark: { bg: '#1e252a', panel: '#dce1e5', fg: '#101c2a', muted: '#5c6670', line: '#adb8c1' },
    warm: { bg: '#1e252a', panel: '#dce1e5', fg: '#101c2a', muted: '#5c6670', line: '#adb8c1' },
  };

  const ACCENTS = ['#1689d1', '#1689d1', '#1689d1', '#1689d1', '#1689d1', '#1689d1'];

  const ICONS = {
    truck: '<path d="M2 5h23v16H2zM25 11h8l5 7v5H25z"/><path d="M28 13v5h7l-4-5z" fill="#20313d"/><circle cx="9" cy="23" r="3.5"/><circle cx="30" cy="23" r="3.5"/>',
    van: '<path d="M5 9h26l5 6v8H2v-8zM13 5h18v10H10z"/><circle cx="9" cy="23" r="3.5"/><circle cx="29" cy="23" r="3.5"/>',
    jobs: '<path d="M7 2h26v27H7z"/><path d="M12 8h16M12 14h16M12 20h13" fill="none" stroke="#35424b" stroke-width="3"/>',
    drivers: '<circle cx="14" cy="8" r="6"/><circle cx="29" cy="9" r="5"/><path d="M2 29V21c0-10 24-10 24 0v8zM28 29v-8c0-4-2-6-4-8 13-2 15 6 15 10v6z"/>',
    reports: '<path d="M3 18h7v12H3zM15 11h7v19h-7zM27 2h7v28h-7z"/>',
    box: '<path d="m5 9 15-7 15 7v17l-15 8-15-8z"/><path d="m5 9 15 8 15-8M20 17v17M12 6l16 8" fill="none" stroke="#e6eff5" stroke-width="1.8"/>',
    hand: '<path d="M12 15V5c0-4 5-4 5 0v8-11c0-3 5-3 5 0v11-9c0-3 5-3 5 0v10-6c0-3 5-3 5 0v15c0 12-19 15-24 4l-5-10c-2-5 3-7 6-2l3 5z"/>',
  };
  function icon(util, parent, name, cls) {
    const el = util.el('span', `desktop-symbol ${cls || ''}`, parent);
    el.innerHTML = `<svg viewBox="0 0 40 36" aria-hidden="true">${ICONS[name]}</svg>`;
    return el;
  }

  const parts = {
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
      const endStyle = rng.fork('carbon/end');
      if (!ctx.finish && endStyle.bool(0.5)) { label = 'Finish'; placement = 'header'; }
      if (placement === 'floating') placement = 'footer';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'desktop-titlebar', header);
      icon(util, titlebar, 'truck', 'desktop-appicon');
      util.el('strong', '', titlebar, 'FleetOps 2.4 – Dispatch Planner');
      const win = util.el('div', 'desktop-window-controls', titlebar);
      util.el('span', '', win, '−'); util.el('span', '', win, '□'); util.el('span', 'close', win, '×');
      const menu = util.el('nav', 'desktop-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', '', menu, item);
      const tabs = util.el('nav', 'desktop-tabs', header);
      for (const [symbol, item] of [['truck','Dispatch'],['van','Vehicles'],['jobs','Jobs'],['drivers','Drivers'],['reports','Reports']]) {
        const tab = util.el('span', item === 'Dispatch' ? 'active' : '', tabs);
        icon(util, tab, symbol); util.el('span', '', tab, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function(_c) {
      base(_c);
      _c.header.classList.toggle('carbon-has-instruction', _c.display === 'header');
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const summary = util.el('div', 'dispatch-summary', body);
      const metric = (label, value, cls) => {
        const cell = util.el('div', `dispatch-metric ${cls || ''}`.trim(), summary);
        util.el('span', 'dispatch-metric-label', cell, label);
        util.el('strong', 'dispatch-metric-value', cell, value);
      };
      metric('Dispatch Reference', 'DP-2024-06-17-A1', 'dispatch-ref');
      metric('Unassigned', '9', 'dispatch-unassigned');
      metric('Total Weight', '1,800 kg', 'dispatch-weight');
      metric('Total Volume', '18.0 m³', 'dispatch-volume');
      metric('Jobs', '9', 'dispatch-jobs');
      const sidecolumn = util.el('div', 'dispatch-sidecolumn', body);
      const help = util.el('aside', 'dispatch-help', body);
      util.el('h2', '', help, 'Job Card Information');
      const sample = util.el('div', 'help-card-sample', help);
      util.el('b', 'help-sample-id', sample, 'JX');
      icon(util, sample, 'box', 'help-sample-box');
      util.el('span', 'help-sample-copy', sample, 'Customer Name\nTime window\nWeight　Volume');
      util.el('p', '', help, 'Fields show the delivery location, required time window and load size for each job.');
      const vehicleHeading = util.el('h3', '', help); icon(util, vehicleHeading, 'truck');
      util.el('span', '', vehicleHeading, 'Vehicle Capacity');
      util.el('p', '', help, 'Each driver has a vehicle with maximum weight and volume capacity. Keep assigned load within these limits.');
      const dragHeading = util.el('h3', '', help); icon(util, dragHeading, 'hand');
      util.el('span', '', dragHeading, 'Drag and Drop');
      util.el('p', '', help, 'Drag jobs from the list to a driver’s lane. You can move jobs between drivers at any time.');
      util.el('h3', '', help, 'Colors');
      const colors = util.el('div', 'help-colors', help);
      for (const [c, name] of [['#58b9ed','Medical'],['#9aca67','Retail'],['#f4cf62','Education'],['#f08e9d','Food & Hospitality'],['#9a82dc','Business'],['#6abd9a','Healthcare'],['#f2a078','Residential'],['#bdc5cc','Other']]) {
        const row = util.el('div', '', colors); const swatch = util.el('i', '', row); swatch.style.background = c; util.el('span', '', row, name);
      }
      sidecolumn.appendChild(help);
      const panel = body.querySelector('.ref-panel'); if (panel) sidecolumn.appendChild(panel);
      Object.assign(_c, { metric, summary });
    },
    'frame.toast': (base, S) => function(_c) {
      base(_c);
      const note = document.querySelector('.ref-note'), side = document.querySelector('.dispatch-sidecolumn');
      if (note && side) side.appendChild(note);
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const dockNav = util.el('nav', 'dispatch-dock-nav', foot);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (placement !== 'footer' && placement !== 'link') {
          while (tools.firstChild) _c.headerTools.appendChild(tools.firstChild);
          foot.hidden = true;
        }
      }
      Object.assign(_c, { submit });
    },
    overlay: (base, S) => function(ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        result.el.style.setProperty('top', `${header.getBoundingClientRect().bottom}px`, 'important');
        result.el.classList.add('carbon-banner');
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-dispatch-board-05',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
