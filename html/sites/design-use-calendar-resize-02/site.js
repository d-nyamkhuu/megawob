// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    dark: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    warm: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
  };

  const LOW_THEME = { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' };

  const LOW_ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      // Keep the reference design's single-purpose desktop window. Draw the same
      // variation values as the shared site, but do not add dashboard navigation.
      const sidebarPick = roomy && rng.bool(0.35);
      const sidebar = false;
      const navPick = W >= 1180 && rng.bool(0.5);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navPick, placement, sidebar, sidebarPick, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, navPick, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || navPick) {
        rng.pick(TITLES);
        if (word) lr.pick(K.brand);
      }
      const brand = util.el('div', 'ref-brand', header, 'Team Scheduler');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('nav', 'qt-menu', body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Actions', 'Help']) util.el('span', '', menu, item);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, menu });
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
      const tabs = util.el('nav', 'qt-tabs', body);
      for (const item of ['Week', 'Month', 'Team', 'Resources']) {
        const tab = util.el('span', item === 'Week' ? 'qt-tab qt-tab-active' : 'qt-tab', tabs, item);
      }
      Object.assign(_c, { tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const records = util.el('section', 'qt-records', body);
      util.el('div', 'qt-record-title', records, 'Events for this week');
      const table = util.el('div', 'qt-table', records);
      for (const label of ['Date', 'Start', 'End', 'Title', 'Attendees', 'Location']) util.el('span', 'qt-th', table, label);
      const sampleRows = [
        ['Mon 4/21/2003', '9:00', '10:00', 'Project sync', 'Alex Chen, Dana Kim', 'Conference Room A'],
        ['Mon 4/21/2003', '11:00', '11:30', 'Budget review', 'Brooke Taylor, Evan Park', 'Room B'],
        ['Mon 4/21/2003', '14:00', '15:00', 'Client call', 'Chris Rivera', 'Phone'],
        ['Tue 4/22/2003', '10:00', '11:00', 'Design discussion', 'Alex Chen, Brooke Taylor', 'Room C'],
        ['Tue 4/22/2003', '13:00', '14:00', 'Marketing update', 'Dana Kim', 'Room A'],
        ['Wed 4/23/2003', '9:30', '10:30', 'Product demo', 'Team', 'Main Lab'],
        ['Wed 4/23/2003', '15:00', '16:00', '1:1 meeting', 'Alex Chen', 'Room B'],
      ];
      for (const row of sampleRows) for (const cell of row) util.el('span', 'qt-cell', table, cell);
      Object.assign(_c, { records, sampleRows, stage, table });
    },
  };

  env.site({
    name: 'design-use-calendar-resize-02',
    template: 'site/base',
    design: { THEMES, LOW_THEME, LOW_ACCENTS, ACCENTS, parts },
  });
})();
