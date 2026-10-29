(function () {
  'use strict';
  const C = { site: 'design-act-in-time-carousel-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.classList.add('platinum');
      const win = u.el('div', 'mac-window', document.body);
      const top = u.el('header', 'mac-titlebar', win);
      u.el('span', 'mac-appicon', top, '✿');
      u.el('strong', 'mac-title', top, 'Garden Shop');
      const note = u.el('div', 'mac-header-note', top);
      if (ctx.display === 'header') note.textContent = ctx.instruction;
      const controls = u.el('div', 'mac-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('button', '', controls, x));
      let submit = null,
        label = 'Continue',
        placement = 'footer';
      const make = (parent, cl, txt) => {
        const b = u.el('button', cl, parent, txt);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = txt;
        b.setAttribute('aria-label', txt);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        const labels = (ctx.content && ctx.content.END_LABELS) || ['Continue', 'Done', 'Finish', 'Submit'];
        const r = ctx.rng.fork('chrome/end');
        const alt = r.bool(0.5);
        if (alt) {
          const picked = r.pick(labels);
          label =
            typeof picked === 'string'
              ? picked
              : (picked && (picked.label || picked.text || picked.name)) || 'Continue';
        }
        placement = alt ? r.pick(['footer', 'title', 'status']) : 'footer';
        if (placement === 'status') placement = 'footer';
        if (placement === 'title') submit = make(controls, 'mac-submit mac-submit-title', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const d = u.el('button', 'mac-xtra', controls, 'Confirm');
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
        }
      }
      const shell = u.el('div', 'mac-content', win);
      const side = u.el('aside', 'mac-sidebar', shell);
      const sh = u.el('div', 'mac-sidebar-title', side, 'Featured Items');
      const list = u.el('div', 'mac-list', side);
      const products = [
        ['✿', 'Daisy Planter', '$14.99'],
        ['▰', 'Terracotta Pots', '$12.99'],
        ['♟', 'Solar Garden Light', '$24.99'],
        ['♬', 'Wind Chimes', '$19.99'],
        ['♧', 'Hanging Planter, Macrame', '$28.99'],
        ['♜', 'Watering Can', '$16.99'],
        ['◆', 'Garden Trowel', '$9.99'],
        ['▧', 'Herb Seed Set', '$11.99'],
        ['♟', 'Butterfly Feeder', '$18.99'],
        ['▤', 'Outdoor Bench', '$129.00'],
      ];
      products.forEach((p, i) => {
        const row = u.el('div', 'mac-row' + (!i ? ' selected' : ''), list);
        u.el('span', 'mac-thumb', row, p[0]);
        const text = u.el('span', 'mac-row-copy', row);
        u.el('span', '', text, p[1]);
        u.el('small', '', text, p[2]);
      });
      const right = u.el('main', 'mac-right', shell);
      if (ctx.display === 'panel') {
        const panel = u.el('div', 'mac-panel-note', right, ctx.instruction);
        panel.setAttribute('aria-label', 'Task instructions');
      }
      const stage = u.el('div', 'ds-stage', right);
      const foot = u.el('footer', 'mac-footer', win);
      u.el('span', 'mac-footer-status', foot, 'Garden Shop  •  Featured collection');
      if (!ctx.finish && placement === 'footer') submit = make(foot, 'mac-submit', label);
      if (!ctx.finish && placement === 'status') submit = make(foot, 'mac-submit mac-submit-status', label);
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'mac-toast', win);
        u.el('span', '', toast, ctx.instruction);
        const x = u.el('button', '', toast, '×');
        x.onclick = () => toast.remove();
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'Garden Shop uses cookies to remember your preferences.',
        toast: 'Your preferences have been saved.',
        chat: 'Welcome to Garden Shop. How may we help?',
        promo: 'Discover the new Spring collection.',
        banner: 'The Garden Shop is open daily.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'Welcome to Garden Shop.');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
