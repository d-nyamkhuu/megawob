(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-generate-04', task: 'solve-puzzle', scenario: 'generate' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'notebook instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 22, height: 26, viewBox: '0 0 22 26', class: 'title-icon' }, top);
      u.svg('path', { d: 'M5 1h11l5 5v17H3V4z', fill: '#f07824' }, icon);
      u.svg('path', { d: 'M5 1v5h5', fill: 'none', stroke: '#ffd29b', 'stroke-width': 1.4 }, icon);
      u.el('span', 'app-name', top, 'Notebook');
      const menu = u.el('nav', 'menu', top);
      ['File', 'Edit', 'View', 'Note', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const win = u.el('div', 'native-window-controls', top);
      for (const [kind, d] of [
        ['min', 'M3 11h14'],
        ['max', 'M4 4h12v12H4z'],
        ['close', 'M4 4l12 12M16 4L4 16'],
      ]) {
        const svg = u.svg('svg', { width: 18, height: 18, viewBox: '0 0 20 20' }, win);
        u.svg('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      const shelf = u.el('nav', 'shelf', app);
      [
        ['▤', 'Notes'],
        ['✓', 'Tasks'],
        ['▦', 'Calendar'],
        ['⌕', 'Search'],
      ].forEach(([ico, label], i) => {
        const t = u.el('div', 'shelf-tab' + (!i ? ' active' : ''), shelf);
        u.el('span', 'shelf-icon', t, ico);
        u.el('span', '', t, label);
      });
      const work = u.el('div', 'work-area', app),
        side = u.el('aside', 'notebooks', work);
      u.el('div', 'sidebar-heading', side, 'Notebooks');
      [
        ['▰', 'Quick Notes'],
        ['▱', 'Work'],
        ['▱', 'Personal'],
        ['♧', 'Ideas'],
        ['▣', 'Archive'],
      ].forEach(([ico, label], i) => {
        const row = u.el('div', 'notebook-row' + (!i ? ' selected' : ''), side);
        u.el('span', 'folder-icon', row, ico);
        u.el('span', '', row, label);
      });
      const center = u.el('div', 'center', work),
        meta = u.el('div', 'note-meta', center);
      u.el('span', '', meta, 'Apr 24, 2018');
      u.el('span', '', meta, 'Last edited 10:15 AM');
      const brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', work);
      const title = u.el('div', 'preview-title', aside);
      u.el('span', '', title, 'Preview');
      u.el('span', 'preview-controls', title, '−　×');
      u.el('div', 'preview-label', aside, 'Current number:');
      u.el('div', 'preview-value', aside, '—');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          bank = (ctx.content && ctx.content.END_LABELS) || [
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
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          labels = bank.map(labelOf);
        const label = er.bool(0.5) ? 'Submit' : er.pick(labels),
          placement = er.pick(['shelf', 'shelf', 'header', 'meta']);
        let parent = placement === 'header' ? menu : placement === 'meta' ? meta : shelf;
        const control = (p, cls, text, link) => {
          const b = u.el(link ? 'a' : 'button', cls, p, text);
          if (link) b.href = '#';
          else b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        submit = control(
          parent,
          'submit episode-submit' + (placement === 'meta' ? ' episode-link' : ''),
          label + (placement === 'meta' ? ' ›' : ''),
          placement === 'meta',
        );
        const candidates = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (candidates.length && cr.bool(0.3)) {
          const collide = cr.pick(candidates),
            where = cr.pick(['menu', 'shelf']),
            p = where === 'menu' ? menu : shelf,
            b = u.el('button', 'episode-xtra', p, collide);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
