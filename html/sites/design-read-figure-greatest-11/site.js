(function () {
  'use strict';
  const C = { site: 'design-read-figure-greatest-11', task: 'read-figure', scenario: 'greatest' };
  env.site({
    name: C.site,
    styles: ['site.css', 'aqua.css'],
    frame(ctx) {
      document.body.className = 'aqua-workspace instruction-' + ctx.display;
      const u = ctx.util,
        bar = u.el('div', 'desktop-menu', document.body);
      u.el('span', 'apple-mark', bar, '●');
      u.el('b', 'app-menu-name', bar, 'MindCheck');
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((x) => u.el('span', '', bar, x));
      u.el('span', 'menu-spacer', bar, '');
      u.el('span', 'sound-icon', bar, '◖))');
      u.el('span', 'clock-label', bar, 'Mon Apr 16  10:24 AM');
      u.el('span', 'search-mark', bar, '⌕');
      let display = ctx.display;
      const vw = document.documentElement.clientWidth;
      if ((display === 'panel' && vw < 1260) || (display === 'toast' && vw < 1440)) display = 'header';
      document.body.classList.add('shown-' + display);
      let note = null;
      if (display === 'header' || display === 'panel') {
        note = u.el('aside', display === 'panel' ? 'task-note task-panel' : 'task-note', document.body);
        if (display === 'header') {
          u.el('b', '', note, 'Task:');
          u.el('p', '', note, ctx.instruction);
        } else {
          u.el('b', '', note, 'Instructions');
          u.el('p', '', note, ctx.instruction);
        }
      } else if (display === 'toast') {
        note = u.el('aside', 'task-toast', document.body);
        u.el('b', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
      }
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('div', 'traffic-lights', top);
      u.el('span', 'window-title', top, 'MindCheck — Number Cards');
      const center = u.el('div', 'center', app),
        heading = u.el('header', 'task-heading', center);
      u.el('b', '', heading, 'Number Cards');
      u.el('span', '', heading, 'Question 1 of 5');
      const stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      const status = u.el('div', 'status-line', footer);
      u.el('span', 'info-icon', status, 'i');
      u.el('span', 'status-copy', status, 'Choose one card.');
      let submit = null;
      const rawLabels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ],
        labels = rawLabels.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const preserve = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : preserve ? 'footer' : er.pick(['header', 'link', 'icon']),
        label = preserve ? 'Submit' : er.pick(labels),
        collide =
          !ctx.finish && cr.bool(0.3)
            ? cr.pick(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
            : null;
      const makeEnd = (parent, where) => {
        const tag = where === 'link' ? 'a' : 'button',
          cls = where === 'link' ? 'aqua-end-link' : where === 'icon' ? 'submit aqua-icon-end' : 'submit';
        const b = u.el(tag, cls, parent, where === 'icon' ? '✓' : label);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(footer, 'footer');
        else if (placement === 'link') submit = makeEnd(footer, 'link');
        else if (placement === 'icon') submit = makeEnd(footer, 'icon');
        else submit = makeEnd(heading, 'header');
      }
      if (collide) {
        const d = u.el('button', 'aqua-pq', heading, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const dock = u.el('div', 'dock', document.body);
      ['◉', '✉', '◉', '16', '▤', '▧', '◯'].forEach((x, i) => u.el('span', 'dock-icon icon-' + i, dock, x));
      ['Macintosh HD', 'Documents'].forEach((x, i) => u.el('div', 'desktop-item disk-' + i, document.body, x));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        panel = u.el('div', 'consent-panel', el),
        globe = u.el('div', 'globe-icon', panel);
      u.el('span', '', globe, '🌐');
      const copy = u.el('div', 'consent-copy', panel);
      u.el('b', 'consent-title', copy, 'We value your privacy');
      u.el(
        'p',
        '',
        copy,
        'We use optional analytics to help improve MindCheck. This includes information about your device and how you use the app. You can change this later in Settings.',
      );
      u.el('p', 'consent-question', copy, 'Do you agree to share optional analytics?');
      const actions = u.el('div', 'consent-actions', copy),
        dismiss = u.el('button', 'reject-button', actions, 'Reject optional');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const accept = u.el('button', 'accept-button', actions, 'Accept');
      accept.type = 'button';
      accept.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
