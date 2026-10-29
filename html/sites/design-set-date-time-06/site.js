(function () {
  'use strict';
  const C = { 'site': 'design-set-date-time-06', 'app': 'Appointment Scheduler', 'group': 'Appointment Details' };
  const CAL =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2.5" y="4.5" width="19" height="17" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="2.5" y="4.5" width="19" height="4" fill="#000080"/><path d="M7 2v5M12 2v5M17 2v5" stroke="#000" stroke-width="2"/><path d="M5 11h14M5 14h14M5 17h14M8 9v11M12 9v11M16 9v11" stroke="#000080" stroke-width="1.2"/></svg>';
  const BIG =
    '<svg viewBox="0 0 64 64" width="100%" height="100%"><rect x="5" y="9" width="54" height="52" fill="#000"/><rect x="2" y="6" width="54" height="52" fill="#fff" stroke="#000" stroke-width="2"/><rect x="2" y="6" width="54" height="11" fill="#ad1828" stroke="#000" stroke-width="2"/><path d="M10 2v10M22 2v10M34 2v10M46 2v10" stroke="#000" stroke-width="4"/><path d="M10 2v8M22 2v8M34 2v8M46 2v8" stroke="#eee" stroke-width="1.5"/><g fill="none" stroke="#939aa3" stroke-width="1.4"><path d="M9 25h6v6H9zM18 25h6v6h-6zM27 25h6v6h-6zM36 25h6v6h-6zM45 25h6v6h-6zM9 35h6v6H9zM18 35h6v6h-6zM27 35h6v6h-6zM36 35h6v6h-6zM45 35h6v6h-6zM9 45h6v6H9zM18 45h6v6h-6zM27 45h6v6h-6zM36 45h6v6h-6zM45 45h6v6h-6z"/></g></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = er.pick(['footer', 'footer', 'header', 'link', 'icon']);
      const primary = placement === 'footer';
      const label = primary ? 'Submit' : labelOf(er.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      const collision = cr.bool(0.3)
        ? (() => {
            const choices = [
              ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
            ];
            return choices.length ? cr.pick(choices) : null;
          })()
        : null;
      const body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-win', body);
      const tb = u.el('div', 'ds-title', win);
      const ic = u.el('span', 'ds-ticon', tb);
      ic.innerHTML = CAL;
      u.el('span', 'ds-ttext', tb, C.app);
      const ctl = u.el('span', 'ds-tctl', tb);
      ['min', 'max', 'close'].forEach((t) => u.el('span', 'ds-tbtn ds-tbtn-' + t, ctl));
      const band = u.el('div', 'ds-band', win);
      const bi = u.el('span', 'ds-bigicon', band);
      bi.innerHTML = BIG;
      const grp = u.el('div', 'ds-group', win);
      if (ctx.display !== 'hidden') {
        const host = band;
        const note = u.el(
          'aside',
          ctx.display === 'panel' ? 'ds-brief' : ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note',
          host,
        );
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('span', 'ds-legend', grp, C.group);
      const stage = u.el('main', 'ds-stage', grp);
      const foot = u.el('footer', 'ds-footer', win);
      let submit = null;
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', `ds-submit ${cls}`, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = end(foot, 'ds-end-footer', label);
        else if (placement === 'link') submit = end(foot, 'ds-end-link', `${label} ›`);
        else if (placement === 'icon') submit = end(ctl, 'ds-end-icon', '✓');
        else submit = end(ctl, 'ds-end-header', label);
      }
      if (collision) decoy(foot, collision);
      const clr = u.el('button', 'ds-cancel', foot, 'Clear');
      clr.type = 'button';
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-reservation-values', rail);
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
