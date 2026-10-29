(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-tictactoe-06' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const endR = ctx.rng.fork('chrome/end'),
        place = endR.pick(['action', 'action', 'action', 'header', 'log']),
        endPool = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(endPool) && endPool.length
            ? endPool
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
        choice = endR.pick(labels),
        label = String((choice && choice.label) || (choice && choice.text) || choice);
      document.body.className = 'industrial instruction-' + ctx.display + ' end-' + place;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'app-mark', top, '▧');
      u.el('span', 'app-title', top, 'Calibrix 1.2.0  -  Sensor Calibration Utility');
      const wc = u.el('div', 'native-window-controls', top);
      [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ].forEach(([x, label]) => u.el('span', 'window-control', wc, x).setAttribute('aria-label', label));
      const menu = u.el('nav', 'menu', app, 'File    Edit    Tools    Help');
      const workspace = u.el('div', 'workspace', app),
        rail = u.el('aside', 'command-rail', workspace);
      [
        ['◎', 'Calibrate'],
        ['▥', 'Sensors'],
        ['▤', 'Profiles'],
        ['▱', 'Diagnostics'],
        ['⚙', 'Settings'],
      ].forEach(([icon, label], i) => {
        const item = u.el('div', 'rail-item' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'rail-icon', item, icon);
        u.el('span', '', item, label);
      });
      const exit = u.el('div', 'rail-item rail-exit', rail);
      u.el('span', 'rail-icon', exit, '⇥');
      u.el('span', '', exit, 'Exit');
      const work = u.el('section', 'workbench', workspace),
        meta = u.el('header', 'system-status', work);
      u.el('strong', '', meta, 'Calibration Task');
      u.el(
        'span',
        'system-readout',
        meta,
        'System: LX-300   |   Mode: Manual   |   User: operator   |   2004-11-03 14:27',
      );
      const brief = u.el('div', 'brief', work, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', work),
        log = u.el('section', 'log-panel', work);
      const logTitle = u.el('div', 'log-title', log, 'Log');
      const logbody = u.el('div', 'log-body', log);
      u.el('div', '', logbody, '[14:27:01]  Calibration utility ready.');
      u.el('div', '', logbody, '[14:27:03]  Game initialized. X to move.');
      u.el('div', '', logbody, '[14:27:03]  Board state recorded.');
      const footer = u.el('footer', 'bottom', work);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit chrome-end', footer, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = labels
          .map((x) => String((x && x.label) || (x && x.text) || x))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = collideR.pick(options),
            where = place === 'header' ? 'log' : place === 'log' ? 'header' : collideR.pick(['header', 'log']),
            parent = where === 'header' ? menu : logTitle,
            b = u.el('button', 'chrome-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
