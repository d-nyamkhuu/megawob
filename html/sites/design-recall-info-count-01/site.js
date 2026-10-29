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
      const rail = util.el('aside', 'flash-rail', body);
      util.el('div', 'flash-logo', rail, 'HelpDesk\nPro');
      const navItems = [['▤', 'Tickets'], ['♟', 'Customers'], ['▥', 'Reports'], ['◧', 'Knowledge Base'], ['⚙', 'Settings']];
      for (const [icon, title] of navItems) {
        const item = util.el('div', `flash-navitem${title === 'Tickets' ? ' selected' : ''}`, rail);
        util.el('span', 'flash-navicon', item, icon);
        util.el('span', '', item, title);
      }
      const summary = util.el('section', 'flash-summary', stage);
      const metrics = [
        ['▤', 'Total Tickets', '48', 'blue'], ['◷', 'Open', '34', 'blue'],
        ['✓', 'Resolved', '12', 'green'], ['!', 'On Hold', '2', 'orange'],
      ];
      for (const [icon, title, value, color] of metrics) {
        const metric = util.el('div', `flash-metric ${color}`, summary);
        util.el('span', 'flash-metric-icon', metric, icon);
        const label = util.el('div', 'flash-metric-label', metric);
        util.el('b', '', label, title);
        util.el('strong', '', label, value);
      }
      const help = util.el('aside', 'flash-help', body);
      const helpHead = util.el('div', 'flash-help-head', help);
      util.el('span', 'flash-help-q', helpHead, '?');
      util.el('b', '', helpHead, 'Help');
      const helpGroups = [
        ['▤', 'Tickets', 'Each row is a support ticket.'],
        ['♟', 'Assigned To', 'Shows who is handling the ticket.'],
      ];
      for (const [icon, title, copy] of helpGroups) {
        const group = util.el('div', 'flash-help-group', help);
        util.el('span', 'flash-help-icon', group, icon);
        const text = util.el('div', '', group);
        util.el('b', '', text, title);
        util.el('span', '', text, copy);
      }
      const legend = util.el('div', 'flash-legend', help);
      util.el('b', '', legend, 'Status');
      for (const [color, label] of [['orange', 'Open'], ['green', 'Resolved'], ['blue', 'On Hold']]) {
        const row = util.el('div', 'flash-legend-row', legend);
        util.el('i', color, row);
        util.el('span', '', row, label);
      }
      Object.assign(_c, { help, helpGroups, helpHead, legend, metrics, navItems, rail, stage, summary });
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
    name: 'design-recall-info-count-01',
    template: 'site/base',
    design: { parts },
  });
})();
