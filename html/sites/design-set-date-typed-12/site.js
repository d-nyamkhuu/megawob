(function () {
  'use strict';
  const C = {
    site: 'design-set-date-typed-12',
    menus: ['Desk', 'File', 'Edit', 'Format', 'Options', 'Help'],
    clock: 'Mon Jul 31, 2023   10:24 AM',
    title: 'Birthday Entry',
  };
  const DOC =
    '<svg viewBox="0 0 100 110" width="100%" height="100%"><g fill="#fff" stroke="#111" stroke-width="4"><path d="M6 6h46l14 14v54H6z"/><path d="M34 40h46l14 14v52H34z"/></g><g stroke="#111" stroke-width="4"><path d="M14 24h34M14 38h34M14 52h34M42 62h44M42 74h44M42 86h26"/></g></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'g-menubar', document.body);
      const logo = u.el('span', 'g-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 20L9 4h7l3 16M7 15h11M10 8l6 10M15 7l-5 12M4 21h16M11 2h4"/></svg>';
      C.menus.forEach((t) => u.el('span', 'g-mi', top, t));
      u.el('span', 'g-clock', top, C.clock);
      const body = u.el('div', 'g-body', document.body);
      const idx = u.el('aside', 'g-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', 'g-n' + (i === 1 ? ' on' : ''), idx, String(i));
      const win = u.el('div', 'g-win', body);
      const tb = u.el('div', 'g-title', win);
      const gadget = u.el('span', 'g-tgad', tb);
      gadget.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h17l-4 7H7zM5 3l3 6M20 4l-5 8M4 20l6-7h6l5 7M3 15l7 2 8-3"/></svg>';
      u.el('span', 'g-ttext', tb, C.title);
      const er = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const labels = endBank.map(endText);
      const canonical = labels.find((x) => x.toLowerCase() === 'submit') || labels[0] || 'Submit';
      const label = er.bool(0.5)
        ? canonical
        : labels.filter((x) => x.toLowerCase() !== canonical.toLowerCase()).length
          ? er.pick(labels.filter((x) => x.toLowerCase() !== canonical.toLowerCase()))
          : canonical;
      const placement = er.pick(['bottom', 'bottom', 'bottom', 'toolbar', 'link', 'bottom']);
      const endButton = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'toolbar') submit = endButton(tb, 'g-toolbar-end', label, false);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, cls) => {
        const b = u.el('button', cls, parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      u.el('span', 'g-bgad', tb, '□');
      u.el('span', 'g-bgad', tb, '✕');
      const band = u.el('div', 'g-band', win);
      const ico = u.el('div', 'g-doc', band);
      ico.innerHTML = DOC;
      const msg = u.el('div', 'g-msg', band);
      const mt = u.el('div', 'g-mt', msg, 'Tools are hidden');
      const ms = u.el('div', 'g-ms', msg, 'Click "Expand tools" to show available commands.');
      const exp = u.el('button', 'g-expand', band, 'Expand tools ▶');
      exp.type = 'button';
      const strip = u.el('div', 'g-strip', win);
      strip.hidden = true;
      ['Edit date', 'Clear date'].forEach((t) => {
        const b = u.el('button', 'g-tool', strip, t);
        b.type = 'button';
        b.addEventListener('click', () => {
          const field = stage.querySelector('[data-role="field"]');
          if (!field) return;
          if (t === 'Clear date') {
            field.value = '';
            field.dispatchEvent(new Event('input', { bubbles: true }));
          }
          field.focus();
        });
      });
      exp.addEventListener('click', () => {
        const open = strip.hidden;
        strip.hidden = !open;
        msg.style.visibility = open ? 'hidden' : 'visible';
        ico.style.visibility = open ? 'hidden' : 'visible';
        exp.textContent = open ? 'Collapse tools ◀' : 'Expand tools ▶';
      });
      const sheet = u.el('div', 'g-sheet', win);
      const mode = ctx.display;
      let note = null;
      if (mode !== 'hidden') {
        note = u.el('div', 'g-instr g-instr-' + mode, sheet, '');
        u.el('span', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', sheet);
      const foot = u.el('footer', 'g-foot', sheet);
      if (!ctx.finish && placement === 'bottom') submit = endButton(foot, 'g-btn g-submit', label, false);
      if (!ctx.finish && placement === 'link') submit = endButton(sheet, 'g-endlink', label + ' ›', true);
      if (!ctx.finish && collide) {
        if (placement === 'bottom') decoy(tb, 'g-pq g-pq-title');
        else decoy(foot, 'g-pq');
      }
      const clr = u.el('button', 'g-btn g-clear', foot, 'Clear');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        const field = stage.querySelector('[data-role="field"]');
        if (field) {
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.focus();
        }
      });
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
