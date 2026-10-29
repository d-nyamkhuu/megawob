(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-odd-even-03' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'macintosh';
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        menu = u.el('nav', 'menubar', app);
      u.el('span', 'apple-mark', menu, '');
      ['File', 'Edit', 'Options', 'Window', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      u.el('span', 'menubar-clock', menu, '9:24 AM');
      u.el('span', 'help-mark', menu, '?');
      u.el('span', 'document-mark', menu, '▤');
      const win = u.el('section', 'window', app),
        title = u.el('header', 'window-title', win);
      u.el('button', 'close-box', title, '×').type = 'button';
      u.el('span', 'title-pattern', title, '');
      u.el('strong', 'window-name', title, 'Number Classifier');
      u.el('span', 'title-pattern right-pattern', title, '');
      u.el('button', 'zoom-box', title, '□').type = 'button';
      const work = u.el('div', 'workarea', win),
        left = u.el('section', 'task-pane', work);
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const heading = u.el('h1', 'brief', left, display === 'header' ? ctx.instruction : '');
      const stage = u.el('div', 'stage', left),
        right = u.el('aside', 'instruction-pane', work);
      const rhead = u.el('h2', 'pane-title', right, 'Instructions'),
        body = u.el('div', 'instruction-body', right);
      const copy = u.el('div', 'instruction-copy', body);
      const icon = u.svg('svg', { width: 62, height: 72, viewBox: '0 0 62 72', class: 'instruction-icon' }, body);
      u.svg(
        'path',
        { d: 'M7 3h35l12 12v53H7z M42 3v13h12', fill: 'white', stroke: 'currentColor', 'stroke-width': 3 },
        icon,
      );
      for (let y = 24; y < 59; y += 9)
        u.svg('path', { d: `M15 ${y}h5m6 0h20`, fill: 'none', stroke: 'currentColor', 'stroke-width': 3 }, icon);
      u.el('p', '', copy, 'For each number, select whether it is odd or even.');
      u.el('p', '', copy, 'An odd number is not divisible by 2. An even number is divisible by 2.');
      u.el('hr', '', right);
      u.el('p', 'examples-label', right, 'Examples:');
      u.el('p', 'examples', right, '3 is odd\n8 is even\n0 is even');
      u.el('hr', 'lower-rule', right);
      if (display === 'panel') {
        const note = u.el('div', 'mac-note-panel', right);
        u.el('strong', '', note, 'Task');
        u.el('div', '', note, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', win),
        status = u.el('span', 'status-text', footer, 'Ready.');
      let submit = null;
      if (display === 'toast') {
        const toast = u.el('div', 'mac-note-toast', footer, ctx.instruction);
        toast.setAttribute('role', 'status');
      }
      const er = ctx.rng.fork('chrome/end'),
        choices = ctx.content && ctx.content.END_LABELS;
      const labels = (
        Array.isArray(choices) && choices.length
          ? choices
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const base = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      let placement, label;
      if (ctx.finish) {
        placement = null;
        label = null;
      } else if (er.bool(0.5)) {
        placement = 'classic';
        label = base;
      } else {
        placement = er.pick(['footer', 'title', 'link']);
        label = alternatives.length ? labelOf(er.pick(alternatives)) : base;
      }
      const endButton = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'classic') submit = endButton(footer, 'submit', label, false);
      else if (placement === 'footer') submit = endButton(footer, 'submit mac-submit-footer', label, false);
      else if (placement === 'link') submit = endButton(footer, 'mac-submit-link', label, true);
      else if (placement === 'title') submit = endButton(title, 'mac-submit-title', label, false);
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
        const pool = [...new Set(labels)].filter((x) => !same(x));
        if (pool.length) {
          const text = labelOf(cr.pick(pool)),
            decoy = u.el('button', 'mac-xtra', footer, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      u.el('span', 'resize-grip', footer, '▦');
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
