(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-addition-02',
    task: 'read-figure',
    scenario: 'addition',
    style: 'electron',
    title: 'Math Practice',
    menu: 'Home Tools View Help',
    note: 'Notes',
    layout: 'stagger',
    subtitle: '',
    aside:
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg('rect', { x: 1, y: 1, width: 24, height: 24, rx: 4, fill: '#f65b13' }, icon);
        [
          [6, 6],
          [14, 6],
          [6, 14],
          [14, 14],
        ].forEach(([x, y]) => u.svg('rect', { x, y, width: 6, height: 6, rx: 1, fill: '#fff' }, icon));
      }
      u.el('span', 'brand', top, C.title);
      if (C.menu) {
        const nav = u.el('nav', 'menu', top),
          tabs = u.el('div', 'tabs', nav);
        ['Home', 'Tools', 'View', 'Help'].forEach((label, i) =>
          u.el('span', 'tab' + (i === 0 ? ' active' : ''), tabs, label),
        );
        const ribbon = u.el('div', 'ribbon', nav);
        [
          ['Edit', ['Select', 'Erase', 'Undo']],
          ['Insert', ['Block', 'Clear All']],
          ['View', ['Zoom In', 'Zoom Out', 'Fit']],
        ].forEach((group, gi) => {
          const g = u.el('div', 'tool-group', ribbon),
            items = u.el('div', 'tool-items', g);
          group[1].forEach((label, i) => {
            const b = u.el('div', 'tool' + (gi === 0 && i === 0 ? ' chosen' : ''), items);
            u.el(
              'span',
              'tool-icon',
              b,
              ['➤', '◇', '↶', '▦', '▤', '⊕', '⊖', '⛶'][gi === 0 ? i : gi === 1 ? i + 3 : i + 5],
            );
            u.el('span', 'tool-label', b, label);
          });
          u.el('span', 'group-label', g, group[0]);
        });
      }
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : ''),
        stage = u.el('section', 'stage', center);
      if (ctx.display !== 'header') brief.style.display = 'none';
      const aside = u.el('aside', 'aside', document.body);
      if (ctx.display === 'panel') {
        const panel = u.el('div', 'episode-panel', document.body);
        u.el('b', 'episode-title', panel, 'Quick Notes');
        u.el('p', 'aside-copy episode-copy', panel, ctx.instruction);
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, C.aside);
      } else {
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, C.aside);
      }
      if (ctx.display === 'toast') u.el('div', 'episode-toast', document.body, ctx.instruction);
      const footer = u.el('footer', 'bottom', app),
        ready = u.el('div', 'ready', footer);
      u.el('i', 'ready-dot', ready);
      u.el('span', '', ready, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
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
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const placement = er.pick([
            'footer',
            'footer',
            'footer',
            'footer',
            'footer',
            'ribbon',
            'ribbon',
            'link',
            'icon',
            'link',
          ]),
          label = placement === 'footer' ? 'Submit' : labelOf(er.pick(labels));
        const clear = u.el('button', 'clear-answer', footer, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const field = document.querySelector('.addition-content .answer input');
          if (field) {
            field.value = '';
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.focus();
          }
        });
        submit = u.el('button', 'submit end-' + placement, footer, placement === 'icon' ? '✓' : label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        const cr = ctx.rng.fork('chrome/collide'),
          pool = labels.map(labelOf),
          same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(pool)].filter((x) => !same(x));
          if (options.length) collide = cr.pick(options);
        }
        const decoys = (ctx.content && ctx.content.DECOY_LABELS) || [
          'Help',
          'Feedback',
          'Preview',
          'Save draft',
          'Reset view',
          'Share',
          'Export',
          'History',
        ];
        const addDecoy = (text, isEnd) => {
          const b = u.el('button', 'chrome-xtra', footer, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
        };
        if (collide) addDecoy(collide, true);
        if (cr.bool(0.2)) addDecoy(labelOf(cr.pick(decoys)), false);
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
