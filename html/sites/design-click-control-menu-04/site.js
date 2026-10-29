(function () {
  'use strict';
  const cfg = {
    title: 'Team Directory',
    sub: 'Browse by name to view team members.',
    side: 'Task',
    hint: ['Open the menu and navigate through the requested names.', 'Click the final name to select it.'],
    search: 'Search people...',
  };
  const ICON_TASK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#2f9c85" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#7b868c" stroke-width="1.7" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
  const ICON_HELP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#555f66" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.4a2.8 2.8 0 1 1 4 2.5c-.9.5-1.3 1-1.3 2M12 17.3v.1"/></svg>';
  env.site({
    name: 'design-click-control-menu-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref mint minimal';
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const left = u.el('section', 'side', work);
      const sh = u.el('div', 'side-head', left);
      const ic = u.el('span', 'side-icon', sh);
      ic.innerHTML = ICON_TASK;
      u.el('span', 'side-label', sh, cfg.side);
      const display = ctx.display || 'header';
      left.hidden = display === 'hidden';
      const note = u.el('div', 'instruction', left, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display !== 'hidden') cfg.hint.forEach((t) => u.el('p', 'side-hint', left, t));
      const center = u.el('section', 'center', work);
      const top = u.el('div', 'top', center);
      const tt = u.el('div', 'top-title', top);
      u.el('h1', '', tt, cfg.title);
      u.el('p', '', tt, cfg.sub);
      const sr = u.el('button', 'search', top);
      sr.type = 'button';
      sr.setAttribute('aria-label', cfg.search);
      sr.addEventListener('click', () => env.log('decoy', { label: cfg.search }));
      const si = u.el('span', 'search-icon', sr);
      si.innerHTML = ICON_SEARCH;
      u.el('span', 'search-text', sr, cfg.search);
      const stage = u.el('div', 'stage', center);
      let placement = 'footer';
      if (!ctx.finish) {
        const p = endR.float();
        placement = p < 0.5 ? 'footer' : p < 0.75 ? 'header' : 'link';
      }
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endR.float() < 0.5 ? 'Submit' : String(labelOf(endR.pick(labels)));
      const makeEnd = (parent, kind, text) => {
        const b = u.el(kind === 'link' ? 'a' : 'button', kind === 'link' ? 'end-link' : kind, parent, text);
        b.type = kind === 'link' ? undefined : 'button';
        if (kind === 'link') b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.dataset.role = 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') {
        top.classList.add('has-end');
        submit = makeEnd(top, 'header-end', label);
      }
      const cr = collideR.bool(0.3)
        ? collideR.pick(
            labels
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase()),
          )
        : null;
      const decoy = (parent) => {
        if (cr === null) return;
        const b = u.el('button', 'end-xtra', parent, String(cr));
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: String(cr), collide: true }));
      };
      if (placement === 'header') decoy(top);
      const foot = u.el('footer', 'footer', shell);
      const help = u.el('div', 'help', foot);
      const hi = u.el('span', 'help-icon', help);
      hi.innerHTML = ICON_HELP;
      u.el('span', '', help, 'Help');
      const acts = u.el('div', 'acts', foot);
      const reset = u.el('button', 'reset', acts, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      if (placement !== 'header') decoy(acts);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(acts, 'submit', label);
      if (!ctx.finish && placement === 'link') submit = makeEnd(acts, 'link', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
