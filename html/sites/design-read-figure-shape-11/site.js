(function () {
  'use strict';
  const C = { site: 'design-read-figure-shape-11', title: 'Shape Practice', menu: ['Home', 'Practice', 'Results'] };
  env.site({
    name: C.site,
    styles: ['site.css', 'mat.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util,
        display = ctx.display || 'header',
        app = u.el('main', 'app', document.body);
      document.body.className = 'mat instruction-' + display;
      const top = u.el('header', 'top', app);
      u.el('span', 'apptitle', top, C.title);
      const nav = u.el('nav', 'menu', top);
      C.menu.forEach((m, i) => u.el('span', i ? '' : 'on', nav, m));
      const av = u.svg('svg', { width: 48, height: 48, viewBox: '0 0 48 48', class: 'avatar' }, top);
      u.svg('circle', { cx: 24, cy: 24, r: 24, fill: '#fff' }, av);
      u.svg('circle', { cx: 24, cy: 19, r: 7, fill: '#3f51b5' }, av);
      u.svg('ellipse', { cx: 24, cy: 35, rx: 11, ry: 6, fill: '#3f51b5' }, av);
      const endRng = ctx.rng.fork('chrome/end');
      let placement = 'bottom',
        label = 'Submit';
      if (!ctx.finish && endRng.bool(0.5)) {
        placement = endRng.pick(['header', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool =
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const picked = endRng.pick(pool);
        label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      const labels = ctx.content && ctx.content.END_LABELS;
      const endWords =
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const words = endWords.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(words)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const endButton = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'mat-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const center = u.el('div', 'center', app),
        head = u.el('div', 'head mode-' + display, center);
      const brief = u.el('div', 'brief', head, display === 'hidden' ? '' : ctx.instruction);
      const sub = u.el('div', 'sub', head, 'Find the target shape and click on it.');
      if (display === 'hidden') sub.style.display = 'none';
      const stage = u.el('section', 'stage', center);
      let submit = null;
      if (placement === 'header') {
        if (collide) decoy(top, collide);
        submit = endButton(top, 'mat-end mat-end-header', label);
      }
      const footer = u.el('footer', 'bottom', app);
      const clk = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 44 44', class: 'clock' }, footer);
      u.svg('circle', { cx: 22, cy: 22, r: 19, fill: 'none', stroke: '#444', 'stroke-width': 3 }, clk);
      u.svg('path', { d: 'M22 10v12l7 5', fill: 'none', stroke: '#444', 'stroke-width': 3 }, clk);
      const tm = u.el('div', 'timer', footer);
      u.el('b', 'timer-title', tm, 'Time: Ready');
      u.el('span', 'timer-note', tm, 'Choose a shape to record your answer.');
      u.el('button', 'clear', footer, 'Clear').type = 'button';
      if (!ctx.finish && placement === 'bottom') submit = endButton(footer, 'submit', label);
      else if (!ctx.finish && placement === 'link') submit = endButton(footer, 'mat-end-link', label, 'a');
      if (collide && placement !== 'header') decoy(footer, collide);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const ic = u.el('div', 'upic', el);
      const arrow = u.svg('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' }, ic);
      u.svg(
        'path',
        {
          d: 'M20 43V22H9a2 2 0 0 1-1.4-3.4L22.6 3.5a2 2 0 0 1 2.8 0l15 15.1A2 2 0 0 1 39 22H28v21z',
          fill: 'currentColor',
        },
        arrow,
      );
      const x = u.el('button', 'upx', el);
      x.type = 'button';
      x.setAttribute('aria-label', 'Close update reminder');
      const cross = u.svg('svg', { viewBox: '0 0 30 30', 'aria-hidden': 'true' }, x);
      u.svg(
        'path',
        {
          d: 'M6 6l18 18M24 6L6 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 3,
          'stroke-linecap': 'round',
        },
        cross,
      );
      const timerTitle = document.querySelector('.timer-title'),
        timerNote = document.querySelector('.timer-note');
      if (timerTitle) timerTitle.textContent = 'Time: Paused';
      if (timerNote) timerNote.textContent = 'The timer will start after the update reminder is closed.';
      const close = () => {
        ctx.dismiss();
        if (timerTitle) timerTitle.textContent = 'Time: Ready';
        if (timerNote) timerNote.textContent = 'Choose a shape to record your answer.';
      };
      x.addEventListener('click', close);
      const b = u.el('div', 'upbody', el);
      u.el('h3', '', b, 'A new version is available');
      u.el('p', '', b, 'Get the latest features and security improvements.');
      const row = u.el('div', 'uprow', b);
      const dismiss = u.el('button', 'later', row, 'Remind me later');
      dismiss.addEventListener('click', close);
      const now = u.el('button', 'now', row, 'Update now');
      now.addEventListener('click', close);
      return { el, dismiss };
    },
  });
})();
