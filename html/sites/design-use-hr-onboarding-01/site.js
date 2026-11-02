// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Atari ST desktop strip; the task window itself is the existing page frame.
      const desk = util.el('div', 'gem-menubar', document.body);
      util.el('span', 'gem-mark', desk, '♟');
      for (const item of ['Desk', 'File', 'Edit', 'View', 'Records', 'Help']) util.el('span', 'gem-menu-item', desk, item);
      const clock = util.el('span', 'gem-clock', desk, 'Mon  2 Jun 1986 10:24');
      util.el('span', 'gem-status-icon', desk, '▣');
      util.el('span', 'gem-status-icon', desk, '▤');
      Object.assign(_c, { H, W, clock, desk, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'gem-window-title', header);
      util.el('span', 'gem-window-icon', windowTitle, '▦');
      util.el('strong', '', windowTitle, 'People Operations - New Hire Setup');
      const windowControls = util.el('span', 'gem-window-controls', windowTitle, '－  □  ×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const hires = util.el('aside', 'gem-hires', body);
      util.el('div', 'gem-hires-title', hires, 'New Hires');
      // Decorative records and selection are independent of the episode's goal.
      const records = [['New hire record', 'Offer Accepted'],
        ['Candidate record', 'Offer Accepted'], ['Candidate record', 'Reference Check'],
        ['Candidate record', 'Interview'], ['Candidate record', 'Offer Accepted'],
        ['Candidate record', 'Interview'], ['Candidate record', 'Offer Accepted'],
        ['Candidate record', 'Reference Check']];
      for (let i = 0; i < records.length; i++) {
        const row = util.el('div', `gem-hire${i === 0 ? ' selected' : ''}`, hires);
        util.el('strong', '', row, records[i][0]);
        util.el('span', '', row, records[i][1]);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, hires, records });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-hr-onboarding-01',
    template: 'site/base',
    design: { parts },
  });
})();
