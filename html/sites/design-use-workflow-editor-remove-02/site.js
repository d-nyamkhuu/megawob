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
      util.el('strong', 'irix-title', frame, 'Relayboard  -  Customer Support Flow');
      const win = util.el('div', 'irix-window-controls', frame);
      for (const label of ['−', 'T', '×']) util.el('button', 'irix-winbtn', win, label);
      const menu = util.el('nav', 'irix-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Workflow', 'Node', 'Window', 'Help']) util.el('span', 'irix-menuitem', menu, label);
      const tabs = util.el('nav', 'irix-tabs', document.body);
      for (const [i, label] of ['Workflows', 'Integrations', 'Schedules', 'Monitors', 'Library'].entries()) {
        const tab = util.el('button', i === 0 ? 'irix-tab active' : 'irix-tab', tabs, label);
        tab.type = 'button';
      }
      Object.assign(_c, { collide, cr, decoys, frame, label, menu, nav, placement, sidebar, tabs, wantFooter, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { display, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.toggle('relay-has-header-note', display === 'header');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, label, placement, stage, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // 2008 Relayboard shell: keep the editor stage and its task wiring, replace only
      // the inherited workstation frame with the reference's two-column page.
      document.querySelectorAll('.irix-titlebar,.irix-menubar,.irix-tabs,.ref-side').forEach((n) => n.remove());
      const appbar = util.el('div', 'relay-topbar', document.body);
      const brand = util.el('strong', 'relay-brand', appbar, 'Relayboard');
      const product = util.el('span', 'relay-product', appbar, 'Workflow Editor');
      const links = util.el('div', 'relay-links', appbar);
      for (const text of ['Help', 'Preferences', 'Sign Out']) util.el('span', 'relay-link', links, text);
      header.classList.add('relay-task-header');
      appbar.appendChild(header);
      const workflowIndex = util.el('aside', 'relay-index', body);
      body.insertBefore(workflowIndex, stage);
      const indexHead = util.el('div', 'relay-index-head', workflowIndex);
      util.el('span', 'relay-index-title', indexHead, 'Workflows');
      const newFlow = util.el('a', 'relay-new', indexHead, 'New Workflow');
      newFlow.href = '#';
      newFlow.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'new-workflow' }); });
      const list = util.el('div', 'relay-list', workflowIndex);
      const tableHead = util.el('div', 'relay-row relay-row-head', list);
      util.el('span', '', tableHead, 'Name');
      util.el('span', '', tableHead, 'Last Modified');
      const rows = ['Order Processing', 'Customer Onboarding', 'Support Escalation', 'Lead Nurturing',
        'Invoice Generation', 'User Registration', 'Event Reminder', 'Feedback Management',
        'Product Update Alerts', 'Trial Expiration', 'Account Cleanup', 'Monthly Report'];
      const dates = ['Apr 22, 2008 10:14 AM', 'Apr 20, 2008 3:18 PM', 'Apr 18, 2008 9:03 AM',
        'Apr 16, 2008 2:52 PM', 'Apr 14, 2008 4:11 PM', 'Apr 11, 2008 11:36 AM',
        'Apr 9, 2008 2:17 PM', 'Apr 7, 2008 10:01 AM', 'Apr 4, 2008 5:23 PM',
        'Apr 2, 2008 9:42 AM', 'Mar 30, 2008 3:08 PM', 'Mar 28, 2008 11:55 AM'];
      rows.forEach((name, i) => {
        const row = util.el('div', `relay-row${i === 0 ? ' selected' : ''}`, list);
        util.el('span', 'relay-row-name', row, `▤　${name}`); util.el('span', 'relay-row-date', row, dates[i]);
      });
      if (display === 'panel') {
        const notePanel = document.querySelector('.ref-panel');
        if (notePanel) { notePanel.classList.add('relay-panel'); workflowIndex.appendChild(notePanel); }
      }
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('relay-instruction');
      const tools = header.querySelector('.ref-tools');
      if (tools) tools.classList.add('relay-tools');
      header.querySelectorAll('.ref-spacer').forEach((n) => n.remove());
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      Object.assign(_c, { appbar, brand, dates, indexHead, instruction, links, list, newFlow, product, rows, submit, tableHead, tools, workflowIndex });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-remove-02',
    template: 'site/base',
    design: { parts },
  });
})();
