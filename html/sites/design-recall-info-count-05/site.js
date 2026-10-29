// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.display = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tabs = util.el('nav', 'plain-tabs', body);
      for (const [label, active] of [['Tickets', true], ['People', false], ['Records', false], ['Reports', false]]) {
        const tab = util.el('div', `plain-tab${active ? ' active' : ''}`, tabs, label);
      }
      const side = util.el('aside', 'ticket-status', stage);
      util.el('h2', '', side, 'Ticket Status');
      for (const [label, value] of [['Open','38'], ['In Progress','7'], ['On Hold','4'], ['Closed','11']]) {
        const row = util.el('div', 'status-row', side);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      util.el('hr', 'status-rule', side);
      Object.assign(_c, { stage, tabs, side });
    },
    'frame.toast': (base, S) => function (_c) {
      const { body, closeLabel, ctx, display, stage, util } = _c;
      if (display !== 'toast') return;
      // The note and stage share a column, so neither can cover the other.
      const stack = util.el('div', 'flash-stage-stack', body);
      stack.appendChild(stage);
      const note = util.el('div', 'ref-note flash-stage-note', stack);
      util.el('div', 'ref-note-text', note, ctx.instruction);
      const close = util.el('button', 'ref-note-x', note, '×');
      close.type = 'button';
      close.setAttribute('aria-label', closeLabel);
      close.addEventListener('click', () => {
        note.style.visibility = 'hidden';
        env.log('note-close');
      });
    },
  };

  env.site({
    name: 'design-recall-info-count-05',
    template: 'site/base',
    design: { parts },
  });
})();
