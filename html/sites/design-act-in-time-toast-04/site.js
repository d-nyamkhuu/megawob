(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-toast-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.body;
      const top = u.el('header', 'ds-top', root);
      u.el('span', 'ds-brand', top, '▣　Workspace');
      const nav = u.el('nav', 'ds-menu', top);
      ['File', 'Edit', 'View', 'Go', 'Window', 'Services', 'Help'].forEach((x) => u.el('span', '', nav, x));
      u.el('div', 'ds-window-title', root, 'Network');
      let submit = null,
        label = 'Save',
        place = 'footer';
      const mk = (p, c) => {
        const b = u.el('button', c, p, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
          ls = (ctx.content && ctx.content.END_LABELS) || fallback,
          r = ctx.rng.fork('chrome/end'),
          orig = r.bool(0.5),
          picked = r.pick(ls);
        label = orig ? 'Save' : typeof picked === 'string' ? picked : 'Apply';
        place = orig ? 'footer' : r.pick(['footer', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const d = u.el('button', 'ds-pq', top, 'Continue');
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: 'Continue', collide: true }));
        }
        ['−', '□', '×'].forEach((x) => {
          const b = u.el('button', 'ds-window-control', top, x);
          b.type = 'button';
        });
        if (place === 'title') submit = mk(top, 'ds-submit ds-submit-title');
      }
      const body = u.el('div', 'ds-body', root),
        rail = u.el('aside', 'ds-rail', body);
      [
        ['◎', 'Network'],
        ['✉', 'Mail'],
        ['▣', 'Contacts'],
        ['▤', 'Documents'],
        ['▤', 'Print'],
        ['⚙', 'Preferences'],
      ].forEach(([icon, t], n) => {
        const a = u.el('div', 'ds-navitem' + (!n ? ' selected' : ''), rail);
        u.el('b', '', a, icon);
        u.el('span', '', a, t);
      });
      const work = u.el('div', 'ds-work', body),
        tabs = u.el('nav', 'ds-tabs', work);
      ['Accounts', 'Connection', 'Security', 'Proxies'].forEach((x, i) => u.el('span', i ? '' : 'active', tabs, x));
      const row = u.el('div', 'ds-main', work),
        stage = u.el('main', 'ds-stage', row),
        tips = u.el('aside', 'ds-tips', row);
      u.el('h2', '', tips, 'ⓘ　Security Tips');
      [
        'The code expires after a few minutes.',
        'Enter the code exactly as it appears.',
        'If you don’t see the code, check your device and try again.',
      ].forEach((x) => u.el('p', '', tips, '•　' + x));
      const mode = ctx.display || 'header';
      if (mode !== 'hidden') {
        const note = u.el('aside', 'ds-instruction', work, ctx.instruction);
        note.className = 'ds-instruction ds-instruction-' + mode;
      }
      const foot = u.el('footer', 'ds-footer', work);
      if (!ctx.finish && place === 'footer') submit = mk(foot, 'ds-submit');
      if (!ctx.finish && place === 'status') {
        const stat = u.el('div', 'ds-chase-status', root);
        submit = mk(stat, 'ds-submit');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
