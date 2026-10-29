(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-generate-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'beos inspector instruction-' + ctx.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('path', { d: 'M15 2 25 11 27 20 23 27 14 25 5 18 4 10Z', fill: '#55c400', stroke: '#073e00', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'm10 8 3 7-4 3 8 2 5 9', fill: 'none', stroke: '#073e00', 'stroke-width': 2 }, icon);
      u.el('span', '', top, 'Number Checker');
      u.el('span', 'tab-close', top, '×');
      const logo = u.el('div', 'beos-logo', document.body);
      u.el('span', '', logo, 'Be');
      u.el('span', '', logo, 'OS');
      const center = u.el('div', 'center', app);
      u.el('div', 'brief' + (ctx.display === 'toast' ? ' brief-toast' : ''), center,
        ctx.display === 'header' || ctx.display === 'toast' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const title = u.el('div', 'inspector-title', aside);
      u.el('span', '', title, 'Inspector');
      u.el('span', 'inspector-close', title, '×');
      const windows = u.el('span', 'inspector-windows', title);
      u.el('span', 'window-zoom', windows);
      u.el('span', 'window-close', windows);
      u.el('p', 'aside-copy', aside);
      const footer = u.el('footer', 'bottom', app);
      u.el('span', 'ready', footer, 'Ready');
      u.el('span', 'version', footer, 'Number Checker  v1.0');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const cr = ctx.rng.fork('chrome/collide');
        const labels = (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const label = x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x));
        const placement = er.bool(.5) ? 'workbench' : er.pick(['footer', 'inspector']);
        const text = er.bool(.5) ? 'Submit' : label(er.pick(labels));
        const parent = placement === 'inspector' ? title : footer;
        submit = u.el('button', 'submit ' + (placement === 'inspector' ? 'inspector-submit' : ''), parent, text);
        submit.type = 'button';
        submit.dataset.placement = placement;
        submit.setAttribute('aria-label', text);
        submit.title = text;
        submit.addEventListener('click', ctx.submit);
        if (cr.bool(.3)) {
          const options = [...new Set(labels.map(label).filter(x => x.trim().toLowerCase() !== text.trim().toLowerCase()))];
          if (options.length) {
            const decoy = u.el('button', 'beos-xtra', footer, label(cr.pick(options)));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el('span', '', el, {
        cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?', promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      }[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  });
})();
