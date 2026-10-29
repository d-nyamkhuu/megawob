(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-fix-error-02', task: 'solve-puzzle', scenario: 'fix-error' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'cad instruction-' + ctx.display;
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end'),
        labels = (
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish ? null : r.pick(['toolbar', 'toolbar', 'form', 'link', 'icon']);
      const label = placement === 'toolbar' ? 'Continue' : placement === 'form' ? 'Submit' : r.pick(labels);
      let submit = null;
      const app = u.el('main', 'cad-app', document.body);
      const title = u.el('header', 'titlebar', app);
      u.el('span', 'appmark', title, '◉');
      u.el('span', 'window-title', title, 'VertexCAD 2014 - Project Editor');
      const windowButtons = u.el('div', 'window-buttons', title);
      for (const [c, t] of [
        ['min', '—'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('span', 'window-button ' + c, windowButtons, t);
      const menu = u.el('nav', 'menubar', app);
      u.el(
        'span',
        'menu-caption',
        menu,
        'File    Edit    View    Draw    Modify    Annotate    Tools    Window    Help',
      );
      const tools = u.el('div', 'toolbar', app);
      const icons = ['➤', '✋', '⌕', '⌕', '⌕', '／', '╱', '◯', '□', '＋', '⊕', '⌖', '✎', '⚙', '▣'];
      icons.forEach((x, i) => {
        if ([2, 5, 9, 11, 13].includes(i)) {
          const sep = u.el('i', 'tool-sep', tools);
          sep.setAttribute('aria-hidden', 'true');
        }
        const b = u.el('button', 'tool-icon' + (i === 0 ? ' active' : ''), tools, x);
        b.type = 'button';
        b.tabIndex = -1;
      });
      if (placement === 'toolbar' && !ctx.finish) {
        submit = u.el('button', 'submit toolbar-submit', tools, label);
        const b = submit;
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
      }
      const work = u.el('div', 'workarea', app);
      const rail = u.el('nav', 'rail', work);
      [
        ['▯', 'Projects'],
        ['▤', 'Drawings'],
        ['⬡', 'Materials'],
        ['▥', 'Libraries'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ].forEach((it, i) => {
        const a = u.el('div', 'navitem' + (!i ? ' selected' : ''), rail);
        u.el('span', 'navglyph', a, it[0]);
        u.el('span', 'navlabel', a, it[1]);
      });
      const info = u.el('aside', 'help-panel', work);
      const heading = u.el('div', 'help-heading', info, 'Project Information');
      if (ctx.display === 'header') u.el('div', 'instruction-header', heading, ctx.instruction);
      u.el(
        'p',
        'help-intro',
        info,
        'Enter the basic details for the project. All fields are required and must be valid.',
      );
      u.el('div', 'rule', info);
      u.el('h3', '', info, 'Field Guidelines');
      [
        ['Project Name', '3–50 characters. Letters, numbers, spaces, hyphens and underscores only.'],
        ['Project Code', '2–10 uppercase letters or numbers only.'],
        ['Start Date', 'Use format YYYY-MM-DD.'],
        ['End Date', 'Use format YYYY-MM-DD. Must be on or after the start date.'],
        ['Budget (USD)', 'Whole numbers only.'],
      ].forEach(([h, p]) => {
        u.el('b', 'guideline-title', info, h);
        u.el('p', 'guideline-copy', info, p);
      });
      u.el('div', 'rule', info);
      u.el('h3', 'example-title', info, 'Example');
      u.el(
        'p',
        'example-copy',
        info,
        'Project Name:  River Bend\nProject Code:  RB100\nStart Date:  2014-03-01\nEnd Date:  2014-12-15\nBudget (USD):  250000',
      );
      if (ctx.display === 'panel') u.el('div', 'instruction-panel', info, ctx.instruction);
      const stage = u.el('section', 'stage', work);
      if (placement === 'form' && !ctx.finish) {
        const footer = u.el('div', 'form-action', work);
        submit = u.el('button', 'submit', footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      if (placement === 'link' && !ctx.finish) {
        const l = u.el('a', 'submit-link', work, label);
        l.href = '#';
        l.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = l;
      }
      if (placement === 'icon' && !ctx.finish) {
        const b = u.el('button', 'submit icon-submit', tools, '✓');
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        submit = b;
      }
      if (ctx.display === 'toast') u.el('div', 'instruction-toast', app, ctx.instruction);
      if (ctx.display === 'hidden') {
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (pool.length) {
          const t = cr.pick(pool),
            d = u.el('button', 'ep-xtra', tools, t);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: t, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Workspace notification',
          chat: 'Need help with this project?',
          promo: 'VertexCAD project tools',
          banner: 'Project workspace notice',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  });
})();
