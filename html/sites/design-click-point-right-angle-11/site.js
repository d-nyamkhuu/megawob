(function () {
  'use strict';
  const C = {
    'title': 'Geometry Practice',
    'foot': 'Click to place a point.',
    'accent': '#000',
    'bg': '#fff',
    'surface': '#fff',
    'font': "Chicago, Geneva, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  };
  env.site({
    name: 'design-click-point-right-angle-11',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design mac' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#000',
        muted: '#000',
        line: '#000',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const bar = u.el('header', 'menubar', shell);
      const apple = u.svg('svg', { class: 'apple', width: 30, height: 34, viewBox: '0 0 22 24' }, bar);
      u.svg(
        'path',
        {
          d: 'M15 1C15 3 13.500 4.500 11.700 4.700C11.500 2.700 13.200 1 15 1ZM11 7C9.500 6.200 6 5.800 4.200 9C2.400 12 4 18 6.500 20.500C7.700 21.700 9 21.500 10 21C11 20.500 12.300 20.500 13.500 21C14.700 21.500 15.800 21.300 17 19.500C18 18 18.500 17 18.700 16.500C16 15.500 15.500 11 18 9.500C16.500 7 13 6 11 7Z',
          fill: '#000',
        },
        apple,
      );
      const menu = u.el('nav', 'menu', bar);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', '', menu, m);
      u.el('span', 'clock', bar, '10:24 AM');
      const ic = u.svg(
        'svg',
        { class: 'mi', width: 34, height: 30, viewBox: '0 0 34 30', fill: 'none', stroke: '#000', 'stroke-width': 2 },
        bar,
      );
      u.svg(
        'path',
        { d: 'M5 1H29L33 5V28L30 29H4L1 26V5ZM5 5H29V25H5ZM7 21L13 15L17 18L26 9M7 23H27M12 10L16 12M23 17L26 22' },
        ic,
      );
      u.svg('circle', { cx: 11, cy: 8, r: 1.4, fill: '#000' }, ic);
      const main = u.el('div', 'main', shell);
      let display = ctx.display || 'header';
      const note = u.el('section', 'task-note', main);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        };
      } else if (display === 'panel') note.classList.add('instruction-panel');
      const win = u.el('div', 'win', main);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'close-box', tb);
      u.el('span', 'tt', tb, C.title);
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'titlebar', 'footer-link']);
      const labels = ctx.content?.END_LABELS || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = placement === 'footer' ? 'Submit' : labelOf(er.pick(labels));
      const makeEnd = (parent, cls, text = label) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
        const options = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))),
        ].filter((x) => !same(x));
        if (options.length) collide = cr.pick(options);
      }
      const wb = u.el('div', 'winbody', win);
      const stage = u.el('main', 'stage', wb);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'toolcol', wb);
      const paths = [
        ['Select', 'M9 3V25L15 19L20 30L24 28L19 18H27Z', '#000'],
        ['Line', 'M3 29L29 3', 'none'],
        ['Circle', '', 'none'],
        ['Erase', 'M3 21L17 6L29 12V18L15 31L3 26ZM3 21L15 25L29 12M15 25V31M17 6L21 5L29 10V12', 'none'],
      ];
      for (const [n, d, f] of paths) {
        const b = u.el('button', 'mtool' + (n === 'Select' ? ' sel' : ''), aside);
        b.type = 'button';
        b.title = n;
        const s = u.svg(
          'svg',
          { width: 36, height: 36, viewBox: '0 0 32 32', fill: f, stroke: '#000', 'stroke-width': 1.6 },
          b,
        );
        if (d) u.svg('path', { d }, s);
        if (n === 'Circle')
          (u.svg('circle', { cx: 16, cy: 16, r: 13, fill: 'none', 'stroke-dasharray': '3 2' }, s),
            u.svg('circle', { cx: 16, cy: 16, r: 1.2, fill: '#000' }, s));
        b.onclick = () => {
          if (n === 'Erase') env.widgetDef.clear?.();
          else {
            aside.querySelectorAll('.mtool').forEach((x) => x.classList.remove('sel'));
            b.classList.add('sel');
          }
        };
      }
      const footer = u.el('footer', 'footer', win);
      u.el('div', 'footer-copy', footer, C.foot);
      let submit = null;
      if (placement === 'footer') submit = makeEnd(footer, 'submit');
      else if (placement === 'footer-link') submit = makeEnd(footer, 'submit footer-link', label + ' ›');
      else if (placement === 'titlebar') submit = makeEnd(tb, 'submit title-submit');
      if (collide) {
        const b = u.el('button', 'end-xtra', footer, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.title = collide;
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const icon = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 86,
          height: 76,
          viewBox: '0 0 86 76',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 6,
          'stroke-linejoin': 'miter',
        },
        box,
      );
      u.svg('path', { d: 'M43 6L80 70H6Z' }, icon);
      u.svg('path', { d: 'M43 26V48M43 56V62', 'stroke-width': 7 }, icon);
      const txt = u.el('div', 'ob-text', box);
      u.el('h3', '', txt, 'Important Announcement');
      u.el('p', '', txt, 'New practice sets are now available!\nClick Collapse to continue working.');
      const dismiss = u.el('button', 'dismiss', box, 'Collapse');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss alt', box, 'Accept');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
