// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        // This design is the fixed enterprise Lightning palette; keep draws above stable.
        name = 'light';
        accent = '#1682ed';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.display = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Team Calendar');
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const help = util.el('aside', 'ref-help', body);
        util.el('h2', 'ref-help-title', help, 'Help & Legend');
        util.el('h3', 'ref-help-head', help, 'Using the calendar');
        util.el(
          'p',
          'ref-help-copy',
          help,
          'View team schedules by day, week or month. Drag to create a new event or move an existing one. Drag the top or bottom edge of an event to change its duration. Click an event to see details. Use the second time ruler to reference a different time zone.',
        );
        util.el('h3', 'ref-help-head', help, 'Event colors');
        const legend = util.el('div', 'ref-legend', help);
        for (const [c, t] of [
          ['#4d8ff0', 'Team meeting'],
          ['#35b85b', 'Project work'],
          ['#f3a51d', 'Client call'],
          ['#e34b67', 'Personal'],
          ['#8855db', 'Other'],
        ]) {
          const row = util.el('div', 'ref-legend-row', legend);
          const swatch = util.el('i', 'ref-swatch', row);
          swatch.style.background = c;
          util.el('span', '', row, t);
        }
        util.el('h3', 'ref-help-head', help, 'Time rulers');
        util.el(
          'p',
          'ref-help-copy',
          help,
          'The left ruler shows local time. The right ruler shows the selected UTC offset (UTC−03:30) for reference.',
        );
        util.el('h3', 'ref-help-head', help, 'Tips');
        const tips = util.el('ul', 'ref-tips', help);
        for (const t of [
          'Drag in an empty time slot to create an event.',
          'Drag the top or bottom edge to adjust duration.',
          'Move events to find a better time for the team.',
          'Use month view to check for other commitments.',
          'Events that don’t fit in a day show a “+ more” list in month view.',
        ])
          util.el('li', '', tips, t);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help, legend, tips });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, help, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          help.appendChild(panel);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
  };

  env.site({
    name: 'design-use-calendar-timezone-04',
    template: 'site/base',
    design: { parts },
  });
})();
