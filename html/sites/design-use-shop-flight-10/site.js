(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-10',
    'tokens': {
      'bg': '#eef2f7',
      'panel': '#fafbfd',
      'fg': '#1b2433',
      'accent': '#1a6df0',
      'font': "Roboto,'Segoe UI',Arial,sans-serif",
      'line': '#e1e6ee',
      'muted': '#66707f',
    },
    'obstruction': null,
  };
  const PLANE =
    '<svg viewBox="0 0 180 150" width="100%" height="100%"><defs><linearGradient id="wing" x2="1" y2="1"><stop stop-color="#75a6e6"/><stop offset="1" stop-color="#d2e5f7"/></linearGradient></defs><path d="M101 34a7 7 0 0 1 6-12 18 18 0 0 1 33-8 13 13 0 0 1 21 12q0 10-11 10h-43z" fill="#e1edf8"/><path d="M98 142q-8 0-8-8t10-8a13 13 0 0 1 23-1q18-2 18 10 0 7-10 7z" fill="#edf3fa"/><g transform="rotate(-13 70 90)"><path d="M56 78 40 40q-2-4 9-3l22 42z" fill="#7b9fd5"/><path d="M47 98 33 123q0 4 11 4l37-32z" fill="url(#wing)"/><path d="M17 80 13 59h9l10 22z" fill="#a8cdf5"/><path d="M14 98 7 110h10l17-16z" fill="#c4def6"/><path d="M11 83Q33 77 81 79l37 3q22 4 17 12-5 8-38 8H24q-17-1-13-9z" fill="#edf5fd"/><path d="M11 93q25 3 89 1 25-1 36-5v6q-11 8-39 7H24q-14-1-13-9z" fill="#dcebf9"/><path d="m116 84 12 3-10 3h-7z" fill="#80a9de"/><g fill="#80a9de"><circle cx="36" cy="87" r="2"/><circle cx="45" cy="87" r="2"/><circle cx="54" cy="87" r="2"/><circle cx="63" cy="87" r="2"/><circle cx="72" cy="87" r="2"/><circle cx="81" cy="87" r="2"/><circle cx="90" cy="87" r="2"/><circle cx="99" cy="87" r="2"/></g></g></svg>';
  const FILTERS = [
    ['Max price', null],
    ['Stops', ['Nonstop', '1 stop', '2+ stops']],
    ['Airlines', ['Delta', 'American Airlines', 'United', 'JetBlue', 'Southwest']],
    ['Departure time', ['Before 12 PM', '12 PM – 6 PM', 'After 6 PM']],
  ];
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const useDefault = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.display === 'hidden' || useDefault ? 'filters' : endRng.pick(['note', 'link']);
      const endLabel = useDefault
        ? 'Submit'
        : labelText(endRng.pick(labels.filter((x) => labelText(x).toLowerCase() !== 'submit')) || 'Done');
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3)
        ? labelText(
            collideRng.pick(
              labels.filter((x) => labelText(x).trim().toLowerCase() !== endLabel.trim().toLowerCase()),
            ) || 'Save',
          )
        : null;
      const shell = u.el('div', 'site-shell', document.body);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      const art = u.el('div', 'note-art', note);
      art.innerHTML = PLANE;
      if (ctx.display === 'header') u.el('p', 'food-task', note, ctx.instruction);
      if (ctx.display === 'panel') {
        const panel = u.el('section', 'task-panel', note);
        u.el('h3', '', panel, 'Your flight');
        u.el('p', '', panel, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'task-toast', note);
        u.el('span', 'toast-mark', toast, '✓');
        u.el('p', '', toast, ctx.instruction);
      }
      const stage = u.el('main', 'stage', body);
      const side = u.el('aside', 'filters', body);
      u.el('h3', '', side, 'Filters');
      for (const [title, opts] of FILTERS) {
        const g = u.el('div', 'fgroup', side);
        u.el('h4', '', g, title);
        if (!opts) {
          u.el('div', 'fprice', g, '$600');
          const t = u.el('div', 'ftrack', g);
          u.el('i', '', t);
          continue;
        }
        for (const o of opts) {
          const l = u.el('label', 'fopt', g);
          const c = u.el('input', '', l);
          c.type = 'checkbox';
          c.addEventListener('change', () => env.log('decoy', { what: o }));
          u.el('span', '', l, o);
        }
      }
      u.el('div', 'order-slot', side);
      const actions = u.el('div', 'note-actions', note);
      let submit = null;
      const endControl = (parent, asLink) => {
        const b = u.el(
          asLink ? 'a' : 'button',
          asLink ? 'end-link' : 'end-control' + (placement === 'filters' ? '' : ' end-note'),
          parent,
          endLabel,
        );
        if (asLink) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'filters') submit = endControl(side, false);
        else submit = endControl(actions, placement === 'link');
      }
      if (collide) {
        const d = u.el('button', 'pqs-xtra', actions, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
