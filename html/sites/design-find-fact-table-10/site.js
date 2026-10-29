(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-10',
    'brand': 'BeOS',
    'winTitle': 'Staff Information Lookup',
    'taskTitle': 'Task',
    'icons': 'Home|Documents|Trash',
  };
  const ICONS = {
    Home: '<svg viewBox="0 0 56 56"><g stroke="#111" stroke-width="1.5" stroke-linejoin="round"><path d="M8 24 24 5 39 8 51 26 44 29 44 48 28 53 10 49 10 27" fill="#c7c5b8"/><path d="M28 24 39 8 51 26 44 29 44 48 28 53z" fill="#77796f"/><path d="M4 25 19 5 24 5 10 26z" fill="#d9d8b8"/><path d="m24 6 15 22-5 3L20 13 9 29 7 25z" fill="#f2f0df"/><path d="M35 5h7v13l-7-9z" fill="#71716a"/><path d="M36 4h7v3h-7z" fill="#b7b7af"/><path d="M16 33h8v18l-8-1z" fill="#b5a16b"/><path d="M16 33h8v4h-8z" fill="#e9dcb2"/><path d="M16 19h5v9h-5z" fill="#fffde7"/><path d="m33 32 6-1v9l-6 2z" fill="#d8ddce"/></g></svg>',
    Documents:
      '<svg viewBox="0 0 56 56"><g stroke="#171717" stroke-width="1.5" stroke-linejoin="round"><path d="m5 24 12-14h35v19l-9 13H4z" fill="#8a8d8c"/><path d="m5 24 12-14h35L42 25z" fill="#eeeee7"/><path d="M4 25h39v17H4z" fill="#d3d4cc"/><path d="m43 25 9-15v19l-9 13z" fill="#92958e"/><path d="M7 29h32v10H7" fill="none" stroke="#f8f8f0"/><path d="M8 29h7v3H8m22 1h8v3h-8" fill="#50514c" stroke-width=".7"/></g></svg>',
    Trash:
      '<svg viewBox="0 0 56 60"><g stroke="#111" stroke-width="1.6" stroke-linejoin="round"><path d="m7 17 22-6 24 6-8 38-16 4-14-4z" fill="#a7aaa0"/><path d="m7 17 22 10 24-10-8 38-16 4z" fill="#73796e"/><path d="m7 17 22-6 24 6-24 10z" fill="#eeeee0"/><path d="m12 18 17-4 18 4-18 6z" fill="#171e15"/><path d="m29 27 1 30-14-4-7-34z" fill="#c8cbbf"/><path d="m27 21-6-15q-1-5 4-4l6 17" fill="#7d9638"/><path d="m27 21 4-2" fill="none"/></g></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'bo-top', document.body);
      const logo = u.el('span', 'bo-logo', top, 'B');
      u.el('em', '', logo, 'e');
      u.el('span', 'bo-brand', top, C.brand);
      const gear = u.el('span', 'bo-gear', top);
      gear.innerHTML =
        '<svg viewBox="0 0 28 28"><g fill="none" stroke="#171717" stroke-width="1.8"><rect x="5" y="4" width="18" height="20" rx="5"/><path d="m8 3 3 4 6-1 3-3M4 11l5 1 2 6-2 6m15-13-5 1-2 6 2 6M9 8l10 12m0-12L9 20"/><circle cx="14" cy="14" r="6"/></g></svg>';
      const clk = u.el('span', 'bo-clock', top, '10:24 AM');
      const icons = u.el('div', 'bo-icons', document.body);
      C.icons.split('|').forEach((n) => {
        const d = u.el('div', 'bo-icon', icons);
        const g = u.el('span', 'bo-glyph', d);
        g.innerHTML = ICONS[n];
        u.el('span', '', d, n);
      });
      let mode = ctx.display;
      if ((mode === 'panel' && window.innerWidth < 1120) || (mode === 'toast' && window.innerHeight < 670))
        mode = 'header';
      document.body.dataset.instruction = mode;
      let note = null;
      if (mode !== 'hidden') {
        note = u.el('aside', 'bo-note bo-note-' + mode, document.body);
        u.el('div', 'bo-note-h', note, mode === 'header' ? 'Task' : C.taskTitle);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const tab = u.el('div', 'bo-tab', document.body);
      u.el('i', '', tab);
      u.el('span', '', tab, C.winTitle);
      const win = u.el('div', 'bo-win', document.body);
      const ctl = u.el('div', 'bo-ctl', document.body);
      ['min', 'max', 'close'].forEach((t) => u.el('b', 'bo-control-' + t, ctl));
      const stage = u.el('main', 'ds-stage', win);
      const foot = u.el('footer', 'ds-footer', win);
      const clear = u.el('button', 'bo-btn', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        stage.querySelectorAll('input').forEach((i) => {
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = endBank.map(labelOf);
      const endLabel = endLabels.includes('Submit')
        ? endRng.bool(0.52)
          ? 'Submit'
          : endRng.pick(endLabels.filter((x) => x !== 'Submit'))
        : endRng.pick(endLabels);
      const placement = ctx.finish ? null : endRng.pick(['footer', 'toolbar', 'footer', 'footer', 'link', 'icon']);
      const makeEnd = (parent, cls, label, icon, visible) => {
        const b = u.el('button', 'bo-btn ' + cls, parent, icon ? '✓' : visible || label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel, false);
      if (placement === 'link') submit = makeEnd(foot, 'bo-end-link', endLabel, false, endLabel + ' ›');
      if (placement === 'icon') submit = makeEnd(ctl, 'bo-end-icon', endLabel, true);
      if (placement === 'toolbar') submit = makeEnd(tab, 'bo-end-toolbar', endLabel, false);
      if (!ctx.finish) {
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const choices = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (choices.length) {
            const text = collideRng.pick(choices);
            const parent = placement === 'footer' || placement === 'link' ? ctl : foot;
            const decoy = u.el('button', 'bo-btn bo-xtra', parent, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
