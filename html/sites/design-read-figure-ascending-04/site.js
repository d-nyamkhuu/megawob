(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-04',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'industrial',
    'title': 'Screen Calibration Utility',
    'menu': 'File    Tools    Help',
    'note': 'Task',
    'layout': 'wide-source',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end'),
        labels = ctx.content.END_LABELS || [
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
        ];
      let label = r.bool(0.5)
        ? 'Submit'
        : r.pick(labels.filter((x) => (typeof x === 'string' ? x : x.label || x.text || x.name) !== 'Submit'));
      if (typeof label !== 'string') label = label.label || label.text || label.name;
      const place = r.pick(['aside', 'aside', 'aside', 'header', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const opts = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.toLowerCase() !== label.toLowerCase());
        if (opts.length) collide = cr.pick(opts);
      }
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 22, height: 22, fill: '#c5c4bf', stroke: '#292929', 'stroke-width': 2 }, icon);
      u.svg(
        'path',
        { d: 'M6 7h14M6 11h14M6 15h14M6 19h10', fill: 'none', stroke: '#292929', 'stroke-width': 1.5 },
        icon,
      );
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
            fill: 'none',
            stroke: '#111',
            'stroke-width': 2,
          },
          svg,
        );
      }
      u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      if (ctx.display === 'panel' || ctx.display === 'toast')
        u.el('p', ctx.display === 'toast' ? 'aside-copy toast-note' : 'aside-copy panel-note', aside, ctx.instruction);
      const progress = u.el('section', 'response-section progress-section', aside);
      u.el('b', '', progress, 'Progress');
      u.el('p', 'progress-copy', progress, 'Numbers clicked: 0 / 13');
      u.el('div', 'progress-track', progress);
      const target = u.el('section', 'response-section target-section', aside);
      u.el('b', '', target, 'Current target');
      u.el('div', 'target-readout', target, '–');
      u.el('footer', 'bottom', app);
      let submit = null;
      const makeSubmit = (parent, cls) => {
        const tag = cls === 'end-link' ? 'a' : 'button',
          b = u.el(tag, cls, parent, label);
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
      const decoy = () => {
        if (!collide) return;
        const d = u.el('button', 'end-xtra', top, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      if (!ctx.finish) {
        if (place === 'aside') submit = makeSubmit(aside, 'submit');
        else if (place === 'header') submit = makeSubmit(top, 'submit header-end');
        else submit = makeSubmit(target, 'end-link');
      }
      decoy();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
