(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-stock-08',
    'brand': 'JCA Trading - Demo Account',
    'instruction': 'top',
    'rail': 'Trade|Watchlist|Orders|Account|Settings|Help',
    'menu': 'File|Edit|View|Tools|Window',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, '−  □  ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-help', nav, 'Help');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const item = u.el('div', '', rail, t);
        item.dataset.icon = ['▰', '▤', '▧', '♙', '⚙', '?'][i];
      });
      const content = u.el('div', 'ds-content', body);
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      const size = ctx.size || {};
      if ((mode === 'left' || mode === 'right') && (size.width || innerWidth) < 1260) mode = 'top';
      if (mode === 'toast' && (size.height || innerHeight) < 700) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
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
      const er = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelValue = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || 'Submit');
      const labelRng = ctx.rng.fork('chrome/end-label');
      const submitLabel = labelRng.bool(0.5)
        ? 'Submit'
        : labelValue(labelRng.pick(labels.filter((x) => labelValue(x).toLowerCase() !== 'submit')));
      const endLabel = submitLabel;
      const place = er.pick(['footer', 'footer', 'footer', 'header', 'link', 'link']);
      let submit = null;
      if (!ctx.finish) {
        const parent = place === 'header' ? nav : foot;
        submit = u.el('button', 'ds-submit' + (place === 'link' ? ' ds-end-link' : ''), parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
        if (place === 'header' || place === 'link') {
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
        }
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit && place !== 'header') foot.insertBefore(clear, submit);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const other = labels.map(labelValue).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (other.length) {
            const decoy = u.el('button', 'ds-xtra', foot, labelValue(cr.pick(other)));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
            if (place !== 'header') foot.insertBefore(decoy, submit);
          }
        }
        const dr = ctx.rng.fork('chrome/decoy');
        const fillers = ctx.content && Array.isArray(ctx.content.DECOY_LABELS) ? ctx.content.DECOY_LABELS : [];
        if (fillers.length && dr.bool(0.15)) {
          const b = u.el('button', 'ds-xtra', foot, labelValue(dr.pick(fillers)));
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: b.textContent }));
          if (place !== 'header') foot.insertBefore(b, submit);
        }
      }
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Demo Account');
      u.el('ul', 'ds-quick-values', quick);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) ins.style.fontSize = 'clamp(21px,3vw,48px)';
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
