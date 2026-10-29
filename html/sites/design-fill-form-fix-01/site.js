(function () {
  'use strict';
  const C = { site: 'design-fill-form-fix-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const val = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const pref = labels.find((x) => val(x).toLowerCase() === 'apply') || labels[0],
        alts = labels.filter((x) => val(x).toLowerCase() !== 'apply');
      const common = !ctx.finish && r.bool(0.5),
        endLabel = common ? val(pref) : val(r.pick(alts.length ? alts : labels));
      const placement = ctx.finish ? null : common ? 'footer' : r.pick(['toolbar', 'toolbar', 'status', 'status']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const a = [...new Set(labels.map(val))].filter((x) => x.toLowerCase() !== endLabel.toLowerCase());
        if (a.length) collide = { label: cr.pick(a), where: cr.pick(['toolbar', 'status']) };
      }
      const page = u.el('div', 'app-shell', document.body),
        head = u.el('header', 'app-header', page);
      const brand = u.el('div', 'app-brand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 2h12l8 8v19H7z"/><path d="M19 2v8h8M12 17h10M12 22h8"/></svg><b>DocuFill</b>';
      if (ctx.display === 'header') {
        const note = u.el('div', 'task-header-note', head, ctx.instruction);
        note.setAttribute('aria-label', 'Task instruction');
      }
      const layout = u.el('div', 'app-layout', page),
        side = u.el('aside', 'side-nav', layout);
      const nav = u.el('nav', 'side-links', side);
      [
        ['▤', 'Document to Form'],
        ['▧', 'My Documents'],
        ['▤', 'Templates'],
        ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', i === 0 ? 'active' : '', nav);
        u.el('span', 'nav-ico', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const recent = u.el('section', 'recent-docs', side);
      u.el('h3', '', recent, 'Recent Documents');
      [
        ['Riverside Invoice', 'Mar 28, 2024'],
        ['Staples Receipt', 'Mar 12, 2024'],
        ['Office Depot Invoice', 'Feb 3, 2024'],
        ['Web Services Bill', 'Jan 18, 2024'],
        ['Cafe Receipt', 'Jan 7, 2024'],
      ].forEach((x, i) => {
        const row = u.el('div', i === 0 ? 'recent-row selected' : 'recent-row', recent);
        u.el('span', 'recent-file', row, '▤');
        const t = u.el('div', '', row);
        u.el('span', '', t, x[0]);
        u.el('small', '', t, x[1]);
      });
      const workspace = u.el('main', 'workspace', layout),
        win = u.el('section', 'task-window', workspace);
      win.setAttribute('aria-label', 'Document and form workspace');
      const stage = u.el('div', 'ds-stage', win);
      const tips = u.el('aside', 'tips-panel', win);
      tips.innerHTML =
        '<div class="tips-title"><span class="bulb">♧</span><b>Tips</b></div><ul><li>Copy the values from the document into the form.</li><li>Leave a field blank if the document does not contain that information.</li><li>Make sure dates, amounts and spelling match the document exactly.</li></ul>';
      if (ctx.display === 'panel') {
        const note = u.el('aside', 'task-panel-note', tips);
        u.el('b', '', note, 'Task');
        u.el('div', '', note, ctx.instruction);
        tips.insertBefore(note, tips.firstChild);
      }
      if (ctx.display === 'toast') {
        const note = u.el('aside', 'task-toast-note', tips, ctx.instruction);
        tips.insertBefore(note, tips.firstChild);
      }
      const dock = u.el('nav', 'bottom-dock', page);
      [
        ['◆', 'Home'],
        ['▯', 'Documents'],
        ['▣', 'Scan'],
        ['▦', 'Tools'],
      ].forEach((x, i) => {
        const b = u.el('button', i === 0 ? 'dock-active' : '', dock);
        b.type = 'button';
        u.el('span', 'dock-icon', b, x[0]);
        u.el('span', '', b, x[1]);
      });
      const make = (parent, cls, label, tag = 'button') => {
        const b = u.el(tag, cls, parent, label);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      };
      let submit = null;
      if (!ctx.finish && placement === 'toolbar') submit = make(head, 'header-end', endLabel);
      if (collide && collide.where === 'toolbar') decoy(head, collide.label);
      if (!ctx.finish && placement === 'footer') submit = make(win, 'window-end', endLabel);
      if (collide && collide.where === 'status') decoy(win, collide.label);
      if (!ctx.finish && placement === 'status') submit = make(dock, 'dock-end', endLabel);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'site-overlay overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const t = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, t[ctx.kind] || 'A message from DocuFill');
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
