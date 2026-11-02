// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const win = util.el('div', 'outlook-titlebar', document.body);
      util.el('span', 'outlook-appicon', win, '▣');
      util.el('span', 'outlook-caption', win, 'Team Calendar');
      const winbuttons = util.el('span', 'outlook-windowbuttons', win);
      util.el('i', '', winbuttons, '−');
      util.el('i', '', winbuttons, '□');
      util.el('i', 'outlook-close', winbuttons, '×');
      const ribbon = util.el('div', 'outlook-ribbon', document.body);
      const tabs = util.el('div', 'outlook-tabs', ribbon);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', '', tabs, t);
      const actions = util.el('div', 'outlook-actions', ribbon);
      const groups = [
        ['Create', [['▧','New Event'],['▣','New Meeting']]],
        ['Edit', [['▤','Delete']]],
        ['Date', [['‹','Previous'],['','Today'],['›','Next']]],
        ['View', [['▦','Day'],['▤','Week'],['▦','Month']]],
        ['Team', [['♟','Add Attendees']]]
      ];
      groups.forEach((g) => {
        const group = util.el('div', 'outlook-group', actions);
        const items = util.el('div', 'outlook-group-items', group);
        g[1].forEach((it, i) => { const b = util.el('div', `outlook-action ${g[0] === 'Arrange' && i === 0 ? 'active' : ''}`, items); util.el('b', '', b, it[0]); util.el('span', '', b, it[1]); });
        util.el('small', '', group, g[0]);
      });
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, actions, display, groups, ribbon, roomy, tabs, tall, win, winbuttons });
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
      const summary = util.el('section', 'outlook-summary', document.body);
      util.el('span', 'outlook-summary-icon', summary, '▦');
      const summaryMain = util.el('div', 'outlook-summary-main', summary);
      util.el('div', 'outlook-summary-title', summaryMain, 'Scheduling Assistant');
      util.el('div', 'outlook-summary-subtitle', summaryMain, 'Day availability · Team calendar');
      const summaryFacts = util.el('div', 'outlook-summary-facts', summary);
      [['♟','Team availability'],['◷','Business hours'],['⌖','Meeting details']].forEach((x) => {
        const fact = util.el('div', 'outlook-summary-fact', summaryFacts);
        util.el('b', '', fact, x[0]); util.el('span', '', fact, x[1]);
      });
      Object.assign(_c, { headerTools, submit, summary, summaryFacts, summaryMain });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Re-widget event colors only; leave calendar lanes and interaction targets
      // untouched so the freeslot drag can begin anywhere in its destination lane.
      const laneColors = ['#cff0cf', '#ffcccc', '#decdff', '#c8e2ff'];
      const restyleWorkspace = () => {
        const sr = stage.getBoundingClientRect();
        if (!sr.width || !sr.height) return;
        const nodes = [...stage.querySelectorAll('*')];

        const cards = nodes.filter((node) => {
          const r = node.getBoundingClientRect();
          const fill = getComputedStyle(node).backgroundColor;
          return fill && fill !== 'rgba(0, 0, 0, 0)' && fill !== 'transparent' &&
            !/255,\s*255,\s*255/.test(fill) && r.width > sr.width * 0.07 && r.width < sr.width * 0.3 &&
            r.height > 28 && r.height < 130 && r.left > sr.left + sr.width * 0.22 &&
            r.top > sr.top + sr.height * 0.2 && r.bottom < sr.bottom - sr.height * 0.12;
        }).sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height -
          a.getBoundingClientRect().width * a.getBoundingClientRect().height);
        const centers = [];
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const cx = (r.left + r.right) / 2;
          if (!centers.some((x) => Math.abs(x - cx) < sr.width * 0.035)) centers.push(cx);
        }
        centers.sort((a, b) => a - b);
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const cx = (r.left + r.right) / 2;
          const index = Math.min(3, centers.findIndex((x) => Math.abs(x - cx) < sr.width * 0.035));
          const color = laneColors[Math.max(0, index)];
          const border = ['#58b66a', '#ed5757', '#8b5de8', '#4b9df2'][Math.max(0, index)];
          card.classList.add('site-calendar-event');
          card.style.setProperty('background', color, 'important');
          card.style.setProperty('background-image', 'none', 'important');
          card.style.setProperty('border-color', border, 'important');
          card.style.setProperty('color', '#10152a', 'important');
          for (const child of card.querySelectorAll('*')) {
            child.style.setProperty('background-color', color, 'important');
            child.style.setProperty('color', '#10152a', 'important');
          }
        }

        for (const node of nodes) {
          const r = node.getBoundingClientRect();
          if (r.left > sr.left + sr.width * 0.24 && r.width > sr.width * 0.1 &&
              r.width < sr.width * 0.38 && r.height >= 10 && r.height <= 23 &&
              r.top > sr.top + sr.height * 0.18 && r.bottom < sr.bottom - 20) {
            const border = getComputedStyle(node).borderBottomWidth;
            if (border && border !== '0px') node.style.setProperty('border-bottom-color', '#edf1f5', 'important');
          }
        }
      };
      restyleWorkspace();
      Object.assign(_c, { laneColors, restyleWorkspace, stage });
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
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const status = util.el('div', 'outlook-status', document.body);
      util.el('span', '', status, 'Items: 8');
      util.el('span', '', status, 'All folders are up to date.');
      util.el('span', '', status, 'Connected to: Microsoft Exchange');
      util.el('span', '', status, '100%　 −　━━━━━━━━　＋');
      Object.assign(_c, { status, submit });
    },
  };

  env.site({
    name: 'design-use-calendar-freeslot-02',
    template: 'site/base',
    design: { parts },
  });
})();
