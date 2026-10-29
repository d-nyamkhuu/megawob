(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-03',
    'brand': 'Atlas Office Companion',
    'tag': 'Tools for a More Organized Tomorrow',
    'title': 'Document Workbench',
  };
  const GUIDE = [
    'Copy the information from the receipt on the left into the matching fields.',
    'If the receipt does not provide a value (for example, PO number), leave the field blank.',
    'Enter the date in YYYY-MM-DD format.',
    'Check that the total amount and currency match the receipt.',
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const globe = u.el('span', 'ds-globe', top);
      globe.innerHTML =
        '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#438aa8" stroke="#b6c2d7" stroke-width="2"/><path d="M19 7l11 4 2 8-9 4-5-6-6 4-5 13 11 3 8 14 9 2 4-16 12-6-6-11-10-5 3-9z" fill="#71a94a" stroke="#233e65"/><ellipse cx="30" cy="30" rx="13" ry="27" fill="none" stroke="#173c74" stroke-width="2"/><path d="M4 30h52M10 14q20 12 40 0M10 46q20-12 40 0" fill="none" stroke="#173c74" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-tag', top, C.tag);
      u.el('span', 'ds-wb', top, C.title);
      u.el('span', 'ds-cd', top);
      const body = u.el('div', 'ds-body', document.body);
      const bench = u.el('section', 'ds-bench', body);
      const tabs = u.el('div', 'ds-tabs', bench);
      ['1. Review Document', '2. Enter Information', '3. Submit'].forEach((t, i) =>
        u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t),
      );
      const stage = u.el('main', 'ds-stage', bench);
      const side = u.el('aside', 'ds-side', body);
      u.el('h2', 'ds-side-h', side, 'Task Inspector');
      const card = u.el('div', 'ds-card', side);
      const mode = ctx.display || 'header';
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', card);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (mode === 'panel') {
        const h = u.el('h3', 'ds-h3', card);
        const icon = u.el('i', 'ds-ico ds-clip', h);
        icon.innerHTML =
          '<svg viewBox="0 0 48 60"><rect x="5" y="9" width="38" height="48" rx="4" fill="#d5d9df" stroke="#101a36" stroke-width="3"/><rect x="10" y="14" width="28" height="37" fill="#fff" stroke="#53617a"/><path d="M17 5h5V2h5v3h5v12H17z" fill="#c3cad6" stroke="#101a36" stroke-width="2"/><path d="M20 24h13m-13 7h13m-13 7h13m-13 7h13M14 24h2m-2 7h2m-2 7h2m-2 7h2" stroke="#172544" stroke-width="2"/></svg>';
        u.el('span', '', h, 'Your Task');
        const b = u.el('div', 'ds-brief', card);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      if (mode === 'panel') u.el('hr', 'ds-hr', card);
      const g = u.el('h3', 'ds-h3', card);
      const book = u.el('i', 'ds-ico ds-book', g);
      book.innerHTML =
        '<svg viewBox="0 0 60 48"><path d="M2 7Q16 0 30 7Q44 0 58 7v38Q44 38 30 45Q16 38 2 45z" fill="#7083ad" stroke="#111d3a" stroke-width="3"/><path d="M7 5q12-4 23 4q11-8 23-4v34q-12-4-23 3q-11-7-23-3z" fill="#dce2ed" stroke="#172442" stroke-width="2"/><path d="M30 9v33M12 12q7-2 13 2m-13 3q7-2 13 2m10-5q7-4 13-2m-13 7q7-4 13-2m-13 7q7-4 13-2" fill="none" stroke="#34496b" stroke-width="2"/></svg>';
      u.el('span', '', g, 'Field Guide');
      const ul = u.el('ul', 'ds-guide', card);
      GUIDE.forEach((t) => u.el('li', '', ul, t));
      const lastLi = u.el('li', '', ul);
      lastLi.append('Click ');
      u.el('b', '', lastLi, 'Submit');
      lastLi.append(' when you are finished.');
      const foot = ctx.finish ? null : u.el('footer', 'ds-footer', card);
      if (mode === 'header') {
        const note = u.el('div', 'ds-headnote', bench, ctx.instruction);
        bench.insertBefore(note, stage);
      }
      const endR = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = bank.map(labelOf);
      const baseline = endR.bool(0.5);
      const label = baseline ? 'Submit' : labelOf(endR.pick(bank));
      const placement = baseline ? 'footer' : endR.pick(['footer', 'tabs', 'link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      const decoy = (parent, text, collides) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'tabs' ? tabs : foot;
        const end = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'ds-endlink' : 'ds-submit',
          parent,
          placement === 'link' ? label + ' ›' : label,
        );
        if (end.tagName === 'BUTTON') end.type = 'button';
        else end.href = '#';
        end.dataset.role = 'submit';
        end.setAttribute('aria-label', label);
        end.title = label;
        end.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = end;
      }
      if (collide) {
        const parent = ctx.finish || placement !== 'tabs' ? tabs : foot;
        decoy(parent, collide, true);
      }
      // A long instruction or guide overflows the task card on a short viewport: shrink its text (--cfit) until it fits.
      for (let fit = 1; fit > 0.5 && card.scrollHeight > card.clientHeight + 1;) {
        fit = Math.round((fit - 0.02) * 100) / 100;
        card.style.setProperty('--cfit', String(fit));
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
