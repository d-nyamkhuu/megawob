(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-08',
    'brand': 'Notebook — Find Word',
    'title': 'Find Word',
    'instruction': 'top',
    'rail': 'Task|Notes|Reference|Workspace|Results',
    'menu': 'File|Edit|Find|Format|Windows|Help',
    'briefTitle': 'Instructions',
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
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const classic = endRng.bool(0.5);
      const placement = classic ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = classic ? 'Submit' : endRng.pick(endLabels.filter((label) => label !== 'Submit'));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const top = u.el('header', 'ds-top', document.body);
      const appIcon = u.el('span', 'ds-logo', top);
      appIcon.innerHTML =
        '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="#aaa" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-28 16 16)"><path d="M10 25C6 21 5 18 5 15Q5 12 7 12L10 16 9 7Q9 4 11 5L13 13 13 4Q14 1 16 4L17 13 18 5Q20 3 21 6L21 14 23 9Q25 7 26 10L25 20Q24 24 22 26Z"/><path d="M10 16L17 17 21 21M13 13L21 14M9 25L11 29 21 29 22 26M17 17L16 23M8 18L12 22"/></g></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 12  9:24 AM');
      const body = u.el('div', 'ds-body', document.body);
      const tb = u.el('div', 'ds-title', body);
      u.el('i', 'ds-tbtn', tb, '');
      u.el('span', 'ds-brand', tb, C.brand);
      u.el('i', 'ds-tbtn r', tb, '×');
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const d = u.el('div', i === 0 ? 'on' : '', rail);
        u.el('span', '', d, t);
        d.style.top = 8.6 + i * 13.85 - (i ? 1 : 0) + 'vh';
        d.style.height = '12vh';
      });
      const sp = u.el('div', 'ds-spiral', body);
      for (let i = 0; i < 20; i++) u.el('i', '', sp);
      const doc = u.el('aside', 'ds-doc', document.body);
      const dt = u.el('div', 'ds-dt', doc);
      u.el('i', 'ds-tbtn', dt, '');
      u.el('span', '', dt, 'Document');
      u.el('i', 'ds-tbtn r', dt, '×');
      [
        ['Title:', 'Find Word'],
        ['Size:', '1 page'],
        ['Modified:', 'Apr 12, 1993  9:24 AM'],
        ['Format:', 'Plain Text'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-dr', doc);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const nx = u.el('div', 'ds-next', document.body);
      const cube = u.el('div', 'ds-cube', nx);
      cube.innerHTML =
        '<svg viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="cube-top" x2="1" y2="1"><stop stop-color="#292929"/><stop offset="1" stop-color="#080808"/></linearGradient></defs><path d="M15 29L76 3 94 62 37 93Z" fill="url(#cube-top)" stroke="#444"/><path d="M15 29L37 93 29 117 4 65Z" fill="#171717" stroke="#444"/><path d="M37 93L94 62 83 94 29 117Z" fill="#090909" stroke="#444"/><g fill="#999" font-family="Helvetica,Arial,sans-serif" font-weight="300" font-size="35" transform="matrix(.89,-.39,.29,.94,13,33)"><text x="0" y="0" dominant-baseline="hanging">Ne</text><text x="0" y="34" dominant-baseline="hanging">XT</text></g></svg>';
      u.el('div', '', nx, 'NeXTSTEP');
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish) {
        const clr = u.el('button', 'ds-clear', foot, 'Clear');
        clr.type = 'button';
        clr.addEventListener('click', () => {
          const f = document.querySelector('[data-role="field"]');
          if (f) {
            f.value = '';
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.focus();
          }
        });
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ds-end-' + placement,
          placement === 'toolbar' ? tb : foot,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide) {
        const decoy = u.el('button', 'ds-end-xtra', tb, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
