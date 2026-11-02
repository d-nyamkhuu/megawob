// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // Fixed workstation palette: keep the original draws above for seed stability.
      root.style.setProperty('--bg', '#aeb4c0');
      root.style.setProperty('--panel', '#c4c8d1');
      root.style.setProperty('--fg', '#111626');
      root.style.setProperty('--muted', '#3b4050');
      root.style.setProperty('--line', '#697183');
      root.style.setProperty('--accent', '#6955bd');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
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
      const frame = util.el('div', 'irix-titlebar', document.body);
      util.el('span', 'irix-menu-glyph', frame, '≡');
      util.el('strong', 'irix-title', frame, 'Relayboard');
      const win = util.el('div', 'irix-window-controls', frame);
      for (const label of ['−', 'T', '×']) util.el('button', 'irix-winbtn', win, label);
      const menu = util.el('nav', 'irix-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Workflow', 'Node', 'Tools', 'Help']) util.el('span', 'irix-menuitem', menu, label);
      const tabs = util.el('nav', 'irix-tabs', document.body);
      for (const [i, label] of ['New', 'Open', 'Undo', 'Redo', 'Align', 'Zoom', 'Run'].entries()) {
        const icons = ['▢', '📂', '↶', '↷', '☷', '⌕', '▶'];
        const tab = util.el('button', i === 0 ? 'irix-tab active' : 'irix-tab', tabs, `${icons[i]}  ${label}`);
        tab.type = 'button';
      }
      Object.assign(_c, { collide, cr, decoys, frame, label, menu, nav, placement, sidebar, tabs, wantFooter, win });
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
      const palette = util.el('aside', 'rb-palette', body);
      util.el('h2', 'rb-palette-title', palette, 'Steps');
      const search = util.el('div', 'rb-search', palette);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search steps...');
      const paletteGroup = (title, rows) => {
        const group = util.el('section', 'rb-palette-group', palette);
        util.el('h3', '', group, title);
        for (const [icon, name, tone] of rows) {
          const row = util.el('div', 'rb-palette-row', group);
          util.el('span', `rb-step-icon ${tone}`, row, icon);
          util.el('span', '', row, name);
        }
      };
      paletteGroup('Most Used', [['▶','Trigger','green'],['⚙','Action','blue'],['◆','Condition','orange'],['◷','Delay','purple'],['☷','Transform','blue'],['✉','Send','red']]);
      paletteGroup('All Steps', [['▤','Data','purple'],['▱','Files','gold'],['◆','Logic','orange'],['✉','Communication','red'],['▦','Apps','blue'],['◷','Date & Time','purple'],['↔','Flow Control','gray'],['⚒','Advanced','gray']]);
      Object.assign(_c, { palette, paletteGroup, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'rb-summary', body);
      util.el('h2', 'rb-summary-title', summary, 'Workflow Summary');
      const summaryRow = (icon, count, label, tone) => {
        const row = util.el('div', `rb-summary-row ${tone}`, summary);
        util.el('span', 'rb-summary-icon', row, icon);
        util.el('strong', '', row, count);
        util.el('span', '', row, label);
      };
      summaryRow('▢', '6', 'Nodes', 'neutral');
      summaryRow('➜', '6', 'Connections', 'neutral');
      summaryRow('▶', '1', 'Trigger', 'green');
      summaryRow('⚙', '2', 'Actions', 'blue');
      summaryRow('◆', '1', 'Condition', 'orange');
      summaryRow('◷', '1', 'Delay', 'purple');
      summaryRow('✉', '1', 'Send', 'red');
      Object.assign(_c, { stage, summary, summaryRow });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-remove-03',
    template: 'site/base',
    design: { parts },
  });
})();
