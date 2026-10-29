(function () {
  'use strict';
  const C = { site: 'design-fill-form-fix-04', menu: 'Data Entry|Documents|Batches|Reports|Administration' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabel = labels.find((x) => labelOf(x).toLowerCase() === 'submit') || labels[0];
      const endLabel = ctx.finish ? null : er.bool(0.5) ? labelOf(submitLabel) : labelOf(er.pick(labels));
      const placement = ctx.finish ? null : er.pick(['footer', 'toolbar', 'status']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(
          (x) => x.toLowerCase() !== String(endLabel).toLowerCase(),
        );
        if (choices.length) collide = { label: cr.pick(choices), where: cr.pick(['toolbar', 'status']) };
      }
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => {
        u.el('span', i ? '' : 'active', nav, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const box = (title, rows) => {
        const p = u.el('section', 'ds-summary', rail);
        u.el('h2', '', p, title);
        rows.forEach(([k, v]) => {
          const row = u.el('div', 'ds-summary-row', p);
          u.el('span', '', row, k);
          u.el('b', '', row, v);
        });
      };
      box('Batch Status', [
        ['Total Documents', '24'],
        ['Completed', '18'],
        ['Remaining', '6'],
      ]);
      box('Current Document', [['Document 19 of 24', '']]);
      const area = u.el('div', 'ds-content', body);
      const mode = ctx.display;
      if (mode === 'header') u.el('div', 'ds-header-note', area, ctx.instruction);
      const stage = u.el('main', 'ds-stage', area);
      if (mode === 'panel') {
        const note = u.el('aside', 'ds-brief', rail);
        u.el('h2', '', note, 'Instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (mode === 'toast') u.el('aside', 'ds-toast', area, ctx.instruction);
      let submit = null;
      const end = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'ds-end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      };
      if (placement === 'toolbar') {
        const tools = u.el('div', 'ds-toolbar', area);
        if (collide && collide.where === 'toolbar') decoy(tools, collide.label);
        submit = end(tools, 'ds-submit', endLabel);
      }
      const foot = u.el('footer', 'ds-footer', area);
      if (placement === 'footer' && !ctx.finish) submit = end(foot, 'ds-submit', endLabel);
      if (collide && collide.where === 'status') decoy(foot, collide.label);
      if (placement === 'status' && !ctx.finish) submit = end(foot, 'ds-status-end', endLabel);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
