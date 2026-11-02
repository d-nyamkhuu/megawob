// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      // The design has a persistent related-record index and a tab strip.
      const showIndex = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, showIndex, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { ctx, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'pf-titlebar', header);
      util.el('div', 'ref-brand', titlebar, '◢  PulseForge');
      util.el('div', 'pf-account', titlebar, 'Acme Studio  ﹀');
      util.el('div', 'pf-avatar', titlebar, 'JD');
      const menubar = util.el('nav', 'pf-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Run', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'pf-toolbar', header);
      const toolsNav = util.el('nav', 'ref-nav', toolbar);
      const toolItems = [['‹/›','Code'], ['▷','Build'], ['⬡','Deploy'], ['▤','Logs'], ['◉','Database'], ['⚑','Feature Flags'], ['•••','More']];
      for (const [icon, item] of toolItems) {
        const a = util.el('a', 'ref-navlink', toolsNav);
        util.el('b', 'pf-tool-icon', a, icon); util.el('span', '', a, item);
        if (item === 'Feature Flags') a.classList.add('active');
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      if (display === 'header') util.el('div', 'ref-instruction', toolbar, ctx.instruction);
      Object.assign(_c, { header, menubar, titlebar, toolItems, toolbar, toolsNav });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools pf-header-tools', toolbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'pf-rail', body);
      util.el('div', 'pf-rail-heading', rail, 'WORKSPACE');
      for (const [icon, text] of [['◆','Overview'], ['‹/›','Code'], ['⑂','Pull Requests'], ['◉','CI / CD'], ['⬡','Deployments'], ['⚑','Feature Flags'], ['⬢','Environments'], ['⌁','Monitoring'], ['☷','Logs'], ['▤','Database'], ['⚙','Settings']]) {
        const item = util.el('div', `pf-rail-item${text === 'Feature Flags' ? ' active' : ''}`, rail);
        util.el('span', 'pf-rail-icon', item, icon); util.el('span', '', item, text);
      }
      const project = util.el('div', 'pf-rail-project', rail);
      util.el('small', '', project, 'Project');
      util.el('strong', '', project, 'Acme Web App');
      util.el('span', '', project, '⌄');
      const stats = util.el('section', 'pf-stats', body);
      for (const [icon, value, label, tone] of [['⚑','28','Total flags',''], ['●','18','Enabled','green'], ['●','7','Disabled','gray'], ['◷','3','Modified (7d)','']]) {
        const item = util.el('div', 'pf-stat', stats);
        util.el('span', `pf-stat-icon ${tone}`, item, icon);
        const copy = util.el('div', '', item);
        util.el('strong', '', copy, value); util.el('span', '', copy, label);
      }
      Object.assign(_c, { body, project, rail, stats });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-dev-tools-flag-04',
    template: 'site/base',
    design: { parts },
  });
})();
