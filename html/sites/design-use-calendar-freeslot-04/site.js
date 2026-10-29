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
      util.el('span', 'outlook-caption', win, 'Team Scheduler');
      const winbuttons = util.el('span', 'outlook-windowbuttons', win);
      util.el('i', '', winbuttons, '−');
      util.el('i', '', winbuttons, '□');
      util.el('i', 'outlook-close', winbuttons, '×');
      const ribbon = util.el('div', 'outlook-ribbon', document.body);
      const tabs = util.el('div', 'outlook-tabs', ribbon);
      for (const t of ['File', 'Home', 'Send / Receive', 'Folder', 'View']) util.el('span', t === 'Home' ? 'selected' : '', tabs, t);
      const actions = util.el('div', 'outlook-actions', ribbon);
      const groups = [
        ['New', [['▧','New Appointment'],['▣','New Meeting'],['▤','New Items']]],
        ['Go To', [['➜','Today'],['▦','Next 7 Days']]],
        ['Arrange', [['▦','Day'],['▤','Work Week'],['▦','Week'],['▦','Month'],['▧','Schedule View']]],
        ['Manage', [['＋','Open Calendar'],['✎','Calendar Groups']]],
        ['Share', [['✉','E-mail Calendar'],['♟','Share Calendar'],['◉','Publish Online']]],
        ['Find', [['','Find a Contact'],['▤','Address Book']]]
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
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter, win, winbuttons } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display !== 'header') win.insertBefore(headerTools, winbuttons);
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
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, ctx, display, util } = _c;
      const records = util.el('section', 'legacy-records', document.body);
      util.el('strong', 'legacy-records-title', records, 'Team Events – Mon, Nov 8, 2027');
      const recordTable = util.el('div', 'legacy-records-table', records);
      const recordHead = util.el('div', 'legacy-record-row legacy-record-head', recordTable);
      util.el('span', '', recordHead, 'Time');
      util.el('span', '', recordHead, 'Title');
      const recordOne = util.el('div', 'legacy-record-row', recordTable);
      util.el('span', '', recordOne, '09:00');
      util.el('span', '', recordOne, 'Design review');
      const recordTwo = util.el('div', 'legacy-record-row legacy-record-wide', recordTable);
      util.el('span', '', recordTwo, '10:30');
      util.el('span', '', recordTwo, 'Product sync　　11:00　1:1 Yuna / Kai　　13:00　Marketing update　　14:00　Engineering triage　　15:30　Client call　　16:00　Roadmap planning');
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        document.body.insertBefore(note, records);
      }
      Object.assign(_c, { recordHead, recordOne, recordTable, recordTwo, records });
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
    name: 'design-use-calendar-freeslot-04',
    template: 'site/base',
    design: { parts },
  });
})();
