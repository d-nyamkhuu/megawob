(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-06',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'kin',
    'layout': 'kinetic',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'kinetic.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        B = document.body;
      const left = u.el('aside', 'k-left', B);
      const logo = u.el('div', 'k-logo', left);
      u.el('span', '', logo, 'FRAME');
      u.el('span', '', logo, 'QUIZ');
      u.el('i', 'k-bar', left);
      const set = u.el('div', 'k-tool k-settings', left);
      const g = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 24 24' }, set);
      u.svg(
        'path',
        {
          d: 'M10 1h4l.7 3 2 .9 2.7-1.4 2 3.4-2.1 2.1.2 2.3 2.5 1.8-1.3 3.8-3.1-.3-1.6 1.6-.3 3.1h-4l-.8-2.8-2.1-.8-2.7 1.4-2.4-3.2 2-2.4-.2-2.2L1 10.7l1.4-3.8 3.1.2L7 5.4 7.2 2z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10',
          fill: '#728299',
          'fill-rule': 'evenodd',
        },
        g,
      );
      u.el('span', '', set, 'Settings');
      const right = u.el('aside', 'k-right', B);
      u.el('small', '', right, 'TIME');
      u.el('b', '', right, '00:28');
      const ring = u.svg('svg', { width: 72, height: 72, viewBox: '0 0 72 72', class: 'k-ring' }, right);
      u.svg('circle', { cx: 36, cy: 36, r: 28, fill: 'none', stroke: '#dfe3ea', 'stroke-width': 5 }, ring);
      u.svg('path', { d: 'M36 8a28 28 0 0 1 28 28', fill: 'none', stroke: '#0a47f5', 'stroke-width': 5 }, ring);
      const help = u.el('div', 'k-tool k-help', right);
      const h = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 24 24' }, help);
      u.svg('circle', { cx: 12, cy: 12, r: 10, fill: 'none', stroke: '#5b6678', 'stroke-width': 1.5 }, h);
      const q = u.svg('text', { x: 12, y: 17, 'text-anchor': 'middle', 'font-size': 14, fill: '#5b6678' }, h);
      q.textContent = '?';
      u.el('span', '', help, 'Help');
      const app = u.el('main', 'app', B),
        top = u.el('header', 'top k-top', app);
      u.el('span', 'k-kicker', top, 'VISUAL RECOGNITION');
      const pr = u.el('div', 'k-prog', top);
      u.el('span', '', pr, '1 / 10');
      const tr = u.el('i', '', pr);
      u.el('b', '', tr);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center);
      if (ctx.display === 'header') {
        const t = ctx.instruction || '';
        let m = t.match(/^(.*?[?!])\s+(.*)$/) || t.match(/^(.*?,)\s+(.*)$/);
        if (!m || m[1].length < t.length * 0.25) {
          const spaces = Array.from(t.matchAll(/\s+/g), (x) => x.index),
            half = spaces.reduce((a, b) => (Math.abs(b - t.length / 2) < Math.abs(a - t.length / 2) ? b : a), 0);
          m = ['', t.slice(0, half), t.slice(half).trim()];
        }
        u.el('span', 'k-l1', brief, m[1]);
        if (m[2]) u.el('span', 'k-l2', brief, m[2]);
      } else if (ctx.display === 'panel') {
        brief.classList.add('k-instruction-panel');
        u.el('b', '', brief, 'TASK NOTE');
        u.el('span', 'k-panel-text', brief, ctx.instruction || '');
      }
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (ctx.display === 'toast') {
        const note = u.el('div', 'k-toast', app);
        u.el('small', '', note, 'TASK NOTE');
        u.el('span', '', note, ctx.instruction || '');
      }
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const keepDefault = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : keepDefault ? 'footer' : er.pick(['footer', 'header', 'link']);
      const picked = ctx.finish ? '' : keepDefault ? 'Submit' : er.pick(labels);
      const label = ctx.finish ? '' : picked.label || picked.text || picked.name || picked;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          placement === 'header' ? 'submit k-end-header' : placement === 'link' ? 'submit k-end-link' : 'submit',
          placement === 'header' ? top : footer,
          label,
        );
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      if (cr.bool(0.3)) {
        const pool = labels
          .map((x) => x.label || x)
          .filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) {
          const word = cr.pick(pool),
            d = u.el('button', 'k-xtra', top, word);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
        }
      }
      if (ctx.display === 'header')
        brief.querySelectorAll('span').forEach((e) => {
          e.style.transform = 'scaleX(' + Math.min(0.65, app.clientWidth / e.scrollWidth) + ')';
        });
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
