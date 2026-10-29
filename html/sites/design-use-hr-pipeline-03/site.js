// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
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

        // Industrial desktop frame: native title strip, menu row and application tabs.
        const winbar = util.el('div', 'hr-windowbar', document.body);
        util.el('span', 'hr-window-icon', winbar, '▣');
        util.el('strong', 'hr-window-title', winbar, 'PeopleOps 2.4.1  -  Recruiting');
        const sys = util.el('div', 'hr-window-controls', winbar);
        for (const mark of ['—', '□', '×']) util.el('span', '', sys, mark);
        const menu = util.el('div', 'hr-menubar', document.body);
        for (const label of ['File', 'Edit', 'View', 'Go', 'Tools', 'Reports', 'Help'])
          util.el('span', '', menu, label);
        const tabs = util.el('nav', 'hr-tabs', document.body);
        util.el('span', 'hr-brand-mark', tabs, '✿');
        util.el('strong', 'hr-brand-name', tabs, 'PeopleOps');
        const tabLabels = ['Home', 'Recruiting', 'People', 'Time Off', 'Reports', 'Settings'];
        for (let i = 0; i < tabLabels.length; i++) {
          const tab = util.el('div', i === 1 ? 'hr-tab hr-tab-active' : 'hr-tab', tabs, tabLabels[i]);
        }
        util.el('span', 'hr-org', tabs, 'Acme Instruments　 |　 People Operations');
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          menu,
          nav,
          placement,
          sidebar,
          sys,
          tabLabels,
          tabs,
          wantFooter,
          winbar,
        });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const guide = util.el('aside', 'hr-board-guide', body);
        util.el('h3', '', guide, '♙  Hiring Board Help');
        util.el(
          'p',
          '',
          guide,
          'Candidates in the Screening column have been evaluated against the screening policy below. Drag a candidate to the next stage when they meet all criteria.',
        );
        util.el('hr', '', guide);
        util.el('strong', '', guide, 'Card information');
        for (const [value, label] of [
          ['Initials', 'Candidate name'],
          ['5 yrs', 'Years of relevant experience'],
          ['Python, …', 'Key skills'],
          ['88', 'Interview score (out of 100)'],
          ['•••', 'More actions'],
        ]) {
          const row = util.el('div', 'hr-guide-row', guide);
          util.el('b', '', row, value);
          util.el('span', '', row, label);
        }
        util.el('hr', '', guide);
        util.el('strong', '', guide, 'Stage guide');
        for (const [color, label, detail] of [
          ['#8eb8ff', 'Screening', 'Initial review using the policy below'],
          ['#ffd668', 'Interview', 'Phone or video interview'],
          ['#bd86ff', 'Onsite', 'Onsite interviews'],
          ['#78c98d', 'Offer', 'Offer and approvals'],
          ['#83d9c2', 'Hired', 'Accepted and onboarding'],
        ]) {
          const row = util.el('div', 'hr-guide-row hr-guide-stage', guide);
          const dot = util.el('i', '', row);
          dot.style.background = color;
          util.el('b', '', row, label);
          util.el('span', '', row, detail);
        }
        Object.assign(_c, { guide, stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const statusbar = util.el('div', 'hr-statusbar', document.body);
        util.el('span', '', statusbar, '6 candidates　 |　 0 in next stage');
        util.el('span', '', statusbar, 'REQ-1042　 |　 Engineering　 |　 Open　 |　 Updated: Mar 05, 2004 10:24');
        Object.assign(_c, { statusbar, submit });
      },
  };

  env.site({
    name: 'design-use-hr-pipeline-03',
    template: 'site/base',
    design: { parts },
  });
})();
