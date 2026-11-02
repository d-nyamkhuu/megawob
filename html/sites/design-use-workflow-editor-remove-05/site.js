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
      root.style.setProperty('--bg', '#c3c6cb');
      root.style.setProperty('--panel', '#c3c6cb');
      root.style.setProperty('--fg', '#111111');
      root.style.setProperty('--muted', '#444a52');
      root.style.setProperty('--line', '#8e939c');
      root.style.setProperty('--accent', '#0d6b78');
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
      util.el('strong', 'irix-title', frame, 'Relayboard - Workflow Editor');
      const win = util.el('div', 'irix-window-controls', frame);
      for (const label of ['_', '□', '×']) util.el('button', 'irix-winbtn', win, label);
      const menu = util.el('nav', 'irix-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Workflow', 'Tools', 'Window', 'Help']) util.el('span', 'irix-menuitem', menu, label);
      const tabs = util.el('nav', 'irix-tabs', document.body);
      for (const [i, [icon, label]] of [['⊞', 'Workflows'], ['⚡', 'Integrations'], ['⛁', 'Data'], ['◷', 'Schedules'], ['▤', 'Activity'], ['⚙', 'Settings']].entries()) {
        const tab = util.el('button', i === 0 ? 'irix-tab active' : 'irix-tab', tabs);
        tab.type = 'button';
        util.el('span', 'irix-rail-icon', tab, icon);
        util.el('span', 'irix-rail-label', tab, label);
      }
      Object.assign(_c, { collide, cr, decoys, frame, label, menu, nav, placement, sidebar, tabs, wantFooter, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      // The reference workstation: a framed sub-window (component palette beside the canvas) and a workflow index.
      // These are site frame; the workflow itself remains owned by the use-workflow-editor widget.
      const row = util.el('div', 'irix-row', body);
      const sub = util.el('section', 'irix-subwin', row);
      util.el('div', 'irix-subwin-title', sub, 'Workflow: New Lead Process');
      const palette = util.el('aside', 'irix-palette', sub);
      util.el('div', 'irix-panel-title', palette, 'Components');
      const shelves = [['⚡', 'Trigger'], ['⚙', 'Action'], ['◇', 'Condition'], ['⛁', 'Data'], ['✉', 'Notification'], ['▤', 'Transform'], ['◷', 'Delay'], ['▦', 'Note']];
      for (const [icon, text] of shelves) {
        const item = util.el('div', 'irix-tool', palette);
        util.el('span', 'irix-tool-icon', item, icon);
        util.el('span', 'irix-tool-label', item, text);
      }
      const stage = util.el('main', 'ref-stage', sub);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'irix-help', row);
      util.el('div', 'irix-panel-title', help, 'Workflows');
      const table = util.el('div', 'irix-table', help);
      const head = util.el('div', 'irix-table-head', table);
      util.el('span', 'irix-col-name', head, 'Name');
      util.el('span', 'irix-col-mod', head, 'Modified');
      const rows = [['New Lead Process', 'Mar 12, 1994'], ['Customer Onboarding', 'Mar 10, 1994'], ['Support Escalation', 'Mar 08, 1994'], ['Renewal Reminder', 'Feb 28, 1994'], ['Trial to Paid', 'Feb 20, 1994'], ['Event Follow Up', 'Feb 15, 1994'], ['Partner Registration', 'Jan 30, 1994'], ['Data Cleanup', 'Jan 22, 1994'], ['Inactive User Alert', 'Jan 18, 1994'], ['Win Back Campaign', 'Jan 12, 1994']];
      for (const [i, [name, date]] of rows.entries()) {
        const tr = util.el('div', i === 0 ? 'irix-trow active' : 'irix-trow', table);
        util.el('span', 'irix-col-name', tr, name);
        util.el('span', 'irix-col-mod', tr, date);
      }
      const det = util.el('section', 'irix-details', help);
      util.el('div', 'irix-details-title', det, 'New Lead Process');
      for (const [k, v] of [['Description', 'Process and route new sales leads from web forms.'], ['Modified', 'Mar 12, 1994  2:14 PM'], ['Created', 'Mar 01, 1994  9:03 AM'], ['Owner', 'Sales Operations'], ['Steps', '7'], ['Connections', '6']]) {
        const f = util.el('div', 'irix-field', det);
        util.el('span', 'irix-field-key', f, k);
        util.el('span', 'irix-field-val', f, v);
      }
      Object.assign(_c, { help, palette, stage, shelves });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-remove-05',
    template: 'site/base',
    design: { parts },
  });
})();
