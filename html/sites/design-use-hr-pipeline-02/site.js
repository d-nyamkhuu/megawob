// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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

      // Industrial desktop frame: native title strip, menu row and application tabs.
      const winbar = util.el('div', 'hr-windowbar', document.body);
      util.el('span', 'hr-window-icon', winbar, '▣');
      util.el('strong', 'hr-window-title', winbar, 'PeopleOps 2.4.1  -  Recruiting');
      const sys = util.el('div', 'hr-window-controls', winbar);
      for (const mark of ['—', '□', '×']) util.el('span', '', sys, mark);
      const menu = util.el('div', 'hr-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Tools', 'Reports', 'Help']) util.el('span', '', menu, label);
      const controls = util.el('div', 'hr-global-controls', menu);
      const searchbox = util.el('div', 'hr-global-search', controls);
      util.el('span', '', searchbox, '⌕');
      const searchInput = util.el('input', '', searchbox);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search candidates, jobs or employees…';
      util.el('span', 'hr-global-bell', controls, '♟');
      util.el('span', 'hr-global-avatar', controls, 'JD');
      util.el('span', 'hr-global-chevron', controls, '⌄');
      const tabs = util.el('nav', 'hr-tabs', document.body);
      const tabLabels = ['▦  Dashboard', '▤  Requisitions', '♟  Candidates', '▣  Hiring Pipeline', '♙  Employees', '◷  Leave', '▤  Reporting', '⚙  Administration'];
      for (let i = 0; i < tabLabels.length; i++) {
        const tab = util.el('div', i === 3 ? 'hr-tab hr-tab-active' : 'hr-tab', tabs, tabLabels[i]);
      }
      util.el('span', 'hr-org', tabs, 'Acme Instruments　 |　 People Operations');
      Object.assign(_c, { collide, controls, cr, decoys, label, menu, nav, placement, searchInput, searchbox, sidebar, sys, tabLabels, tabs, wantFooter, winbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const recruit = util.el('aside', 'ref-side hr-recruit-side', body);
      util.el('div', 'hr-recruit-home', recruit, '⌂　 Home');
      util.el('div', 'hr-recruit-section', recruit, '♟　 Recruiting　⌃');
      for (const item of ['Jobs', 'Candidates', 'Pipeline', 'Interviews', 'Offers']) {
        const row = util.el('div', item === 'Candidates' ? 'hr-recruit-link selected' : 'hr-recruit-link', recruit, item);
      }
      for (const item of ['♟　 Employees　⌄', '▦　 Time Off　⌄', '▥　 Reports　⌄', '⚙　 Administration　⌄']) {
        util.el('div', 'hr-recruit-section', recruit, item);
      }
      const summary = util.el('section', 'hr-recruit-summary', recruit);
      util.el('strong', '', summary, 'Recruiting Summary');
      util.el('span', '', summary, 'This Job　⌄');
      for (const [label, value, color] of [['Total Candidates', '6', ''], ['In Screening', '6', '#0874d1'], ['Phone Screen', '0', '#239b55'], ['Onsite Interview', '0', '#e88618'], ['Offer', '0', '#8751c5'], ['Hired', '0', '#1b9c98'], ['Rejected', '0', '#d62828']]) {
        const row = util.el('div', 'hr-recruit-stat', summary);
        util.el('span', '', row, label);
        const val = util.el('b', '', row, value);
        if (color) val.style.color = color;
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, recruit, summary });
    },
    'frame.floating': (base, S) => function (_c) {
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
    name: 'design-use-hr-pipeline-02',
    template: 'site/base',
    design: { parts },
  });
})();
